import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";
import "@testing-library/jest-dom";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  AlertCircle: () => <div data-testid="icon-alert-circle">AlertCircle</div>,
}));

describe("NotFound Page (404)", () => {
  const renderNotFound = () => {
    return render(<NotFound />);
  };

  it("should render 404 error message", () => {
    renderNotFound();
    
    expect(screen.getByText("404 Page Not Found")).toBeInTheDocument();
  });

  it("should render helpful error message", () => {
    renderNotFound();
    
    expect(screen.getByText(/Did you forget to add the page to the router/)).toBeInTheDocument();
  });

  it("should render alert circle icon", () => {
    renderNotFound();
    
    expect(screen.getByTestId("icon-alert-circle")).toBeInTheDocument();
  });

  it("should have proper page structure", () => {
    const { container } = renderNotFound();
    
    const card = container.querySelector(".w-full");
    expect(card).toBeInTheDocument();
  });

  it("should have min-height full screen", () => {
    const { container } = renderNotFound();
    
    const mainDiv = container.querySelector(".min-h-screen");
    expect(mainDiv).toBeInTheDocument();
  });
});
