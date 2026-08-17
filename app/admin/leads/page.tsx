import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Inbox, Download } from "lucide-react";
import LeadsClient from "./LeadsClient";

export const metadata = {
  title: "Data Leads | Admin NikahLink",
};

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/masuk");
  }

  // Fetch leads
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-slate-900 dark:text-white mb-2">Data Leads (Lead Magnet)</h1>
          <p className="text-slate-500 dark:text-slate-400">Daftar kontak pengunjung yang telah mengunduh Buku Panduan & Checklist.</p>
        </div>
        
        {/* We can add an export CSV button later, for now just a placeholder or count */}
        <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
          <Inbox size={16} />
          <span>Total: {leads?.length || 0} Leads</span>
        </div>
      </div>

      <LeadsClient leads={leads || []} />

    </div>
  );
}
