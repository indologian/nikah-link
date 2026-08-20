import type { ThemeDefinition, ThemeField } from "@/types/theme";

const quoteFields = (placeholder = "Dan di antara tanda-tanda kekuasaan-Nya..."): ThemeField[] => [
  { name: "quote", label: "Kutipan", type: "textarea", placeholder },
  { name: "gallery_1", label: "Foto Galeri 1", type: "image" },
  { name: "gallery_2", label: "Foto Galeri 2", type: "image" },
  { name: "gallery_3", label: "Foto Galeri 3", type: "image" },
];

export const THEME_DEFINITIONS: Record<string, ThemeDefinition> = {
  "minimalis": { slug: "minimalis", fields: [{ name: "greeting", label: "Salam Pembuka Khusus", type: "text", placeholder: "misal: Assalamualaikum Wr. Wb." }] },
  "vintage-elegance": { slug: "vintage-elegance", fields: quoteFields() },
  "royal-botanical": { slug: "royal-botanical", fields: quoteFields() },
  "wayang-classic": { slug: "wayang-classic", fields: quoteFields("Maha Suci Allah yang telah menciptakan...") },
  "elegant-blush": { slug: "elegant-blush", fields: quoteFields("To love and to be loved is to feel the sun from both sides.") },
  "midnight-sparkle": { slug: "midnight-sparkle", fields: quoteFields("You are the stars in my dark night.") },
  "serein-white": { slug: "serein-white", fields: quoteFields("To love and be loved...") },
  "balinese-harmony": { slug: "balinese-harmony", fields: quoteFields("Om Swastyastu...") },
  "magazine-cover": { slug: "magazine-cover", fields: quoteFields("A modern romance...") },
  "javanese-batik": { slug: "javanese-batik", fields: quoteFields("Tresno jalaran soko kulino...") },
  "line-art-botanical": { slug: "line-art-botanical", fields: quoteFields("Growing together in love...") },
  "royal-gold": { slug: "royal-gold", fields: quoteFields("A lifetime of luxury and love...") },
  "ocean-breeze": { slug: "ocean-breeze", fields: quoteFields("Love like the ocean...").slice(0, 1) },
  "rustic-woodland": { slug: "rustic-woodland", fields: quoteFields("Rooted in love...").slice(0, 1) },
  "modern-monochrome": { slug: "modern-monochrome", fields: quoteFields("Elegance in simplicity...").slice(0, 1) },
  "cosmic-starlight": { slug: "cosmic-starlight", fields: quoteFields("Written in the stars...").slice(0, 1) },
  "ethereal-watercolor": { slug: "ethereal-watercolor", fields: quoteFields("A dream painted in reality...").slice(0, 1) },
  "heritage-gunungan": { slug: "heritage-gunungan", fields: quoteFields("Pahargyan Ageng...").slice(0, 1) },
  "botanical-elegance": { slug: "botanical-elegance", fields: quoteFields() },
  "golden-arch": { slug: "golden-arch", fields: quoteFields() },
  "terracotta-rust": { slug: "terracotta-rust", fields: quoteFields() },
  "ethereal-snow": { slug: "ethereal-snow", fields: quoteFields("Winter romance...") },
  "geometric-abstract": { slug: "geometric-abstract", fields: quoteFields("Abstract love...").slice(0, 1) },
  "editorial-gallery": { slug: "editorial-gallery", fields: quoteFields() },
};

export const THEME_KEYS = Object.freeze(Object.keys(THEME_DEFINITIONS));

export function getThemeDefinition(componentKey: string): ThemeDefinition {
  return THEME_DEFINITIONS[componentKey] ?? { slug: componentKey, fields: [] };
}

export function hasThemeDefinition(componentKey: string): boolean {
  return Object.prototype.hasOwnProperty.call(THEME_DEFINITIONS, componentKey);
}
