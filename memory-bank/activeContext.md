# Active Context: Rate Key

**Current Focus:** Addressing font issues, window configuration, and continuing initial setup.

**Recent Changes:**

- Fixed a `ReferenceError: form is not defined` in `src/components/AddKeyForm.tsx`.
- Created initial Memory Bank files (`projectbrief.md`, `productContext.md`, `activeContext.md`, `systemPatterns.md`, `techContext.md`, `progress.md`) and `.clinerules`.
- **Troubleshooting Font (Tailwind v4):**
  - Ensured `@font-face` in `src/App.css` uses correct format (`truetype`) and relative path (`./assets/Matrix_Mono.ttf`).
  - Defined `--font-sans` CSS variable in the `@theme` block within `src/App.css` to include `"Matrix_Mono"` and standard fallbacks, following Tailwind v4 practices.
  - (Removed previous incorrect steps related to `tailwind.config.ts` font family extension).
- **Window Size:**
  - Modified `src-tauri/tauri.conf.json` to set window dimensions to 400x700.
- **Dark Mode:** Enabled via class on `body` in `App.tsx`.
- **Sonner Integration:** Added `sonner` package and `<Toaster />` component for notifications.
- **Type Centralization:** Created `src/types.ts` for `ApiKey` and `Service` interfaces; refactored relevant components (`ApiKeyPage`, `ServicesPage`, `AddKeyForm`, `AddServiceForm`) to use these types.
- **Rate Limit Enhancement:**
  - Added `rateLimitedAt: number | null` to `ApiKey` type.
  - Implemented logic in `ApiKeyPage.tsx` to toggle rate limit status, set timestamp, calculate/display remaining wait time using `date-fns`, update store, and show toasts.
  - **Refined Reset Logic:** Modified `handleRateLimitToggle` to allow immediate manual reset of the limit via the "Reset Limit" button, ignoring remaining wait time.
  - Updated `AddKeyForm` schema and input for `rate_limit_time` (hours, number).
- **Deletion Functionality:**
  - Added delete buttons and store update logic (including deleting associated keys when deleting a service) to `ApiKeyPage.tsx` and `ServicesPage.tsx`.
  - Replaced `window.confirm` with `shadcn/ui` `AlertDialog` component for confirmation, including necessary state management and component implementation in both pages. Added toasts for feedback.
- **Random Key Functionality:**
  - Added "Get Random Working Key" button to `ApiKeyPage.tsx`.
  - Implemented handler to find a non-rate-limited key, copy it to clipboard (using `@tauri-apps/plugin-clipboard-manager`), apply rate limit, update store, and show toasts.
  - **Clipboard Permissions:** Added `"clipboard-manager:allow-write-text"` permission to `plugins.clipboard-manager.permissions` in `tauri.conf.json`.
  - **Plugin Initialization:** Added `.plugin(tauri_plugin_clipboard_manager::init())` to the builder in `src-tauri/src/lib.rs` to register the plugin.
- **Copy Key Functionality:**
  - Implemented `handleCopyKey` function in `ApiKeyPage.tsx` using the Tauri clipboard plugin (`@tauri-apps/plugin-clipboard-manager`).
  - Attached handler to the "Copy" button next to each key.
  - Added success/error toasts for copy action.
- **Rate Limit Timer Display:** Implemented a per-second update for the remaining time display in `ApiKeyPage.tsx` using a `useState` hook (`now`) and a `useEffect` hook with `setInterval`.
- **Bug Fix (Add Key Form):** Fixed issue where `rateLimitedAt` timestamp was not set when creating a key with "Is Rate Limited?" checked initially. Modified `onSubmit` in `AddKeyForm.tsx` to set `rateLimitedAt: Date.now()` if `values.is_rate_limited` is true.
- **API Key Masking:** Updated `ApiKeyPage.tsx` to display only the first 4 characters of the API key followed by asterisks for security.
- **Page Transitions:** Implemented fade transitions between pages using `framer-motion` (`AnimatePresence`, `motion.div`) in `App.tsx`. Extracted routing logic into `AnimatedRoutes` component to handle `useLocation`.

**Next Steps:**

- Thorough testing of all implemented features (rate limiting, deletion, random key, copy key, toasts).
- Review UI/UX for clarity and consistency.
- Update other Memory Bank files (`progress.md`, etc.) to reflect current state.
