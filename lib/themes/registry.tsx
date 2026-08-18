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
      // Minimalist uses mostly core fields, but let's add an example custom field
      {
        name: "greeting",
        label: "Salam Pembuka Khusus",
        type: "text",
        placeholder: "misal: Assalamualaikum Wr. Wb."
      }
    ]
  },
  // Future themes can be added here:
  // "vintage-01": {
  //   slug: "vintage-01",
  //   component: dynamic(() => import('@/components/themes/VintageTheme')),
  //   fields: [
  //     { name: "video_url", label: "Link Video YouTube", type: "url" },
  //     { name: "quote", label: "Kutipan", type: "textarea" },
  //   ]
  // }
};

export const getThemeConfig = (slug: string): ThemeConfig => {
  // We try to match exactly, or fallback to minimalis if not found
  return themesConfig[slug] || {
    slug: slug,
    component: FallbackTheme,
    fields: []
  };
};
