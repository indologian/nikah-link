"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";
import { Search, Edit2, CheckCircle2, ShieldAlert } from "lucide-react";

export default function UsersClient({ initialUsers }: { initialUsers: Profile[] }) {
  const [users, setUsers] = useState<Profile[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const supabase = createClient();

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    (u.phone && u.phone.includes(search))
  );

  const handleUpdatePlan = async (userId: string, newPlan: string) => {
    setLoadingId(userId);
    try {
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Cari nama atau nomor HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-950 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Nomor HP</th>
              <th className="px-6 py-4">Terdaftar</th>
              <th className="px-6 py-4">Paket</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Tidak ada pengguna ditemukan.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-200 flex items-center gap-2">
                    {user.name}
                    {user.role === 'super_admin' && <ShieldAlert className="w-4 h-4 text-rose-500" title="Super Admin" />}
                  </td>
                  <td className="px-6 py-4">{user.phone || "-"}</td>
                  <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.plan}
                      onChange={(e) => handleUpdatePlan(user.id, e.target.value)}
                      disabled={loadingId === user.id}
                      className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 outline-none focus:border-rose-500"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                      <option value="pro">Pro</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role || 'user'}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      disabled={loadingId === user.id}
                      className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 outline-none focus:border-rose-500"
                    >
                      <option value="user">User</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {loadingId === user.id ? (
                      <span className="text-xs text-rose-400 animate-pulse">Menyimpan...</span>
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 opacity-50" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
