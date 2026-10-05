import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import { ThemeProvider, ThemeToggle } from "@/components/ThemeProvider";

describe("ThemeToggle", () => {
  it("renders radiogroup with both dark and light options visible", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const radiogroup = screen.getByRole("radiogroup", { name: /theme preference/i });
    expect(radiogroup).toBeInTheDocument();

    const darkRadio = screen.getByRole("radio", { name: /dark theme/i });
    const lightRadio = screen.getByRole("radio", { name: /light theme/i });

    expect(darkRadio).toBeInTheDocument();
    expect(lightRadio).toBeInTheDocument();
  });

  it("defaults to light theme with light checked", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const darkRadio = screen.getByRole("radio", { name: /dark theme/i });
    const lightRadio = screen.getByRole("radio", { name: /light theme/i });

    expect(lightRadio).toHaveAttribute("aria-checked", "true");
    expect(darkRadio).toHaveAttribute("aria-checked", "false");
  });

  it("switches to dark mode when dark button is clicked directly", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const darkRadio = screen.getByRole("radio", { name: /dark theme/i });
    const lightRadio = screen.getByRole("radio", { name: /light theme/i });

    fireEvent.click(darkRadio);

    expect(darkRadio).toHaveAttribute("aria-checked", "true");
    expect(lightRadio).toHaveAttribute("aria-checked", "false");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("switches back to light mode when light button is clicked directly", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const darkRadio = screen.getByRole("radio", { name: /dark theme/i });
    const lightRadio = screen.getByRole("radio", { name: /light theme/i });

    fireEvent.click(darkRadio);
    expect(darkRadio).toHaveAttribute("aria-checked", "true");

    fireEvent.click(lightRadio);
    expect(lightRadio).toHaveAttribute("aria-checked", "true");
    expect(darkRadio).toHaveAttribute("aria-checked", "false");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("handles arrow key navigation", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const radiogroup = screen.getByRole("radiogroup", { name: /theme preference/i });
    const darkRadio = screen.getByRole("radio", { name: /dark theme/i });
    const lightRadio = screen.getByRole("radio", { name: /light theme/i });

    fireEvent.keyDown(radiogroup, { key: "ArrowLeft" });
    expect(darkRadio).toHaveAttribute("aria-checked", "true");

    fireEvent.keyDown(radiogroup, { key: "ArrowRight" });
    expect(lightRadio).toHaveAttribute("aria-checked", "true");
  });
});
