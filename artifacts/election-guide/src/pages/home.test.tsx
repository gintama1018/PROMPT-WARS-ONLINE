import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "wouter";
import Home from "./home";
import "@testing-library/jest-dom";

// Mock wouter
vi.mock("wouter", async () => {
  const actual = await vi.importActual("wouter");
  return {
    ...actual,
    useLocation: () => ["/", () => {}],
  };
});

// Mock lucide-react icons to avoid rendering issues
vi.mock("lucide-react", () => ({
  BookOpen: () => <div data-testid="icon-book-open">BookOpen</div>,
  Clock: () => <div data-testid="icon-clock">Clock</div>,
  CheckSquare: () => <div data-testid="icon-check-square">CheckSquare</div>,
  Shield: () => <div data-testid="icon-shield">Shield</div>,
  HelpCircle: () => <div data-testid="icon-help-circle">HelpCircle</div>,
  ArrowRight: () => <div data-testid="icon-arrow-right">ArrowRight</div>,
}));

describe("Home Page", () => {
  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  it("should render the home page with hero section", () => {
    renderHome();
    
    expect(screen.getByText("Democracy, Explained Clearly.")).toBeInTheDocument();
    expect(screen.getByText(/Your nonpartisan, citizen-first guide/)).toBeInTheDocument();
  });

  it("should render navigation buttons in hero section", () => {
    renderHome();
    
    expect(screen.getByText("Get Ready to Vote")).toBeInTheDocument();
    expect(screen.getByText("Understand the Process")).toBeInTheDocument();
  });

  it("should render quick access section with title", () => {
    renderHome();
    
    expect(screen.getByText("Quick Access")).toBeInTheDocument();
    expect(screen.getByText(/Everything you need to navigate the elections/)).toBeInTheDocument();
  });

  it("should render all quick access tiles", () => {
    renderHome();
    
    expect(screen.getByText("Learn")).toBeInTheDocument();
    expect(screen.getByText("Timeline")).toBeInTheDocument();
    expect(screen.getByText("Vote")).toBeInTheDocument();
    expect(screen.getByText("Your Rights")).toBeInTheDocument();
  });

  it("should render the ask the guide section", () => {
    renderHome();
    
    expect(screen.getByText("Have specific questions?")).toBeInTheDocument();
    expect(screen.getByText(/Chat with our AI guide/)).toBeInTheDocument();
    expect(screen.getByText("Ask The Guide")).toBeInTheDocument();
  });

  it("should render countdown section title", () => {
    renderHome();
    
    expect(screen.getByText("Upcoming: India State Elections")).toBeInTheDocument();
  });

  it("should render language note disclaimer", () => {
    renderHome();
    
    expect(screen.getByText(/Note: This guide is available in English/)).toBeInTheDocument();
  });

  it("should render all icon components", () => {
    renderHome();
    
    expect(screen.getByTestId("icon-book-open")).toBeInTheDocument();
    expect(screen.getByTestId("icon-clock")).toBeInTheDocument();
    expect(screen.getByTestId("icon-check-square")).toBeInTheDocument();
    expect(screen.getByTestId("icon-shield")).toBeInTheDocument();
    expect(screen.getByTestId("icon-help-circle")).toBeInTheDocument();
  });

  it("should render tile descriptions", () => {
    renderHome();
    
    expect(screen.getByText("Understand how elections work.")).toBeInTheDocument();
    expect(screen.getByText("Follow the step-by-step journey.")).toBeInTheDocument();
    expect(screen.getByText("Your practical voting guide.")).toBeInTheDocument();
    expect(screen.getByText("Protect your democratic power.")).toBeInTheDocument();
  });

  it("should have proper page structure", () => {
    const { container } = renderHome();
    
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(2);
  });

  it("should render countdown with timer units", () => {
    renderHome();
    
    expect(screen.getByText("Days")).toBeInTheDocument();
    expect(screen.getByText("Hours")).toBeInTheDocument();
    expect(screen.getByText("Minutes")).toBeInTheDocument();
    expect(screen.getByText("Seconds")).toBeInTheDocument();
  });

  it("should render election date", () => {
    renderHome();
    
    expect(screen.getByText("January 31, 2025")).toBeInTheDocument();
  });
});
