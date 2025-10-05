import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

/**
 * Get encryption key from environment
 */
function getEncryptionKey(): Buffer {
  const key = Deno.env.get("GMAIL_ENCRYPTION_KEY");
  if (!key) {
    throw new Error("GMAIL_ENCRYPTION_KEY not found in environment");
  }
  // Key should be 32 bytes for AES-256
  return Buffer.from(key, "hex");
}

/**
 * Encrypt text using AES-256-CBC
 */
export function encrypt(text: string): string {
  const iv = randomBytes(IV_LENGTH);
  const key = getEncryptionKey();
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  // Return IV + encrypted text
  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt text using AES-256-CBC
 */
export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid encrypted text format");
  }
  
  const iv = Buffer.from(parts[0], "hex");
  const encrypted = parts[1];
  const key = getEncryptionKey();
  
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}
