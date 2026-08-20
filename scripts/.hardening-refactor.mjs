import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const files = [
  "app/dashboard/undangan/baru/page.tsx",
  "app/dashboard/undangan/[id]/edit/page.tsx",
];

for (const file of files) {
  let content = readFileSync(file, "utf8");
  const original = content;
  content = content.replace(
    'import { createClient } from "@/lib/supabase/client";',
    'import { createInvitationEditorBackend } from "@/lib/invitations/editor-client";'
  );
  content = content.replace(
    /const supabase = createClient\(\);/g,
    "const supabase = createInvitationEditorBackend();"
  );

  if (!content.includes("createInvitationEditorBackend")) {
    throw new Error(`Failed to patch ${file}`);
  }
  if (content.includes('from "@/lib/supabase/client"')) {
    throw new Error(`Direct Supabase client import remains in ${file}`);
  }
  if (content === original) {
    throw new Error(`No changes made to ${file}`);
  }

  writeFileSync(file, content);
}

execFileSync("git", ["add", ...files], { stdio: "inherit" });
execFileSync("git", ["commit", "-m", "refactor: route invitation editors through server actions"], { stdio: "inherit" });
execFileSync("git", ["push", "origin", "HEAD:refactor/architecture-v1"], { stdio: "inherit" });
