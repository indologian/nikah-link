"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";
import { Search, Edit2, CheckCircle2, ShieldAlert } from "lucide-react";
import Pagination from "@/components/ui/Pagination";

export default function UsersClient({ initialUsers }: { initialUsers: Profile[] }) {
  const [users, setUsers] = useState<Profile[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const supabase = createClient();

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    (u.phone && u.phone.includes(search))
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUpdatePlan = async (userId: string, newPlan: string) => {
    if (!confirm(`Yakin ingin mengubah paket berlangganan menjadi ${newPlan.toUpperCase()}?`)) return;
    setLoadingId(userId);
    try {
      // 1. Cek jumlah undangan saat ini
      const { count } = await supabase
        .from("invitations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      // 2. Tentukan batas paket baru
      const limits: Record<string, number> = { free: 1, premium: 1, pro: 2 };
      const planLimit = limits[newPlan] || 1;

      // 3. Validasi
      if (count !== null && count > planLimit) {
        alert(
          `Tindakan Ditolak: Pengguna ini sudah memiliki ${count} undangan.\n\nPaket ${newPlan.toUpperCase()} hanya mengizinkan maksimal ${planLimit} undangan.\n\nHarap hapus undangan yang kelebihan dari menu Undangan terlebih dahulu sebelum melakukan downgrade.`
        );
        return;
      }

      // 4. Lanjutkan update jika valid
      const { error } = await supabase
        .from("profiles")
        .update({ plan: newPlan })
        .eq("id", userId);
      
      if (!error) {
        setUsers(users.map(u => u.id === userId ? { ...u, plan: newPlan as any } : u));
      } else {
        alert("Gagal mengupdate paket: " + error.message);
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!confirm(`Yakin ingin mengubah role menjadi ${newRole}?`)) return;
    setLoadingId(userId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);
      
      if (!error) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
      } else {
        alert("Gagal mengupdate role: " + error.message);
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full">
      <div className="pb-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Cari nama atau nomor HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-0 top-2.5" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500">
              <th className="py-3 font-medium whitespace-nowrap">Nama</th>
              <th className="px-4 py-3 font-medium">Nomor HP</th>
              <th className="px-4 py-3 font-medium">Terdaftar</th>
              <th className="px-4 py-3 font-medium">Paket</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Tidak ada pengguna ditemukan.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                  <td className="py-4 font-medium text-slate-900 dark:text-slate-200 flex items-center gap-2">
                    {user.name}
                    {user.role === 'super_admin' && (
                      <span title="Super Admin">
                        <ShieldAlert className="w-4 h-4 text-slate-900 dark:text-white" />
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-slate-700 dark:text-slate-300 font-mono text-xs">{user.phone || "-"}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{new Date(user.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-4">
                    <select
                      value={user.plan}
                      onChange={(e) => handleUpdatePlan(user.id, e.target.value)}
                      disabled={loadingId === user.id}
                      className="bg-transparent border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-xs uppercase tracking-wider rounded-none px-2 py-1 outline-none focus:border-slate-900 dark:focus:border-slate-100"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                      <option value="pro">Pro</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={user.role || 'user'}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      disabled={loadingId === user.id}
                      className="bg-transparent border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-xs uppercase tracking-wider rounded-none px-2 py-1 outline-none focus:border-slate-900 dark:focus:border-slate-100"
                    >
                      <option value="user">User</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="py-4 text-right">
                    {loadingId === user.id ? (
                      <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 animate-pulse">Wait...</span>
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-slate-300 dark:text-slate-700 inline-block" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredUsers.length}
        perPageOptions={[10, 25, 50]}
        currentPerPage={itemsPerPage}
        onPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
