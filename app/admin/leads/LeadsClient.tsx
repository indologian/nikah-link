"use client";

import { useState } from "react";
import Pagination from "@/components/ui/Pagination";

interface Lead {
  id: string;
  email: string;
  whatsapp: string;
  source: string;
  created_at: string;
}

export default function LeadsClient({ leads }: { leads: Lead[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalItems = leads.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = leads.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
  };

  return (
    <>
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
              {!paginatedLeads || paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Belum ada data lead masuk.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead, index) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{startIndex + index + 1}</td>
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

      {totalItems > 0 && (
        <div className="mt-4">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            perPageOptions={[10, 25, 50, 100]}
            currentPerPage={itemsPerPage}
            onPerPageChange={handlePerPageChange}
            totalItems={totalItems}
          />
        </div>
      )}
    </>
  );
}
