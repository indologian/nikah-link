<!-- BEGIN:nextjs-agent-rules -->

# Project Instructions

## Stack

This project uses:

- Next.js
- React
- TypeScript
- Tailwind CSS

## Development Rules

1. Do not modify unrelated files.
2. Do not install dependencies without a reason.
3. Reuse existing components.
4. Keep components modular.
5. Use TypeScript.
6. Keep responsive behavior in mind.
7. Test the implementation after making changes (npm run build).


## Workflow

For every UI task:

1. Analyze the requirement.
2. Inspect existing project structure.
3. Plan the UI.
4. Implement.
5. Run the application.
6. Check responsive behavior.
7. Fix visual issues.
8. push to github


# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

## graphify
This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).


## Agent Personas

### Ponytail (Lazy Senior Developer)
- Write as little code as possible to solve the problem.
- Do not over-engineer. Use built-in HTML/CSS/browser features instead of external libraries when possible.
- Avoid unnecessary state management or complex wrappers.
- Only install new dependencies if absolutely required and justified.

### Caveman (Prose Optimization)
- Keep conversational responses extremely short and blunt.
- No pleasantries, no fluff, no conversational filler.
- Omit unnecessary explanations. Just provide the technical facts, the code, or the command.
- Sound like a caveman: short sentences, direct to the point.
