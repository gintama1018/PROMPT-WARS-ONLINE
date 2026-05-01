import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "wouter";
import HowToVote from "./how-to-vote";
import "@testing-library/jest-dom";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  CheckCircle2: () => <div data-testid="icon-check-circle">CheckCircle2</div>,
  Download: () => <div data-testid="icon-download">Download</div>,
  ExternalLink: () => <div data-testid="icon-external-link">ExternalLink</div>,
  Printer: () => <div data-testid="icon-printer">Printer</div>,
}));

describe("How To Vote Page", () => {
  const renderHowToVote = () => {
    return render(
      <BrowserRouter>
        <HowToVote />
      </BrowserRouter>
    );
  };

  it("should render the how to vote page with title", () => {
    renderHowToVote();
    
    expect(screen.getByText("How To Vote")).toBeInTheDocument();
  });

  it("should render page description", () => {
    renderHowToVote();
    
    expect(screen.getByText(/A clear, step-by-step guide to exercising your democratic right/)).toBeInTheDocument();
  });

  it("should render eligibility section", () => {
    renderHowToVote();
    
    expect(screen.getByText("Check Eligibility")).toBeInTheDocument();
    expect(screen.getByText("You must be an Indian citizen.")).toBeInTheDocument();
  });

  it("should render age requirement", () => {
    renderHowToVote();
    
    expect(screen.getByText(/You must be 18 years of age/)).toBeInTheDocument();
  });

  it("should render voter registration section", () => {
    renderHowToVote();
    
    expect(screen.getByText("Register to Vote")).toBeInTheDocument();
    expect(screen.getByText(/Form 6/)).toBeInTheDocument();
  });

  it("should render booth section", () => {
    renderHowToVote();
    
    expect(screen.getByText("Inside the Booth")).toBeInTheDocument();
  });

  it("should have link to voters service portal", () => {
    renderHowToVote();
    
    const link = screen.getByRole("link", { name: /Voters Service Portal/i });
    expect(link).toHaveAttribute("href", "https://voters.eci.gov.in/");
  });

  it("should render check circle icons", () => {
    renderHowToVote();
    
    const icons = screen.getAllByTestId("icon-check-circle");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("should render eligibility checklist items", () => {
    renderHowToVote();
    
    expect(screen.getByText("You must be a resident of the polling area.")).toBeInTheDocument();
    expect(screen.getByText("You must be enrolled in the electoral roll.")).toBeInTheDocument();
  });

  it("should have proper page structure", () => {
    const { container } = renderHowToVote();
    
    const mainContainer = container.querySelector(".container");
    expect(mainContainer).toBeInTheDocument();
  });
});
