import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ApiKeyPage from "./ApiKeyPage";
import {
  resetMemoryStore,
  seedMemoryStore,
} from "../__mocks__/@tauri-apps/plugin-store"; // Import helpers
import { resetMockClipboard } from "../__mocks__/@tauri-apps/plugin-clipboard-manager"; // Import helpers
import { Service, ApiKey } from "@/types"; // Import types

// Mock the sonner toast function
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock the AddKeyForm component as it's not the focus of these tests
vi.mock("@/components/AddKeyForm", () => ({
  AddKeyForm: ({ onKeyAdded }: { onKeyAdded: () => void }) => (
    <div data-testid="mock-add-key-form">
      Mock Add Key Form
      <button onClick={onKeyAdded}>Simulate Key Added</button>
    </div>
  ),
}));

// Corrected mock data based on src/types.ts
const mockService: Service = { name: "TestService", api_keys: [] }; // Added api_keys
const mockApiKeys: ApiKey[] = [
  {
    key: "key123",
    rate_limit_time: 1,
    is_rate_limited: false,
    rateLimitedAt: null,
  },
  {
    key: "key456",
    rate_limit_time: 2,
    is_rate_limited: true,
    rateLimitedAt: Date.now() - 3600000, // Limited 1 hour ago (2h limit)
  },
];

// Helper function to render the component within necessary context
// Removed default value for service parameter
const renderApiKeyPage = (
  service: Service | undefined,
  initialKeys: ApiKey[] = mockApiKeys
) => {
  const storeKey = service ? `api_keys_${service.name}` : null;
  if (storeKey) {
    seedMemoryStore({ [storeKey]: initialKeys });
  } else {
    resetMemoryStore();
  }
  resetMockClipboard();

  // Use MemoryRouter to provide routing context needed by useLocation
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/keys", state: { service } }]}>
      <Routes>
        <Route path="/keys" element={<ApiKeyPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("ApiKeyPage", () => {
  beforeEach(() => {
    // Reset mocks and store before each test
    resetMemoryStore();
    resetMockClipboard();
    vi.clearAllMocks(); // Clear call history of all mocks
  });

  it("renders the service name and API keys", async () => {
    // Pass service explicitly
    renderApiKeyPage(mockService, mockApiKeys);

    // Check if API keys are displayed (wait for async load)
    await waitFor(() => {
      // Check for masked keys
      expect(screen.getByText("key1********************")).toBeInTheDocument();
      expect(screen.getByText("key4********************")).toBeInTheDocument();
    });

    // Check initial rate limit status text
    expect(screen.getByText("Not Rate Limited")).toBeInTheDocument();
    expect(screen.getByText(/Rate Limited \(Wait/)).toBeInTheDocument(); // Check for partial text
  });

  it("renders message if service data is not found", () => {
    // Pass undefined service explicitly
    renderApiKeyPage(undefined, []);
    expect(screen.getByText("Service data not found.")).toBeInTheDocument();
  });

  // Add more tests here for:
  // - Adding a key (interacting with mocked AddKeyForm)
  // - Deleting a key (clicking delete, confirming dialog)
  // - Toggling rate limit (clicking button, checking status change, checking store mock)
  // - Copying a key (clicking copy, checking clipboard mock)
  // - Getting random key (clicking button, checking clipboard/store mocks, handling edge cases)
  // - Timer updates (requires advancing time with vi.useFakeTimers)
  // - Error handling (mocking plugin functions to throw errors)
});
