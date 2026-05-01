import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "wouter";
import Quiz from "./quiz";
import "@testing-library/jest-dom";

// Mock wouter
vi.mock("wouter", async () => {
  const actual = await vi.importActual("wouter");
  return {
    ...actual,
    useLocation: () => ["/quiz", () => {}],
  };
});

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  CheckCircle2: () => <div data-testid="icon-check-circle">CheckCircle2</div>,
  XCircle: () => <div data-testid="icon-x-circle">XCircle</div>,
  Share2: () => <div data-testid="icon-share">Share2</div>,
  RefreshCw: () => <div data-testid="icon-refresh">RefreshCw</div>,
  Trophy: () => <div data-testid="icon-trophy">Trophy</div>,
  ArrowRight: () => <div data-testid="icon-arrow-right">ArrowRight</div>,
}));

describe("Quiz Page", () => {
  const renderQuiz = () => {
    return render(
      <BrowserRouter>
        <Quiz />
      </BrowserRouter>
    );
  };

  it("should render quiz page with title", () => {
    renderQuiz();
    
    expect(screen.getByText("The Election Quiz")).toBeInTheDocument();
  });

  it("should render quiz description", () => {
    renderQuiz();
    
    expect(screen.getByText(/Test your understanding of the Indian election system/)).toBeInTheDocument();
  });

  it("should render start button initially", () => {
    renderQuiz();
    
    const startButton = screen.getByRole("button", { name: /Start Quiz/i });
    expect(startButton).toBeInTheDocument();
  });

  it("should have proper page structure", () => {
    const { container } = renderQuiz();
    
    const mainContainer = container.querySelector(".container");
    expect(mainContainer).toBeInTheDocument();
  });

  it("should render quiz with minimum content", () => {
    renderQuiz();
    
    const element = screen.getByText("The Election Quiz");
    expect(element.parentElement).toBeInTheDocument();
  });
});
