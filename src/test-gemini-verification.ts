// Temporary test file - will be deleted after verification
import { supabase } from "@/integrations/supabase/client";

export async function testGeminiKey() {
  try {
    const { data, error } = await supabase.functions.invoke('test-gemini-key');
    
    if (error) {
      console.error('❌ Gemini key test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Gemini key test result:', data);
    return data;
  } catch (err) {
    console.error('❌ Exception during Gemini key test:', err);
    return { success: false, error: err.message };
  }
}

// Auto-run test
testGeminiKey().then(result => {
  console.log('=== GEMINI KEY VERIFICATION ===');
  console.log(JSON.stringify(result, null, 2));
});
