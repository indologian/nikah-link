import dynamic from 'next/dynamic';

export type FieldType = 'text' | 'textarea' | 'url' | 'boolean' | 'date';

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
