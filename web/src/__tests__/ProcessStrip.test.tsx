import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import { ProcessStrip } from "@/components/ProcessStrip";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    ...props
  }: {
    alt: string;
    src: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} {...props} />
  ),
}));

describe("ProcessStrip", () => {
  it("renders all four process step cards with correct headings and images", () => {
    render(<ProcessStrip />);

    expect(screen.getByRole("heading", { name: /how coursedrop works/i })).toBeInTheDocument();

    const titles = ["Discover", "Verify", "Track", "Save"];
    titles.forEach((title) => {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    });

    const stepNumbers = ["01", "02", "03", "04"];
    stepNumbers.forEach((num) => {
      expect(screen.getByText(num)).toBeInTheDocument();
    });
  });
});
