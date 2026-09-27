export interface Category {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  offer_count: number;
}

export interface Course {
  id: number;
  slug: string;
  platform_id: number;
  title: string;
  description?: string | null;
  image_url?: string | null;
  course_url: string;
  rating?: number | null;
  enrollment_count?: number | null;
  status: string;
  categories?: Category[];
}

export interface Offer {
  id: number;
  course_id?: number | null;
  course?: Course | null;
  source: string;
  offer_type: string;
  headline: string;
  description?: string | null;
  coupon_code?: string | null;
  original_price?: number | null;
  discounted_price?: number | null;
  discount_percentage?: number | null;
  currency: string;
  valid_from?: string | null;
  valid_to?: string | null;
  status: string;
  invalid_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OfferListResponse {
  items: Offer[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
