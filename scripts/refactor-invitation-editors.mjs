import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const targets = [
  path.join(root, "app/dashboard/undangan/baru/page.tsx"),
  path.join(root, "app/dashboard/undangan/[id]/edit/page.tsx"),
];

function fail(message) {
  console.error(`\nREFactor aborted: ${message}`);
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) fail(`${command} ${args.join(" ")} failed.`);
}

function backup(file) {
  const backupPath = `${file}.bak`;
  if (!fs.existsSync(backupPath)) fs.copyFileSync(file, backupPath);
  return backupPath;
}

function replaceOnce(source, pattern, replacement, label) {
  const matches = source.match(pattern);
  if (!matches || matches.length !== 1) {
    fail(`${label}: expected exactly 1 match, found ${matches?.length ?? 0}.`);
  }
  return source.replace(pattern, replacement);
}

for (const file of targets) {
  if (!fs.existsSync(file)) fail(`Missing target: ${path.relative(root, file)}`);
  backup(file);
}

// This codemod intentionally performs only structural, low-risk replacements.
// It does NOT try to regex-rewrite the entire invitation editor. After this pass,
// the remaining direct Supabase calls are reported and must be migrated to the
// existing Server Actions one-by-one.
for (const file of targets) {
  let source = fs.readFileSync(file, "utf8");

  source = source.replace(/import \{ createClient \} from "@\/lib\/supabase\/client";\n/, "");

  const actionImport = 'import { checkInvitationUsername, loadInvitationEditor, loadNewInvitationContext, uploadInvitationAssetAction } from "@/actions/invitations/invitation";\n';
  if (!source.includes('@/actions/invitations/invitation')) {
    const marker = /import Link from "next\/link";\n/;
    if (marker.test(source)) {
      source = source.replace(marker, `import Link from "next/link";\n${actionImport}`);
    } else {
      source = `${actionImport}${source}`;
    }
  }

  source = source.replace(/\n\s*const supabase = createClient\(\);\n/, "\n");

  // Remove client-side storage helper. Upload is handled by the server action.
  source = source.replace(/\n\s*const getUserStoragePath = async \(fileName: string\) => \{[\s\S]*?\n\s*\};\n/, "\n");

  // Replace legacy upload function bodies by a server-action based helper.
  const helper = `\n  const uploadAsset = async (file: File, kind: "image" | "audio") => {\n    const fd = new FormData();\n    fd.set("file", file);\n    fd.set("kind", kind);\n    return uploadInvitationAssetAction(fd);\n  };\n`;
  if (!source.includes('const uploadAsset = async')) {
    const anchor = /\n\s*const upload(?:Image|CustomImage|Audio)\s*= async/;
    if (anchor.test(source)) {
      source = source.replace(anchor, `${helper}\n  const uploadImage = async`);
      // The old upload blocks are deliberately left for the second pass if their
      // exact shape differs between create/edit. The report below will catch them.
    }
  }

  fs.writeFileSync(file, source, "utf8");
}

console.log("\nStatic refactor pass completed.\n");

for (const file of targets) {
  const source = fs.readFileSync(file, "utf8");
  const forbidden = [
    /createClient\(/g,
    /\.storage\s*\./g,
    /\.storage\s*\(/g,
    /\.from\s*\(/g,
    /\.rpc\s*\(/g,
    /Math\.random\s*\(/g,
    /Date\.now\s*\(/g,
  ];
  const hits = forbidden.flatMap((pattern) => {
    const count = source.match(pattern)?.length ?? 0;
    return count ? [`${pattern}: ${count}`] : [];
  });

  console.log(`${path.relative(root, file)}:`);
  if (hits.length) {
    console.log(`  Remaining direct/impure patterns: ${hits.join(", ")}`);
  } else {
    console.log("  No forbidden patterns remain.");
  }
}

console.log("\nNow run:");
console.log("  npx tsc --noEmit");
console.log("  npm run lint");
console.log("  npm run build");
console.log("\nIf the codemod changed a file incorrectly, restore the .bak file first.");
