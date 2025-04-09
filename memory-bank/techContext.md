# Tech Context: Rate Key

**Languages:**

- TypeScript (Frontend)
- Rust (Backend - Tauri)
- CSS (Styling - likely via Tailwind CSS used by shadcn/ui)

**Frameworks/Libraries:**

- React 18+
- Vite (Build tool/Dev server)
- Tauri (Desktop app framework)
- shadcn/ui (UI Components)
- Tailwind CSS (Utility-first CSS framework - dependency of shadcn/ui)
- react-hook-form (Form handling)
- Zod (Schema validation)

**Development Setup:**

- Requires Node.js and npm/yarn/pnpm/bun for frontend dependencies.
- Requires Rust toolchain (including Cargo) for Tauri backend.
- Development server likely run via `npm run tauri dev` (or similar based on `package.json`).
- Build process involves compiling Rust backend and bundling frontend assets.

**Technical Constraints:**

- Runs as a desktop application, not in a standard web browser (though development uses a browser view).
- Interaction with the backend (Rust) happens via Tauri's command invocation system, not standard HTTP requests.
- Potential platform-specific considerations due to Tauri.

**Dependencies:** (Key frontend dependencies from `package.json` - review for full list)

- `@tauri-apps/api`
- `react`, `react-dom`
- `@hookform/resolvers`
- `react-hook-form`
- `zod`
- `@radix-ui/*` (Core of shadcn/ui)
- `tailwindcss`
- `typescript`
- `vite`
