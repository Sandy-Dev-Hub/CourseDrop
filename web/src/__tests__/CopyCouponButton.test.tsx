import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CopyCouponButton } from "@/components/CopyCouponButton";

describe("CopyCouponButton", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders coupon code text", () => {
    render(<CopyCouponButton code="SAVE50" />);
    expect(screen.getByText("SAVE50")).toBeInTheDocument();
    expect(screen.getByText("📋 Copy")).toBeInTheDocument();
  });

  it("copies code to clipboard on click and updates text", async () => {
    render(<CopyCouponButton code="SAVE50" />);
    const button = screen.getByRole("button", { name: /Copy coupon code SAVE50/i });
    fireEvent.click(button);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("SAVE50");
    expect(await screen.findByText("✓ Copied")).toBeInTheDocument();
  });
});
