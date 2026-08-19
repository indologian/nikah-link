import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env.local manually
const envPath = path.resolve('.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const envs = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envs[match[1]] = match[2].replace(/["']/g, '');
  }
});

const supabaseUrl = envs.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envs.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Deactivating old dummy themes...");
  const { error: deactivateError } = await supabase.from('themes').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (deactivateError) {
    console.error("Error deactivating themes:", deactivateError);
    return;
  }
  
  console.log("Old themes deactivated.");
  
  console.log("Inserting new Minimalis theme...");
  const newTheme = {
    name: "Minimalist Clean",
    slug: "minimalis",
    category: "minimalis",
    thumbnail_url: null,
    is_premium: false,
    is_active: true,
    colors: {
      background: "#f8fafc",
      text: "#0f172a",
      primary: "#94a3b8",
      accent: "#64748b"
    },
    sort_order: 1
  };
  
  const { error: insertError } = await supabase.from('themes').insert(newTheme);
  
  if (insertError) {
    console.error("Error inserting theme:", insertError);
  } else {
    console.log("Successfully inserted Minimalist Clean theme.");
  }
}

main();
