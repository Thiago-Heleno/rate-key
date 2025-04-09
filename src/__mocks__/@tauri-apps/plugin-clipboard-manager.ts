// src/__mocks__/@tauri-apps/plugin-clipboard-manager.ts
import { vi } from "vitest";

let clipboardContent = "";

// Mock implementation for writeText
export const writeText = vi.fn(async (text: string) => {
  clipboardContent = text;
  // console.log(`Mock clipboard write: "${text}"`);
});

// Mock implementation for readText (if needed later)
export const readText = vi.fn(async () => {
  // console.log(`Mock clipboard read: "${clipboardContent}"`);
  return clipboardContent;
});

// Helper to get current mock clipboard content for assertions
export const getMockClipboardContent = () => clipboardContent;

// Helper to reset the mock clipboard between tests
export const resetMockClipboard = () => {
  clipboardContent = "";
  writeText.mockClear();
  readText.mockClear();
};
