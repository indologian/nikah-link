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
  console.log("Inserting premium themes...");
  
  const newThemes = [
    {
      name: "Vintage Elegance",
      slug: "vintage-elegance",
      category: "minimalis",
      thumbnail_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
      is_premium: true,
      is_active: true,
      colors: {
        background: "#F9F6F0",
        text: "#4A4036",
        primary: "#8B7355",
        accent: "#C1A57B"
      },
      sort_order: 2
    },
    {
      name: "Royal Botanical",
      slug: "royal-botanical",
      category: "floral",
      thumbnail_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
      is_premium: true,
      is_active: true,
      colors: {
        background: "#064E3B",
        text: "#F3F4F6",
        primary: "#D4AF37",
        accent: "#FCD34D"
      },
      sort_order: 3
    },
    {
      name: "Wayang Classic",
      slug: "wayang-classic",
      category: "budaya",
      thumbnail_url: "https://images.unsplash.com/photo-1583939000140-5242502690d7?q=80&w=600&auto=format&fit=crop",
      is_premium: true,
      is_active: true,
      colors: {
        background: "#2A1B14",
        text: "#F5E6D3",
        primary: "#D4AF37",
        accent: "#8B4513"
      },
      sort_order: 4
    },
    {
      name: "Elegant Blush",
      slug: "elegant-blush",
      category: "elegan",
      thumbnail_url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop",
      is_premium: true,
      is_active: true,
      colors: {
        background: "#FFF5F5",
        text: "#4A4A4A",
        primary: "#B76E79",
        accent: "#E8D8D8"
      },
      sort_order: 5
    },
    {
      name: "Midnight Sparkle",
      slug: "midnight-sparkle",
      category: "dark",
      thumbnail_url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop",
      is_premium: true,
      is_active: true,
      colors: {
        background: "#0B132B",
        text: "#FFFFFF",
        primary: "#FFD700",
        accent: "#1C2541"
      },
      sort_order: 6
    }
  ];
  
  const { error: insertError } = await supabase.from('themes').upsert(newThemes, { onConflict: 'slug' });
  
  if (insertError) {
    console.error("Error inserting themes:", insertError);
  } else {
    console.log("Successfully inserted Premium themes.");
  }
}

main();
