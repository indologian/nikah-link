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
    },
    {
      name: "Serein White",
      slug: "serein-white",
      category: "minimalis",
      thumbnail_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
      is_premium: true,
      is_active: true,
      colors: {
        background: "#FFFFFF",
        text: "#333333",
        primary: "#9CA3AF",
        accent: "#E5E7EB"
      },
      sort_order: 7
    },
    {
      name: "Balinese Harmony",
      slug: "balinese-harmony",
      category: "budaya",
      thumbnail_url: "https://images.unsplash.com/photo-1543956690-333e387f3b60?q=80&w=600&auto=format&fit=crop",
      is_premium: true,
      is_active: true,
      colors: {
        background: "#F4F4F0",
        text: "#4B4642",
        primary: "#D4AF37",
        accent: "#8B7355"
      },
      sort_order: 8
    },
    {
      name: "Magazine Cover",
      slug: "magazine-cover",
      category: "elegan",
      thumbnail_url: "https://images.unsplash.com/photo-1532712938736-98c5411961a8?q=80&w=600&auto=format&fit=crop",
      is_premium: true,
      is_active: true,
      colors: {
        background: "#FFFFFF",
        text: "#000000",
        primary: "#000000",
        accent: "#E5E5E5"
      },
      sort_order: 9
    },
    {
      name: "Javanese Batik",
      slug: "javanese-batik",
      category: "budaya",
      thumbnail_url: "https://images.unsplash.com/photo-1583939000140-5242502690d7?q=80&w=600&auto=format&fit=crop",
      is_premium: true,
      is_active: true,
      colors: {
        background: "#FDFBF7",
        text: "#3E2723",       
        primary: "#B48B3D",
        accent: "#5D4037"
      },
      sort_order: 10
    },
    {
      name: "Line Art Botanical",
      slug: "line-art-botanical",
      category: "floral",
      thumbnail_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
      is_premium: true,
      is_active: true,
      colors: {
        background: "#FAF9F6",
        text: "#2C3E2D",       
        primary: "#6B8E23",
        accent: "#E2C2B3"
      },
      sort_order: 11
    },
    {
      name: "Royal Gold",
      slug: "royal-gold",
      category: "elegan",
      thumbnail_url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop",
      is_premium: true,
      is_active: true,
      colors: {
        background: "#080B13",
        text: "#FFFFFF",       
        primary: "#D4AF37",
        accent: "#F2D26D"
      },
      sort_order: 12
    },
    {
      name: "Ocean Breeze",
      slug: "ocean-breeze",
      category: "minimalis",
      thumbnail_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
      is_premium: true,
      is_active: true,
      colors: {
        background: "#EEF4ED",
        text: "#0B2545",       
        primary: "#DDA15E",
        accent: "#134074"
      },
      sort_order: 13
    },
    {
      name: "Rustic Woodland",
      slug: "rustic-woodland",
      category: "floral",
      thumbnail_url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=600&auto=format&fit=crop",
      is_premium: true,
      is_active: true,
      colors: {
        background: "#2A3B2C",
        text: "#F4F1EA",       
        primary: "#C19A6B",
        accent: "#4A3B32"
      },
      sort_order: 14
    },
    {
      name: "Modern Monochrome",
      slug: "modern-monochrome",
      category: "dark",
      thumbnail_url: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600&auto=format&fit=crop",
      is_premium: true,
      is_active: true,
      colors: {
        background: "#111111",
        text: "#FFFFFF",       
        primary: "#F9F9F9",
        accent: "#888888"
      },
      sort_order: 15
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
