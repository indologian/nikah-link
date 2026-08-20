import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const palettes = {
  "balinese-harmony": { primary: "#D4AF37", accent: "#8B7355", background: "#F4F4F0", text: "#4B4642" },
  "botanical-elegance": { primary: "#869578", accent: "#E2D2CA", background: "#FDFDF9", text: "#5A6351" },
  "cosmic-starlight": { primary: "#A0A0FF", accent: "#8080C0", background: "#050510", text: "#E0E0FF" },
  "editorial-gallery": { primary: "#000000", accent: "#888888", background: "#F5F5F5", text: "#111111" },
  "elegant-blush": { primary: "#B76E79", accent: "#E8D8D8", background: "#FFF5F5", text: "#4A4A4A" },
  "ethereal-snow": { primary: "#C0C0C0", accent: "#0B132B", background: "#1C2541", text: "#E5E7EB" },
  "ethereal-watercolor": { primary: "#FAD2E1", accent: "#C5D5CB", background: "#FDFBF7", text: "#4A4A4A" },
  "geometric-abstract": { primary: "#B76E79", accent: "#1A1A1A", background: "#0F0F0F", text: "#E0E0E0" },
  "golden-arch": { primary: "#D4AF37", accent: "#1E1E1E", background: "#F5F4F0", text: "#1E1E1E" },
  "heritage-gunungan": { primary: "#D4AF37", accent: "#2A1515", background: "#1F1010", text: "#F3E5D8" },
  "javanese-batik": { primary: "#B48B3D", accent: "#5D4037", background: "#FDFBF7", text: "#3E2723" },
  "line-art-botanical": { primary: "#6B8E23", accent: "#E2C2B3", background: "#FAF9F6", text: "#2C3E2D" },
  "magazine-cover": { primary: "#000000", accent: "#E5E5E5", background: "#FFFFFF", text: "#000000" },
  "midnight-sparkle": { primary: "#FFD700", accent: "#1C2541", background: "#0B132B", text: "#FFFFFF" },
  "minimalis": { primary: "#94A3B8", accent: "#64748B", background: "#F8FAFC", text: "#0F172A" },
  "modern-monochrome": { primary: "#F9F9F9", accent: "#888888", background: "#111111", text: "#FFFFFF" },
  "ocean-breeze": { primary: "#DDA15E", accent: "#134074", background: "#EEF4ED", text: "#0B2545" },
  "royal-botanical": { primary: "#D4AF37", accent: "#FCD34D", background: "#064E3B", text: "#F3F4F6" },
  "royal-gold": { primary: "#D4AF37", accent: "#F2D26D", background: "#080B13", text: "#FFFFFF" },
  "rustic-woodland": { primary: "#C19A6B", accent: "#4A3B32", background: "#2A3B2C", text: "#F4F1EA" },
  "serein-white": { primary: "#9CA3AF", accent: "#E5E7EB", background: "#FFFFFF", text: "#333333" },
  "terracotta-rust": { primary: "#C87963", accent: "#A65E49", background: "#F7F3EE", text: "#4A3B32", secondary: "#FFFFFF" },
  "vintage-elegance": { primary: "#8B7355", accent: "#C1A57B", background: "#F9F6F0", text: "#4A4036" },
  "wayang-classic": { primary: "#D4AF37", accent: "#8B4513", background: "#2A1B14", text: "#F5E6D3" },
};

const fileToTheme = {
  BalineseHarmonyTheme: "balinese-harmony",
  BotanicalEleganceTheme: "botanical-elegance",
  CosmicStarlightTheme: "cosmic-starlight",
  EditorialGalleryTheme: "editorial-gallery",
  ElegantBlushTheme: "elegant-blush",
  EtherealSnowTheme: "ethereal-snow",
  EtherealWatercolorTheme: "ethereal-watercolor",
  GeometricAbstractTheme: "geometric-abstract",
  GoldenArchTheme: "golden-arch",
  HeritageGununganTheme: "heritage-gunungan",
  JavaneseBatikTheme: "javanese-batik",
  LineArtBotanicalTheme: "line-art-botanical",
  MagazineCoverTheme: "magazine-cover",
  MidnightSparkleTheme: "midnight-sparkle",
  MinimalistTheme: "minimalis",
  ModernMonochromeTheme: "modern-monochrome",
  OceanBreezeTheme: "ocean-breeze",
  RoyalBotanicalTheme: "royal-botanical",
  RoyalGoldTheme: "royal-gold",
  RusticWoodlandTheme: "rustic-woodland",
  SereinWhiteTheme: "serein-white",
  TerracottaRustTheme: "terracotta-rust",
  VintageEleganceTheme: "vintage-elegance",
  WayangClassicTheme: "wayang-classic",
};

