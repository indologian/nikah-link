import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Inbox, Download } from "lucide-react";

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

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">No</th>
                <th className="px-6 py-4 font-bold tracking-wider">Email</th>
                <th className="px-6 py-4 font-bold tracking-wider">WhatsApp</th>
                <th className="px-6 py-4 font-bold tracking-wider">Sumber</th>
                <th className="px-6 py-4 font-bold tracking-wider">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {!leads || leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Belum ada data lead masuk.
                  </td>
                </tr>
              ) : (
                leads.map((lead, index) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{lead.email}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{lead.whatsapp}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(lead.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
