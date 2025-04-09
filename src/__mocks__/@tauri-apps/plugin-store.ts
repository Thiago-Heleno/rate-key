// src/__mocks__/@tauri-apps/plugin-store.ts
import { vi } from "vitest";

// Simple in-memory store for testing
// Removed disable comment
const memoryStore: Record<string, any> = {};

const mockStore = {
  // Mock implementation for store.set
  // Removed disable comment
  set: vi.fn(async (key: string, value: any) => {
    memoryStore[key] = value;
  }),
  // Mock implementation for store.get
  // Removed disable comment
  get: vi.fn(async (key: string) => {
    return memoryStore[key] ?? null;
  }),
  // Mock implementation for store.save (can be a no-op for basic tests)
  save: vi.fn(async () => {
    // console.log('Mock store saved:', JSON.stringify(memoryStore));
  }),
  // Mock implementation for store.load (can be a no-op or return the mockStore)
  load: vi.fn(async () => {
    // console.log('Mock store loaded');
  }),
  // Add other methods if needed (e.g., delete, clear, keys, length, onKeyChange)
  delete: vi.fn(async (key: string) => {
    delete memoryStore[key];
    return true;
  }),
  clear: vi.fn(async () => {
    Object.keys(memoryStore).forEach((key) => delete memoryStore[key]);
  }),
  keys: vi.fn(async () => {
    return Object.keys(memoryStore);
  }),
  length: vi.fn(async () => {
    return Object.keys(memoryStore).length;
  }),
  // Mock onKeyChange if used - typically requires more complex setup
  onKeyChange: vi.fn(() => {
    return Promise.resolve(() => {}); // Returns a mock unlisten function
  }),
};

// Mock implementation for the top-level load function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const load = vi.fn(async (_path: string) => {
  // Return the mock store instance when load is called
  return mockStore;
});

// You might need to export a class if the original uses one
// export class Store { ... }

// Helper to reset the memory store between tests
export const resetMemoryStore = () => {
  Object.keys(memoryStore).forEach((key) => delete memoryStore[key]);
  // Reset call counts on mocks if needed
  mockStore.set.mockClear();
  mockStore.get.mockClear();
  mockStore.save.mockClear();
  mockStore.load.mockClear();
  mockStore.delete.mockClear();
  mockStore.clear.mockClear();
  mockStore.keys.mockClear();
  mockStore.length.mockClear();
  load.mockClear();
};

// Helper to seed the store for tests
// Removed disable comment
export const seedMemoryStore = (data: Record<string, any>) => {
  resetMemoryStore(); // Clear first
  Object.assign(memoryStore, data);
};
