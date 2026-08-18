<!-- BEGIN:nextjs-agent-rules -->

# Project Instructions

## Stack

This project uses:

- Next.js
- React
- TypeScript
- Tailwind CSS

## Design System

Use the Hallmark skill located at:

skills/hallmark/SKILL.md

Before implementing UI, consult the relevant Hallmark references.

## Development Rules

1. Do not modify unrelated files.
2. Do not install dependencies without a reason.
3. Reuse existing components.
4. Keep components modular.
5. Use TypeScript.
6. Keep responsive behavior in mind.
7. Test the implementation after making changes (npm run build).
8. push to github

## UI Rules

All new UI must follow Hallmark design guidance.

Avoid generic AI-generated UI.

Do not create random:
- gradients
- excessive rounded cards
- excessive shadows
- unnecessary glassmorphism
- decorative animations

Every visual decision should have a purpose.

## Workflow

For every UI task:

1. Analyze the requirement.
2. Inspect existing project structure.
3. Read relevant Hallmark references.
4. Plan the UI.
5. Implement.
6. Run the application.
7. Check responsive behavior.
8. Fix visual issues.
9. Review against Hallmark anti-patterns.


# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
