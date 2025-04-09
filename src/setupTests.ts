// src/setupTests.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Tell Vitest to use our mock implementations for Tauri plugins
vi.mock(
  "@tauri-apps/plugin-store",
  () => import("./__mocks__/@tauri-apps/plugin-store")
);
vi.mock(
  "@tauri-apps/plugin-clipboard-manager",
  () => import("./__mocks__/@tauri-apps/plugin-clipboard-manager")
);

// Optional: Add any other global setup needed for tests
// For example, mocking window.matchMedia which is often needed for UI libraries
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(
    (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      // Removed unused disable comment
      addListener: vi.fn(), // deprecated
      // Removed unused disable comment
      removeListener: vi.fn(), // deprecated
      // Removed unused disable comment
      addEventListener: vi.fn(),
      // Removed unused disable comment
      removeEventListener: vi.fn(),
      // Removed unused disable comment
      dispatchEvent: vi.fn(),
    })
  ),
});
