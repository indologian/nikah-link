#!/bin/bash
# scripts/clean-snapshots.sh
# Hapus folder snapshot tanggalan yang redundant

set -e

echo "🧹 Membersihkan snapshot tanggalan di graphify-out/..."

# Cari semua folder dengan format tanggal YYYY-MM-DD
find graphify-out -maxdepth 1 -type d -name "20[0-9][0-9]-[0-1][0-9]-[0-3][0-9]" | while read dir; do
  echo "  Menghapus: $dir"
  rm -rf "$dir"
done

echo "✅ Selesai. Snapshot tanggalan dihapus."
echo "ℹ️  Jika butuh riwayat, gunakan history git."