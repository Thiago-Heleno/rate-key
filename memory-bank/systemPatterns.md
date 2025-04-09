# System Patterns: Rate Key

**Architecture:**

- **Frontend:** React (using Vite) + TypeScript for the user interface.
- **Backend:** Rust (via Tauri) for native desktop capabilities and potentially handling logic/storage.
- **UI:** Leverages shadcn/ui components, which are typically composable and customizable.
- **State Management:** Likely component-level state initially. `react-hook-form` manages form state. Global state management (like Zustand, Redux, or Context API) might be introduced later if needed.
- **Data Flow:** User interactions in the React frontend trigger events. Form data is validated using Zod and handled by `react-hook-form`. Data submission likely involves invoking commands exposed by the Tauri Rust backend.

**Key Technical Decisions:**

- **Tauri:** Chosen for building a cross-platform desktop application using web technologies for the frontend and Rust for the backend. Offers potential for better performance and system access compared to Electron.
- **React + TypeScript:** Standard choice for building modern, type-safe web interfaces.
- **shadcn/ui:** Provides unstyled, accessible components that can be easily customized, avoiding vendor lock-in with specific styling libraries.
- **react-hook-form + Zod:** Robust solution for form handling and validation, promoting type safety and clear validation rules.

**Component Relationships:** (Initial)

- `main.tsx`: Entry point, renders `App`.
- `App.tsx`: Main application component, likely handles routing or layout.
- `AddKeyForm.tsx`: Component responsible for the form to add new keys.
- `ui/`: Directory containing shadcn/ui components.
