"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Items per page options for selector. Pass empty array to hide selector. */
  perPageOptions?: number[];
  currentPerPage?: number;
  onPerPageChange?: (perPage: number) => void;
  /** Total item count for display */
  totalItems?: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  perPageOptions = [],
  currentPerPage,
  onPerPageChange,
  totalItems,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  const startItem = totalItems ? (currentPage - 1) * (currentPerPage || 10) + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * (currentPerPage || 10), totalItems) : 0;

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 pt-6", className)}>
      {/* Info & Per Page Selector */}
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        {totalItems !== undefined && (
          <span className="font-mono tracking-wider">
            {startItem}–{endItem} dari {totalItems}
          </span>
        )}
        {perPageOptions.length > 0 && currentPerPage && onPerPageChange && (
          <div className="flex items-center gap-2">
            <span>Tampilkan</span>
            <select
              value={currentPerPage}
              onChange={(e) => {
                onPerPageChange(Number(e.target.value));
                onPageChange(1); // Reset to page 1
              }}
              className="bg-transparent border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-xs px-2 py-1 outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors"
            >
              {perPageOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page Navigation */}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center w-9 h-9 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-xs">
              ···
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-9 h-9 flex items-center justify-center text-xs font-medium transition-colors",
                currentPage === page
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              )}
              aria-label={`Halaman ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center justify-center w-9 h-9 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman selanjutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
}
