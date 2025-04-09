import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom"; // Removed unused Route, Routes
import ServicesPage from "./ServicesPage";
import {
  resetMemoryStore,
  seedMemoryStore,
} from "../__mocks__/@tauri-apps/plugin-store";
import { Service } from "@/types";

// Mock the sonner toast function
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock the AddServiceForm component
vi.mock("@/components/AddServiceForm", () => ({
  AddServiceForm: ({ onServiceAdded }: { onServiceAdded: () => void }) => (
    <div data-testid="mock-add-service-form">
      Mock Add Service Form
      <button onClick={onServiceAdded}>Simulate Service Added</button>
    </div>
  ),
}));

// Mock the Link component from react-router-dom
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual, // Keep original exports like MemoryRouter, Route, Routes
    Link: ({ children, to, state }: any) => (
      <a href={String(to)} data-state={JSON.stringify(state)}>
        {children}
      </a>
    ),
  };
});

const mockServices: Service[] = [
  { name: "Service One", api_keys: [] },
  { name: "Service Two", api_keys: [] },
];

// Helper function to render the component
const renderServicesPage = (initialServices: Service[] = mockServices) => {
  seedMemoryStore({ services: initialServices });

  // Use MemoryRouter as ServicesPage doesn't rely on specific route state like ApiKeyPage
  return render(
    <MemoryRouter>
      <ServicesPage />
    </MemoryRouter>
  );
};

describe("ServicesPage", () => {
  beforeEach(() => {
    resetMemoryStore();
    vi.clearAllMocks();
  });

  it("renders the list of services", async () => {
    renderServicesPage();

    // Check if service names are displayed (wait for async load)
    await waitFor(() => {
      expect(screen.getByText("Service One")).toBeInTheDocument();
      expect(screen.getByText("Service Two")).toBeInTheDocument();
    });
  });

  it("renders message if no services are found", async () => {
    renderServicesPage([]); // Render with empty array

    // Check if the list is empty (no service names rendered)
    // We might need a more specific check if there's an explicit "no services" message
    await waitFor(() => {
      expect(screen.queryByText("Service One")).not.toBeInTheDocument();
    });
    // Add assertion for a "no services" message if one exists in the component
    // expect(screen.getByText(/no services found/i)).toBeInTheDocument();
  });

  // Add more tests here for:
  // - Adding a service
  // - Deleting a service
  // - Clicking Expand link (check mock Link props)
});
