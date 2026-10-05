import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    [key: string]: unknown;
  }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    priority: _priority,
    ...props
  }: {
    alt: string;
    src: string;
    priority?: boolean;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} {...props} />
  ),
}));


describe("Navbar", () => {
  it("renders brand logo and exactly 3 top-level desktop nav items", () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );

    expect(screen.getByAltText("CourseDrop Logo")).toBeInTheDocument();

    const mainNav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(mainNav).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "All Deals" })).toHaveAttribute("href", "/deals");
    expect(screen.getByRole("link", { name: "100% Free" })).toHaveAttribute("href", "/free");
    expect(screen.getByRole("button", { name: /categories/i })).toBeInTheDocument();
  });

  it("opens Categories dropdown on click and displays 5 categories plus view all", () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );

    const categoriesButton = screen.getByRole("button", { name: /categories/i });
    expect(categoriesButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(categoriesButton);
    expect(categoriesButton).toHaveAttribute("aria-expanded", "true");

    expect(screen.getByRole("menuitem", { name: /computer science/i })).toHaveAttribute(
      "href",
      "/categories/computer-science"
    );
    expect(screen.getByRole("menuitem", { name: /data science/i })).toHaveAttribute(
      "href",
      "/categories/data-science"
    );
    expect(screen.getByRole("menuitem", { name: /ai & ml/i })).toHaveAttribute(
      "href",
      "/categories/artificial-intelligence"
    );
    expect(screen.getByRole("menuitem", { name: /cybersecurity/i })).toHaveAttribute(
      "href",
      "/categories/cybersecurity"
    );
    expect(screen.getByRole("menuitem", { name: /business/i })).toHaveAttribute(
      "href",
      "/categories/business"
    );
    expect(screen.getByRole("menuitem", { name: /view all categories/i })).toHaveAttribute(
      "href",
      "/categories"
    );
  });

  it("closes dropdown on Escape key", () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );

    const categoriesButton = screen.getByRole("button", { name: /categories/i });
    fireEvent.click(categoriesButton);
    expect(categoriesButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(categoriesButton, { key: "Escape" });
    expect(categoriesButton).toHaveAttribute("aria-expanded", "false");
  });

  it("opens and closes mobile menu on toggle button click", () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );

    const mobileMenuTrigger = screen.getByRole("button", { name: /open menu/i });
    expect(mobileMenuTrigger).toBeInTheDocument();

    fireEvent.click(mobileMenuTrigger);
    expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();

    // In mobile menu, check accordion for categories
    const mobileCategoriesAccordion = screen.getAllByRole("button", { name: /categories/i })[1];
    fireEvent.click(mobileCategoriesAccordion);

    expect(screen.getByText("Explore Disciplines")).toBeInTheDocument();
  });
});
