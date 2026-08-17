import type { Metadata } from "next";
import Sidebar from "@/components/dashboard/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | NikahLink",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/masuk");
  }

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden transition-colors relative">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content with Wevitation-style centered padding frame */}
      <main className="flex-1 overflow-y-auto h-full pt-16 md:pt-0">
        <div className="px-4 sm:px-8 md:px-10 py-6 max-w-6xl mx-auto w-full box-border">
          {children}
        </div>
      </main>
    </div>
  );
}