function rgb(hex) {
  const value = hex.replace("#", "");
  const bigint = Number.parseInt(value, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function distance(a, b) {
  return Math.sqrt(a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0));
}

function nearestRole(hex, palette) {
  const candidates = Object.entries(palette).filter(([key]) => key !== "secondary");
  const normalized = hex.toUpperCase();
  const exact = candidates.find(([, value]) => value.toUpperCase() === normalized);
  if (exact) return exact[0];
  const target = rgb(normalized);
  return candidates.reduce((best, [role, value]) => {
    const score = distance(target, rgb(value));
    return !best || score < best.score ? { role, score } : best;
  }, null)?.role || "primary";
}

function replaceColors(source, palette) {
  const colorRoleCache = new Map();
  const roleFor = (hex) => {
    const normalized = hex.toUpperCase();
    if (!colorRoleCache.has(normalized)) colorRoleCache.set(normalized, nearestRole(normalized, palette));
    return colorRoleCache.get(normalized);
  };

  const replaceBracketColor = (match, hex, opacity) => {
    const role = roleFor(hex);
    if (!opacity) return `[var(--theme-${role})]`;
    const alpha = Math.max(0, Math.min(100, Number(opacity))) / 100;
    return `[rgba(var(--theme-${role}-rgb),${alpha})]`;
  };

  let output = source.replace(/\[#([0-9a-fA-F]{6})\](?:\/(\d{1,3}))?/g, replaceBracketColor);
  output = output.replace(/#([0-9a-fA-F]{6})(?:\/(\d{1,3}))?/g, (match, hex, opacity) => {
    const role = roleFor(`#${hex}`);
    if (!opacity) return `var(--theme-${role})`;
    const alpha = Math.max(0, Math.min(100, Number(opacity))) / 100;
    return `rgba(var(--theme-${role}-rgb),${alpha})`;
  });
  return output;
}

function hardenUploads(filePath) {
  let source = fs.readFileSync(filePath, "utf8");
  if (!source.includes("const getUserStoragePath = async")) {
    const marker = "  const uploadImage = async";
    const helper = `  const getUserStoragePath = async (fileName: string) => {\n    const { data: { user } } = await supabase.auth.getUser();\n    if (!user) throw new Error("Sesi login tidak ditemukan.");\n    return \`users/\${user.id}/\${fileName}\`;\n  };\n\n`;
    source = source.replace(marker, helper + marker);
  }
  source = source.replaceAll("const filePath = `uploads/${fileName}`;", "const filePath = await getUserStoragePath(`uploads/${fileName}`);");
  source = source.replaceAll("upsert: true", "upsert: false");
  fs.writeFileSync(filePath, source);
}

for (const [baseName, themeKey] of Object.entries(fileToTheme)) {
  const filePath = path.join(ROOT, "components", "themes", `${baseName}.tsx`);
  if (!fs.existsSync(filePath)) continue;
  const palette = palettes[themeKey];
  if (!palette) continue;
  const before = fs.readFileSync(filePath, "utf8");
  const after = replaceColors(before, palette);
  if (after !== before) fs.writeFileSync(filePath, after);
}

for (const file of [
  path.join(ROOT, "app", "dashboard", "undangan", "baru", "page.tsx"),
  path.join(ROOT, "app", "dashboard", "undangan", "[id]", "edit", "page.tsx"),
]) {
  if (fs.existsSync(file)) hardenUploads(file);
}

console.log("Theme token migration and user-scoped storage upload hardening completed.");
