import dynamic from 'next/dynamic';

export type FieldType = 'text' | 'textarea' | 'url' | 'boolean' | 'date' | 'image';

export interface ThemeField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: any;
}

export interface ThemeConfig {
  slug: string;
  component: React.ComponentType<any>;
  fields: ThemeField[];
}

// Dynamically import theme components to avoid huge bundles
const MinimalistTheme = dynamic(() => import('@/components/themes/MinimalistTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div></div>
});

const VintageEleganceTheme = dynamic(() => import('@/components/themes/VintageEleganceTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0]"><div className="w-8 h-8 border-4 border-[#8B7355]/30 border-t-[#8B7355] rounded-full animate-spin"></div></div>
});

const RoyalBotanicalTheme = dynamic(() => import('@/components/themes/RoyalBotanicalTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#064E3B]"><div className="w-8 h-8 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div></div>
});

const WayangClassicTheme = dynamic(() => import('@/components/themes/WayangClassicTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#2A1B14]"><div className="w-8 h-8 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div></div>
});

const ElegantBlushTheme = dynamic(() => import('@/components/themes/ElegantBlushTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#FFF5F5]"><div className="w-8 h-8 border-4 border-[#B76E79]/30 border-t-[#B76E79] rounded-full animate-spin"></div></div>
});

const MidnightSparkleTheme = dynamic(() => import('@/components/themes/MidnightSparkleTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#0B132B]"><div className="w-8 h-8 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin"></div></div>
});

const SereinWhiteTheme = dynamic(() => import('@/components/themes/SereinWhiteTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div></div>
});

const BalineseHarmonyTheme = dynamic(() => import('@/components/themes/BalineseHarmonyTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#F4F4F0]"><div className="w-8 h-8 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div></div>
});

const MagazineCoverTheme = dynamic(() => import('@/components/themes/MagazineCoverTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div></div>
});

const JavaneseBatikTheme = dynamic(() => import('@/components/themes/JavaneseBatikTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]"><div className="w-8 h-8 border-4 border-[#B48B3D]/30 border-t-[#B48B3D] rounded-full animate-spin"></div></div>
});

const LineArtBotanicalTheme = dynamic(() => import('@/components/themes/LineArtBotanicalTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]"><div className="w-8 h-8 border-4 border-[#6B8E23]/30 border-t-[#6B8E23] rounded-full animate-spin"></div></div>
});

const RoyalGoldTheme = dynamic(() => import('@/components/themes/RoyalGoldTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#080B13]"><div className="w-8 h-8 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div></div>
});

const OceanBreezeTheme = dynamic(() => import('@/components/themes/OceanBreezeTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#0B2545]"><div className="w-8 h-8 border-4 border-[#8DA9C4]/30 border-t-[#DDA15E] rounded-full animate-spin"></div></div>
});

const RusticWoodlandTheme = dynamic(() => import('@/components/themes/RusticWoodlandTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#2A3B2C]"><div className="w-8 h-8 border-4 border-[#C19A6B]/30 border-t-[#C19A6B] rounded-full animate-spin"></div></div>
});

const ModernMonochromeTheme = dynamic(() => import('@/components/themes/ModernMonochromeTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#111111]"><div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div></div>
});

const CosmicStarlightTheme = dynamic(() => import('@/components/themes/CosmicStarlightTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#050510]"><div className="w-8 h-8 border-4 border-[#A0A0FF]/30 border-t-[#A0A0FF] rounded-full animate-spin"></div></div>
});

const EtherealWatercolorTheme = dynamic(() => import('@/components/themes/EtherealWatercolorTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]"><div className="w-8 h-8 border-4 border-[#FAD2E1]/30 border-t-[#FAD2E1] rounded-full animate-spin"></div></div>
});

const HeritageGununganTheme = dynamic(() => import('@/components/themes/HeritageGununganTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#1F1010]"><div className="w-8 h-8 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div></div>
});

const BotanicalEleganceTheme = dynamic(() => import('@/components/themes/BotanicalEleganceTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#FDFDF9]"><div className="w-8 h-8 border-4 border-[#869578]/30 border-t-[#869578] rounded-full animate-spin"></div></div>
});

const GoldenArchTheme = dynamic(() => import('@/components/themes/GoldenArchTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]"><div className="w-8 h-8 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div></div>
});

const TerracottaRustTheme = dynamic(() => import('@/components/themes/TerracottaRustTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#F7F3EE]"><div className="w-8 h-8 border-4 border-[#C87963]/30 border-t-[#C87963] rounded-full animate-spin"></div></div>
});

const EtherealSnowTheme = dynamic(() => import('@/components/themes/EtherealSnowTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#1C2541]"><div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div></div>
});

const GeometricAbstractTheme = dynamic(() => import('@/components/themes/GeometricAbstractTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]"><div className="w-8 h-8 border-4 border-[#B76E79]/30 border-t-[#B76E79] rounded-full animate-spin"></div></div>
});

const EditorialGalleryTheme = dynamic(() => import('@/components/themes/EditorialGalleryTheme'), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]"><div className="w-8 h-8 border-4 border-black/30 border-t-black rounded-full animate-spin"></div></div>
});

// A fallback component if a theme is not found
const FallbackTheme = ({ invitation }: { invitation: any }) => (
  <div className="min-h-screen flex items-center justify-center flex-col gap-4 p-8 text-center bg-white">
    <h1 className="text-2xl font-bold text-slate-800">Tema Tidak Ditemukan</h1>
    <p className="text-slate-500">Undangan {invitation?.bride_name} & {invitation?.groom_name} menggunakan tema yang belum didukung atau sedang dalam pemeliharaan.</p>
  </div>
);

