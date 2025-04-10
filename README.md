# Rate Key: Effortless API Key Management & Rotation 🔑⚡

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Rate Key Screenshots](./public/screenshots/app_screenshots.png)

Tired of constantly hitting free tier limits on AI services like OpenAI, Anthropic, or Gemini? Frustrated with manually swapping API keys every time one gets rate-limited? **Rate Key is here to help!**

## The Motivation: Beating AI Free Tier Limits

This project was born out of the need to efficiently manage multiple API keys for various AI services. Free tiers often come with strict rate limits, forcing frequent key rotation. Rate Key provides a simple, local desktop interface to:

- Store multiple API keys for different services.
- Track which keys are currently rate-limited.
- Quickly copy a _working_ (non-rate-limited) key to your clipboard.
- Visualize the remaining cooldown time for limited keys.

## ✨ Key Features

- **Service & Key Management:** Add, organize, and delete different AI services and their associated API keys.
- **Rate Limit Tracking:** Manually mark keys as rate-limited and set a cooldown period (in hours).
- **Cooldown Timer:** See exactly how long until a rate-limited key becomes available again, updated every second.
- **Get Random Working Key:** Instantly copy a non-rate-limited key for the selected service to your clipboard and automatically mark it as limited.
- **Secure Local Storage:** Keys are stored locally using Tauri's secure store plugin.
- **Key Masking:** API keys are partially hidden in the UI for security.
- **Direct Copy:** Copy any specific key (masked in UI) with a single click.
- **Clean Interface:** Built with React, TypeScript, shadcn/ui, and Tailwind CSS for a modern look and feel.
- **Cross-Platform:** Built with Tauri for native desktop performance on Windows, macOS, and Linux.

## 🚀 Tech Stack

- **Framework:** [Tauri](https://tauri.app/) (Rust backend, webview frontend)
- **Frontend:** [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **UI:** [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) (for validation)
- **Local Storage:** `@tauri-apps/plugin-store`
- **Clipboard:** `@tauri-apps/plugin-clipboard-manager`
- **Date/Time:** `date-fns`
- **Animation:** `framer-motion` (for page transitions)

## 🏁 Getting Started

1.  **Prerequisites:**
    - Node.js & npm (or yarn/pnpm/bun)
    - Rust toolchain (including Cargo) - Follow the [Tauri prerequisites guide](https://tauri.app/v1/guides/getting-started/prerequisites).
2.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd rate-key
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run in development mode:**
    ```bash
    npm run tauri dev
    ```
5.  **Build the application:**
    ```bash
    npm run tauri build
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
