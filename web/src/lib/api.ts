import { Category, Offer, OfferListResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchOffers(params: {
  category?: string;
  search?: string;
  is_free?: boolean;
  min_discount?: number;
  sort?: string;
  page?: number;
  page_size?: number;
} = {}): Promise<OfferListResponse> {
  const url = new URL(`${API_BASE}/api/v1/offers`);
  if (params.category) url.searchParams.set("category", params.category);
  if (params.search) url.searchParams.set("search", params.search);
  if (params.is_free) url.searchParams.set("is_free", "true");
  if (params.min_discount) url.searchParams.set("min_discount", params.min_discount.toString());
  if (params.sort) url.searchParams.set("sort", params.sort);
  if (params.page) url.searchParams.set("page", params.page.toString());
  if (params.page_size) url.searchParams.set("page_size", params.page_size.toString());

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch offers: ${res.statusText}`);
    }
    return res.json();
  } catch (err) {
    console.warn("API unavailable, returning fallback empty results:", err);
    return { items: [], total: 0, page: 1, page_size: 20, total_pages: 1 };
  }
}

export async function fetchOfferById(id: number | string): Promise<Offer | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/offers/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Failed to fetch offer by id:", err);
    return null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.warn("Failed to fetch categories:", err);
    return [];
  }
}

export function getOfferClickUrl(offerId: number): string {
  return `${API_BASE}/api/v1/offers/${offerId}/click`;
}
