/**
 * OIDC Token Verification for Google Pub/Sub
 * Verifies JWT tokens from Google Cloud Pub/Sub push subscriptions
 */

interface GooglePublicKey {
  kid: string;
  n: string;
  e: string;
  alg: string;
  kty: string;
  use: string;
}

interface GooglePublicKeysResponse {
  keys: GooglePublicKey[];
}

interface DecodedToken {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  email?: string;
  email_verified?: boolean;
}

// Cache for Google's public keys (1 hour TTL)
let keysCache: { keys: GooglePublicKey[]; fetchedAt: number } | null = null;
const KEYS_CACHE_TTL = 3600000; // 1 hour in milliseconds

/**
 * Fetch Google's public keys for JWT verification
 */
async function getGooglePublicKeys(): Promise<GooglePublicKey[]> {
  const now = Date.now();
  
  // Return cached keys if still valid
  if (keysCache && (now - keysCache.fetchedAt) < KEYS_CACHE_TTL) {
    return keysCache.keys;
  }

  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
    if (!response.ok) {
      throw new Error(`Failed to fetch Google public keys: ${response.status}`);
    }

    const data: GooglePublicKeysResponse = await response.json();
    keysCache = {
      keys: data.keys,
      fetchedAt: now
    };

    return data.keys;
  } catch (error) {
    console.error('Error fetching Google public keys:', error);
    throw error;
  }
}

/**
 * Decode JWT token without verification (for header inspection)
 */
function decodeToken(token: string): { header: any; payload: DecodedToken } {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
  const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

  return { header, payload };
}

/**
 * Convert base64url to ArrayBuffer
 */
function base64UrlToArrayBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Verify JWT signature using Google's public key
 */
async function verifySignature(
  token: string,
  publicKey: GooglePublicKey
): Promise<boolean> {
  try {
    const parts = token.split('.');
    const signatureInput = `${parts[0]}.${parts[1]}`;
    const signature = base64UrlToArrayBuffer(parts[2]);

    // Import the public key
    const keyData = {
      kty: publicKey.kty,
      n: publicKey.n,
      e: publicKey.e,
      alg: publicKey.alg,
      use: publicKey.use
    };

    const cryptoKey = await crypto.subtle.importKey(
      'jwk',
      keyData,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256'
      },
      false,
      ['verify']
    );

    // Verify the signature
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureInput);
    
    const isValid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      signature,
      data
    );

    return isValid;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Verify Google Pub/Sub OIDC token
 * @param authHeader - Authorization header value (Bearer token)
 * @param expectedAudience - Expected audience claim (service account email or endpoint URL)
 * @returns true if token is valid, false otherwise
 */
export async function verifyPubSubToken(
  authHeader: string,
  expectedAudience?: string
): Promise<{ valid: boolean; email?: string; error?: string }> {
  try {
    // Extract Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'Missing or invalid Authorization header' };
    }

    const token = authHeader.substring(7);

    // Decode token (without verification)
    const { header, payload } = decodeToken(token);

    // Validate issuer
    const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
    if (!validIssuers.includes(payload.iss)) {
      return { valid: false, error: `Invalid issuer: ${payload.iss}` };
    }

    // Validate audience if provided
    if (expectedAudience && payload.aud !== expectedAudience) {
      return { valid: false, error: `Invalid audience: ${payload.aud}` };
    }

    // Validate expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return { valid: false, error: 'Token expired' };
    }

    // Validate issued at time (not too far in the future)
    if (payload.iat > now + 300) { // Allow 5 minutes clock skew
      return { valid: false, error: 'Token issued in the future' };
    }

    // Get Google's public keys
    const publicKeys = await getGooglePublicKeys();

    // Find the matching key by kid
    const publicKey = publicKeys.find(key => key.kid === header.kid);
    if (!publicKey) {
      return { valid: false, error: `Public key not found for kid: ${header.kid}` };
    }

    // Verify signature
    const signatureValid = await verifySignature(token, publicKey);
    if (!signatureValid) {
      return { valid: false, error: 'Invalid signature' };
    }

    // Token is valid
    return {
      valid: true,
      email: payload.email
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
