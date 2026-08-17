"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { toast } from "react-hot-toast";

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    setIsDeleting(true);
    setShowModal(false);
    try {
      const { error } = await supabase.from("invitations").delete().eq("id", id);
      if (error) throw error;
      
      toast.success("Undangan berhasil dihapus!");
      router.refresh();
    } catch (err: any) {
      toast.error("Gagal menghapus undangan: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setShowModal(true);
        }}
        disabled={isDeleting}
        className="flex-1 py-2.5 text-center text-xs uppercase tracking-widest font-bold text-red-600 dark:text-red-400 bg-white dark:bg-slate-950 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center justify-center gap-2"
        title="Hapus Undangan"
      >
        {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        Hapus
      </button>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Hapus Undangan?"
        description={`Apakah Anda yakin ingin menghapus undangan "${title}" secara permanen? Semua data tamu, buku tamu, dan pengaturan akan ikut terhapus dan tidak dapat dikembalikan.`}
        confirmText="Ya, Hapus Permanen"
        cancelText="Batal"
        isDestructive={true}
      />
    </>
  );
}
