import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden transition-colors relative">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto h-full pt-16 md:pt-0">
        <div className="px-4 sm:px-8 md:px-10 py-6 max-w-7xl mx-auto w-full box-border">
          {children}
        </div>
      </main>
    </div>
  );
}
