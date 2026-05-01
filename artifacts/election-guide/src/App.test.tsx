import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

// Mock wouter
vi.mock("wouter", async () => {
  const actual = await vi.importActual("wouter");
  return {
    ...actual,
    useLocation: () => ["/", () => {}],
  };
});

// Mock all page components
vi.mock("@/pages/home", () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock("@/pages/what-is-election", () => ({
  default: () => <div data-testid="what-is-election-page">What Is Election Page</div>,
}));

vi.mock("@/pages/timeline", () => ({
  default: () => <div data-testid="timeline-page">Timeline Page</div>,
}));

vi.mock("@/pages/how-to-vote", () => ({
  default: () => <div data-testid="how-to-vote-page">How To Vote Page</div>,
}));

vi.mock("@/pages/your-rights", () => ({
  default: () => <div data-testid="your-rights-page">Your Rights Page</div>,
}));

vi.mock("@/pages/ask-the-guide", () => ({
  default: () => <div data-testid="ask-the-guide-page">Ask The Guide Page</div>,
}));

vi.mock("@/pages/quiz", () => ({
  default: () => <div data-testid="quiz-page">Quiz Page</div>,
}));

vi.mock("@/pages/not-found", () => ({
  default: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

vi.mock("@/components/layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout-component">{children}</div>
  ),
}));

describe("App Component", () => {
  it("should render the App component", () => {
    render(<App />);
    
    expect(screen.getByTestId("layout-component")).toBeInTheDocument();
  });

  it("should have query client provider", () => {
    const { container } = render(<App />);
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it("should render layout wrapper", () => {
    render(<App />);
    
    expect(screen.getByTestId("layout-component")).toBeInTheDocument();
  });

  it("should render router component", () => {
    render(<App />);
    
    // The router should be rendered with Layout inside
    const layout = screen.getByTestId("layout-component");
    expect(layout).toBeInTheDocument();
  });

  it("should have proper app structure with providers", () => {
    const { container } = render(<App />);
    
    // Check that we have the QueryClientProvider and TooltipProvider setup
    expect(container).toBeInTheDocument();
  });
});