export const themesConfig: Record<string, ThemeConfig> = {
  "minimalis": {
    slug: "minimalis",
    component: MinimalistTheme,
    fields: [
      {
        name: "greeting",
        label: "Salam Pembuka Khusus",
        type: "text",
        placeholder: "misal: Assalamualaikum Wr. Wb."
      }
    ]
  },
  "vintage-elegance": {
    slug: "vintage-elegance",
    component: VintageEleganceTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan Pernikahan",
        type: "textarea",
        placeholder: "Dan di antara tanda-tanda kekuasaan-Nya..."
      }
    ]
  },
  "royal-botanical": {
    slug: "royal-botanical",
    component: RoyalBotanicalTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan Pernikahan",
        type: "textarea",
        placeholder: "Dan di antara tanda-tanda kekuasaan-Nya..."
      }
    ]
  },
  "wayang-classic": {
    slug: "wayang-classic",
    component: WayangClassicTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "Maha Suci Allah yang telah menciptakan..."
      }
    ]
  },
  "elegant-blush": {
    slug: "elegant-blush",
    component: ElegantBlushTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "To love and to be loved is to feel the sun from both sides."
      }
    ]
  },
  "midnight-sparkle": {
    slug: "midnight-sparkle",
    component: MidnightSparkleTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "You are the stars in my dark night."
      }
    ]
  },
  "serein-white": {
    slug: "serein-white",
    component: SereinWhiteTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "To love and be loved..."
      }
    ]
  },
  "balinese-harmony": {
    slug: "balinese-harmony",
    component: BalineseHarmonyTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "Om Swastyastu..."
      }
    ]
  },
  "magazine-cover": {
    slug: "magazine-cover",
    component: MagazineCoverTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "A modern romance..."
      }
    ]
  },
  "javanese-batik": {
    slug: "javanese-batik",
    component: JavaneseBatikTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "Tresno jalaran soko kulino..."
      }
    ]
  },
  "line-art-botanical": {
    slug: "line-art-botanical",
    component: LineArtBotanicalTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "Growing together in love..."
      }
    ]
  },
  "royal-gold": {
    slug: "royal-gold",
    component: RoyalGoldTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "A lifetime of luxury and love..."
      }
    ]
  },
  "ocean-breeze": {
    slug: "ocean-breeze",
    component: OceanBreezeTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "Love like the ocean..."
      }
    ]
  },
  "rustic-woodland": {
    slug: "rustic-woodland",
    component: RusticWoodlandTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "Rooted in love..."
      }
    ]
  },
  "modern-monochrome": {
    slug: "modern-monochrome",
    component: ModernMonochromeTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "Elegance in simplicity..."
      }
    ]
  },
  "cosmic-starlight": {
    slug: "cosmic-starlight",
    component: CosmicStarlightTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "Written in the stars..."
      }
    ]
  },
  "ethereal-watercolor": {
    slug: "ethereal-watercolor",
    component: EtherealWatercolorTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "A dream painted in reality..."
      }
    ]
  },
  "heritage-gunungan": {
    slug: "heritage-gunungan",
    component: HeritageGununganTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "Pahargyan Ageng..."
      }
    ]
  },
  "botanical-elegance": {
    slug: "botanical-elegance",
    component: BotanicalEleganceTheme,
    fields: [
      { name: "quote", label: "Kutipan Pernikahan", type: "textarea", placeholder: "Dan di antara tanda-tanda..." },
      { name: "gallery_1", label: "Foto Galeri 1", type: "image" },
      { name: "gallery_2", label: "Foto Galeri 2", type: "image" },
      { name: "gallery_3", label: "Foto Galeri 3", type: "image" }
    ]
  },
  "golden-arch": {
    slug: "golden-arch",
    component: GoldenArchTheme,
    fields: [
      { name: "quote", label: "Kutipan", type: "textarea", placeholder: "Dan di antara tanda-tanda..." },
      { name: "gallery_1", label: "Foto Galeri 1", type: "image" },
      { name: "gallery_2", label: "Foto Galeri 2", type: "image" },
      { name: "gallery_3", label: "Foto Galeri 3", type: "image" }
    ]
  },
  "terracotta-rust": {
    slug: "terracotta-rust",
    component: TerracottaRustTheme,
    fields: [
      { name: "quote", label: "Kutipan", type: "textarea", placeholder: "Dan di antara tanda-tanda..." },
      { name: "gallery_1", label: "Foto Galeri 1", type: "image" },
      { name: "gallery_2", label: "Foto Galeri 2", type: "image" },
      { name: "gallery_3", label: "Foto Galeri 3", type: "image" }
    ]
  },
  "ethereal-snow": {
    slug: "ethereal-snow",
    component: EtherealSnowTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "Winter romance..."
      }
    ]
  },
  "geometric-abstract": {
    slug: "geometric-abstract",
    component: GeometricAbstractTheme,
    fields: [
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        placeholder: "Abstract love..."
      }
    ]
  },
  "editorial-gallery": {
    slug: "editorial-gallery",
    component: EditorialGalleryTheme,
    fields: [
      { name: "quote", label: "Kutipan Utama", type: "textarea", placeholder: "Dan di antara tanda-tanda..." },
      { name: "gallery_1", label: "Foto Galeri 1", type: "image" },
      { name: "gallery_2", label: "Foto Galeri 2", type: "image" },
      { name: "gallery_3", label: "Foto Galeri 3", type: "image" }
    ]
  }
};

export const getThemeConfig = (slug: string): ThemeConfig => {
  // We try to match exactly, or fallback to minimalis if not found
  return themesConfig[slug] || {
    slug: slug,
    component: FallbackTheme,
    fields: []
  };
};
