#!/usr/bin/env node

/**
 * NikahLink - Migrate public RSVP/Wishes mutations
 *
 * DRY RUN:
 *   node scripts/migrate-public-mutations.mjs
 *
 * APPLY:
 *   node scripts/migrate-public-mutations.mjs --apply
 *
 * Scope:
 *   - hanya components/themes/*.tsx
 *   - guests insert/upsert -> /api/public/rsvp
 *   - wishes insert/upsert -> /api/public/wishes
 *   - createClient import dihapus hanya jika sudah tidak dipakai
 *
 * Tidak menyentuh:
 *   - RLS
 *   - app/dashboard/tamu/page.tsx
 *   - file di luar components/themes
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const THEMES_DIR = path.join(ROOT, "components", "themes");
const APPLY = process.argv.includes("--apply");

if (!fs.existsSync(THEMES_DIR)) {
    console.error(`Direktori tidak ditemukan: ${THEMES_DIR}`);
    process.exit(1);
}

/**
 * Handler standar yang akan digunakan semua theme.
 */
const WISH_HANDLER = `const handleSendWish = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!wishText.trim()) return;

  setSendingWish(true);

  try {
    const response = await fetch("/api/public/wishes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invitationId: invitation.id,
        guestName: wishName.trim() || "Anonim",
        message: wishText.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Gagal mengirim ucapan.");
      return;
    }

    if (result.data) {
      setWishes((current) => [result.data, ...current]);
    }

    setWishText("");
  } catch (error) {
    console.error("Wish submit error:", error);
    alert("Gagal mengirim ucapan. Silakan coba lagi.");
  } finally {
    setSendingWish(false);
  }
};`;

/**
 * Handler RSVP standar.
 *
 * Semua variasi field database lama akan disatukan ke kontrak API:
 *   invitationId
 *   name
 *   status
 *   guestCount
 *   notes
 */
const RSVP_HANDLER = `const handleRsvpSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setSubmittingRsvp(true);

  try {
    const response = await fetch("/api/public/rsvp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invitationId: invitation.id,
        name: wishName.trim() || guestName || "Tamu Undangan",
        status: rsvpStatus,
        guestCount: rsvpStatus === "hadir" ? rsvpCount : 0,
        notes: rsvpNotes.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Gagal mengirim RSVP.");
      return;
    }

    setRsvpSuccess(true);
  } catch (error) {
    console.error("RSVP submit error:", error);
    alert("Gagal mengirim RSVP. Silakan coba lagi.");
  } finally {
    setSubmittingRsvp(false);
  }
};`;

/**
 * Cari akhir function dengan menghitung kurung { }.
 *
 * Ini lebih aman daripada regex sederhana untuk function multiline.
 */
function findFunctionEnd(source, start) {
    const braceStart = source.indexOf("{", start);

    if (braceStart === -1) {
        return -1;
    }

    let depth = 0;
    let quote = null;
    let template = false;
    let escaped = false;
    let lineComment = false;
    let blockComment = false;

    for (let i = braceStart; i < source.length; i++) {
        const ch = source[i];
        const next = source[i + 1];

        if (lineComment) {
            if (ch === "\n") {
                lineComment = false;
            }
            continue;
        }

        if (blockComment) {
            if (ch === "*" && next === "/") {
                blockComment = false;
                i++;
            }
            continue;
        }

        if (quote) {
            if (escaped) {
                escaped = false;
            } else if (ch === "\\") {
                escaped = true;
            } else if (ch === quote) {
                quote = null;
            }
            continue;
        }

        if (template) {
            if (escaped) {
                escaped = false;
            } else if (ch === "\\") {
                escaped = true;
            } else if (ch === "`") {
                template = false;
            }
            continue;
        }

        if (ch === "/" && next === "/") {
            lineComment = true;
            i++;
            continue;
        }

        if (ch === "/" && next === "*") {
            blockComment = true;
            i++;
            continue;
        }

        if (ch === '"' || ch === "'") {
            quote = ch;
            continue;
        }

        if (ch === "`") {
            template = true;
            continue;
        }

        if (ch === "{") {
            depth++;
            continue;
        }

        if (ch === "}") {
            depth--;

            if (depth === 0) {
                return i + 1;
            }
        }
    }

    return -1;
}

/**
 * Ganti isi function tertentu hanya jika function tersebut
 * masih mengandung direct mutation yang kita cari.
 */
function replaceHandler(source, functionName, replacement, mutationRegex) {
    const signature = `const ${functionName} = async`;

    const start = source.indexOf(signature);

    if (start === -1) {
        return {
            source,
            changed: false,
            found: false,
            reason: "handler-not-found",
        };
    }

    const end = findFunctionEnd(source, start);

    if (end === -1) {
        return {
            source,
            changed: false,
            found: true,
            reason: "handler-end-not-found",
        };
    }

    const current = source.slice(start, end);

    if (!mutationRegex.test(current)) {
        return {
            source,
            changed: false,
            found: true,
            reason: "no-direct-mutation",
        };
    }

    const updated =
        source.slice(0, start) +
        replacement +
        source.slice(end);

    return {
        source: updated,
        changed: true,
        found: true,
        reason: "migrated",
    };
}

/**
 * Hapus import createClient hanya jika tidak ada penggunaan lagi.
 */
