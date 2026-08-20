import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const targets = [
  path.join(root, "app/dashboard/undangan/baru/page.tsx"),
  path.join(root, "app/dashboard/undangan/[id]/edit/page.tsx"),
];

function fail(message) {
  console.error(`\nInvitation editor validation failed: ${message}`);
  process.exitCode = 1;
}

function readTarget(file) {
  if (!fs.existsSync(file)) {
    fail(`Missing target: ${path.relative(root, file)}`);
    return null;
  }
  return fs.readFileSync(file, "utf8");
}

function count(source, pattern) {
  return source.match(pattern)?.length ?? 0;
}

let hasFailure = false;

for (const file of targets) {
  const source = readTarget(file);
  if (source === null) {
    hasFailure = true;
    continue;
  }

  const relative = path.relative(root, file);
  const firstStatement = source
    .replace(/^\uFEFF/, "")
    .trimStart()
    .slice(0, 40);

  if (!firstStatement.startsWith('"use client";') && !firstStatement.startsWith("'use client';")) {
    console.error(`${relative}: "use client" is not the first statement.`);
    hasFailure = true;
  }

  const checks = [
    [/createClient\s*\(/g, "createClient()"],
    [/\.storage\s*\./g, ".storage"],
    [/\.storage\s*\(/g, ".storage()"],
    [/\.from\s*\(/g, ".from()"],
    [/\.rpc\s*\(/g, ".rpc()"],
    [/Math\.random\s*\(/g, "Math.random()"],
    [/Date\.now\s*\(/g, "Date.now()"],
  ];

  const hits = checks
    .map(([pattern, label]) => ({ label, total: count(source, pattern) }))
    .filter(({ total }) => total > 0);

  console.log(`${relative}:`);
  if (hits.length === 0) {
    console.log("  No direct Supabase / render-impure patterns detected.");
  } else {
    for (const { label, total } of hits) {
      console.log(`  ${label}: ${total}`);
    }
    hasFailure = true;
  }
}

console.log("\nThis script is now a validation-only guard.");
console.log("It intentionally does not rewrite application files.");

if (hasFailure) {
  process.exitCode = 1;
} else {
  console.log("Validation passed.");
}
