import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HeroDecorativeBackground } from "@/components/HeroDecorativeBackground";
import { SectionDecorativeBackground } from "@/components/SectionDecorativeBackground";

describe("HeroDecorativeBackground", () => {
  it("renders with aria-hidden true and pointer-events-none to ensure accessibility compliance", () => {
    const { container } = render(<HeroDecorativeBackground />);
    const bgContainer = container.querySelector(".hero-decorative-bg");
    expect(bgContainer).toBeInTheDocument();
    expect(bgContainer).toHaveAttribute("aria-hidden", "true");
    expect(bgContainer).toHaveClass("pointer-events-none");
    expect(bgContainer).toHaveClass("z-0");
  });

  it("contains svg background layers, dots, and vector elements", () => {
    const { container } = render(<HeroDecorativeBackground />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(4);
  });
});

describe("SectionDecorativeBackground", () => {
  it("renders properly with different variants", () => {
    const { container: rightContainer } = render(<SectionDecorativeBackground variant="right" />);
    expect(rightContainer.firstChild).toHaveAttribute("aria-hidden", "true");

    const { container: leftContainer } = render(<SectionDecorativeBackground variant="left" />);
    expect(leftContainer.firstChild).toHaveAttribute("aria-hidden", "true");

    const { container: minimalContainer } = render(<SectionDecorativeBackground variant="minimal" />);
    expect(minimalContainer.firstChild).toHaveAttribute("aria-hidden", "true");
  });
});