function removeUnusedCreateClientImport(source) {
    const importRegex =
        /import\s+\{\s*createClient\s*\}\s+from\s+["']@\/lib\/supabase\/client["'];?\s*\r?\n?/;

    if (!importRegex.test(source)) {
        return {
            source,
            changed: false,
        };
    }

    const useCount = (source.match(/\bcreateClient\s*\(/g) || []).length;

    if (useCount > 0) {
        return {
            source,
            changed: false,
        };
    }

    return {
        source: source.replace(importRegex, ""),
        changed: true,
    };
}

function listThemeFiles() {
    return fs
        .readdirSync(THEMES_DIR, { withFileTypes: true })
        .filter(
            (entry) =>
                entry.isFile() &&
                entry.name.endsWith(".tsx")
        )
        .map((entry) => path.join(THEMES_DIR, entry.name))
        .sort();
}

const files = listThemeFiles();

const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");

const backupDir = path.join(
    ROOT,
    ".migration-backups",
    timestamp
);

const report = [];

for (const file of files) {
    const relativePath = path.relative(ROOT, file);
    const original = fs.readFileSync(file, "utf8");

    let updated = original;
    const changes = [];

    // ------------------------------------------------------------
    // Wishes
    // ------------------------------------------------------------

    const wishesResult = replaceHandler(
        updated,
        "handleSendWish",
        WISH_HANDLER,
        /\.from\(\s*["']wishes["']\s*\)\s*\.\s*(?:insert|upsert)\s*\(/s
    );

    updated = wishesResult.source;

    if (wishesResult.changed) {
        changes.push("wishes");
    }

    // ------------------------------------------------------------
    // RSVP
    // ------------------------------------------------------------

    const rsvpResult = replaceHandler(
        updated,
        "handleRsvpSubmit",
        RSVP_HANDLER,
        /\.from\(\s*["']guests["']\s*\)\s*\.\s*(?:insert|upsert)\s*\(/s
    );

    updated = rsvpResult.source;

    if (rsvpResult.changed) {
        changes.push("rsvp");
    }

    // ------------------------------------------------------------
    // createClient import
    // ------------------------------------------------------------

    const importResult =
        removeUnusedCreateClientImport(updated);

    updated = importResult.source;

    if (importResult.changed) {
        changes.push("remove-createClient-import");
    }

    // ------------------------------------------------------------
    // Final safety check
    // ------------------------------------------------------------

    const directMutationRemaining =
        /\.from\(\s*["'](?:guests|wishes)["']\s*\)\s*\.\s*(?:insert|upsert)\s*\(/s.test(
            updated
        );

    let status = "SKIP";

    if (changes.length > 0 && !directMutationRemaining) {
        status = "MIGRATE";
    }

    if (changes.length > 0 && directMutationRemaining) {
        status = "REVIEW";
    }

    report.push({
        file: relativePath,
        status,
        changes,
        wishReason: wishesResult.reason,
        rsvpReason: rsvpResult.reason,
        directMutationRemaining,
    });

    // ------------------------------------------------------------
    // Write only in --apply mode
    // ------------------------------------------------------------

    if (
        APPLY &&
        status === "MIGRATE"
    ) {
        fs.mkdirSync(backupDir, {
            recursive: true,
        });

        const backupPath = path.join(
            backupDir,
            path.basename(file)
        );

        fs.writeFileSync(
            backupPath,
            original,
            "utf8"
        );

        fs.writeFileSync(
            file,
            updated,
            "utf8"
        );
    }
}

console.log("");
console.log("NikahLink Public Mutation Migration");
console.log("=".repeat(72));
console.log(
    APPLY
        ? "MODE: APPLY"
        : "MODE: DRY-RUN"
);
console.log("");

for (const item of report) {
    const changeText =
        item.changes.length > 0
            ? ` -> ${item.changes.join(", ")}`
            : "";

    console.log(
        `${item.status.padEnd(8)} ${item.file}${changeText}`
    );

    if (item.status === "REVIEW") {
        console.log(
            "         WARNING: direct mutation masih ditemukan."
        );
    }
}

const migrated = report.filter(
    (x) => x.status === "MIGRATE"
).length;

const review = report.filter(
    (x) => x.status === "REVIEW"
).length;

const skipped = report.filter(
    (x) => x.status === "SKIP"
).length;

console.log("");
console.log(`Migrated : ${migrated}`);
console.log(`Review   : ${review}`);
console.log(`Skipped  : ${skipped}`);

if (APPLY) {
    console.log("");
    console.log(
        `Backup   : ${path.relative(ROOT, backupDir)}`
    );

    console.log("");
    console.log("Langkah berikutnya:");
    console.log("  npm run build");
    console.log("");
    console.log(
        `  git grep -n -E '\\.from\\(["'\\''\\'](guests|wishes)["'\\'']\\)\\.(insert|upsert)'`
    );
} else {
    console.log("");
    console.log(
        "Tidak ada file yang diubah."
    );
    console.log(
        "Jika hasil dry-run terlihat benar, jalankan:"
    );
    console.log("");
    console.log(
        "  node scripts/migrate-public-mutations.mjs --apply"
    );
}

if (review > 0) {
    process.exitCode = 2;
}