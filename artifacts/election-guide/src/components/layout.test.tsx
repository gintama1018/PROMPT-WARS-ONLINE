import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "wouter";
import { Layout } from "./layout";
import "@testing-library/jest-dom";

// Mock wouter
vi.mock("wouter", async () => {
  const actual = await vi.importActual("wouter");
  return {
    ...actual,
    useLocation: () => ["/", () => {}],
  };
});

describe("Layout Component", () => {
  const renderLayout = (children = <div>Test Content</div>) => {
    return render(
      <BrowserRouter>
        <Layout>{children}</Layout>
      </BrowserRouter>
    );
  };

  it("should render the layout with header and main content", () => {
    renderLayout();
    
    expect(screen.getByText("The People's Election Guide")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should render all navigation items in desktop nav", () => {
    renderLayout();
    
    expect(screen.getByText("What Is An Election?")).toBeInTheDocument();
    expect(screen.getByText("Timeline")).toBeInTheDocument();
    expect(screen.getByText("How To Vote")).toBeInTheDocument();
    expect(screen.getByText("Your Rights")).toBeInTheDocument();
    expect(screen.getByText("Ask The Guide")).toBeInTheDocument();
    expect(screen.getByText("Quiz")).toBeInTheDocument();
  });

  it("should have a menu button for mobile navigation", () => {
    renderLayout();
    
    const menuButtons = screen.getAllByRole("button");
    expect(menuButtons.length).toBeGreaterThan(0);
  });

  it("should render header as sticky", () => {
    renderLayout();
    
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("sticky");
  });

  it("should render children content correctly", () => {
    const testContent = "Custom test content for layout";
    renderLayout(<div>{testContent}</div>);
    
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    renderLayout();
    
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("should render minimum viable structure", () => {
    const { container } = renderLayout();
    
    const div = container.querySelector("div.min-h-\\[100dvh\\]");
    expect(div).toBeInTheDocument();
  });
});
