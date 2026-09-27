import { render, screen } from "@testing-library/react";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";

// Mock next/link since we're testing components outside Next.js context
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("AffiliateDisclosure", () => {
  it("footer variant renders non-affiliation statement", () => {
    render(<AffiliateDisclosure variant="footer" />);
    expect(
      screen.getByText(/not affiliated with or endorsed by Coursera/i)
    ).toBeInTheDocument();
  });

  it("footer variant includes link to disclosure page", () => {
    render(<AffiliateDisclosure variant="footer" />);
    const link = screen.getByRole("link", { name: /full affiliate disclosure/i });
    expect(link).toHaveAttribute("href", "/legal#affiliate-disclosure");
  });

  it("card variant renders short disclosure", () => {
    render(<AffiliateDisclosure variant="card" />);
    expect(screen.getByText(/affiliate link/i)).toBeInTheDocument();
  });

  it("card variant includes disclosure link", () => {
    render(<AffiliateDisclosure variant="card" />);
    const link = screen.getByRole("link", { name: /disclosure/i });
    expect(link).toHaveAttribute("href", "/legal#affiliate-disclosure");
  });
});
