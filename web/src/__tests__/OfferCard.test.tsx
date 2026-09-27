import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OfferCard } from "@/components/OfferCard";
import { Offer } from "@/types";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

describe("OfferCard", () => {
  const sampleOffer: Offer = {
    id: 42,
    source: "impact_feed",
    offer_type: "PERCENTAGE",
    headline: "50% off Python Specialization",
    description: "Learn Python from the ground up.",
    coupon_code: "PYTHON50",
    original_price: 79.0,
    discounted_price: 39.5,
    discount_percentage: 50.0,
    currency: "USD",
    status: "ACTIVE",
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
    course: {
      id: 10,
      slug: "python-for-everybody",
      platform_id: 1,
      title: "Python for Everybody",
      description: "Learn to program and analyze data with Python.",
      course_url: "https://www.coursera.org/learn/python-for-everybody",
      status: "ACTIVE",
      categories: [{ id: 1, slug: "computer-science", name: "Computer Science", offer_count: 5 }],
    },
  };

  it("renders course title and headline", () => {
    render(<OfferCard offer={sampleOffer} />);
    expect(screen.getByText("Python for Everybody")).toBeInTheDocument();
  });

  it("renders discount badge and pricing", () => {
    render(<OfferCard offer={sampleOffer} />);
    expect(screen.getByText("50% OFF")).toBeInTheDocument();
    expect(screen.getByText("$39.50")).toBeInTheDocument();
    expect(screen.getByText("$79.00")).toBeInTheDocument();
  });

  it("renders affiliate notice and CTA button", () => {
    render(<OfferCard offer={sampleOffer} />);
    expect(screen.getByText("Ad / Affiliate Link")).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /Get Deal on Coursera/i });
    expect(cta).toHaveAttribute("href", "http://localhost:8000/api/v1/offers/42/click");
  });

  it("renders 100% FREE badge for free access offer", () => {
    const freeOffer: Offer = {
      ...sampleOffer,
      offer_type: "FREE_ACCESS",
      discount_percentage: 100.0,
      discounted_price: 0,
    };
    render(<OfferCard offer={freeOffer} />);
    expect(screen.getByText("100% FREE")).toBeInTheDocument();
    expect(screen.getByText("FREE")).toBeInTheDocument();
  });
});
