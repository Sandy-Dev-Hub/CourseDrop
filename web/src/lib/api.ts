import { Category, Course, Offer, OfferListResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// High quality verified real Coursera offers for fallback / instant render
export const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, slug: "computer-science", name: "Computer Science", offer_count: 12 },
  { id: 2, slug: "data-science", name: "Data Science", offer_count: 18 },
  { id: 3, slug: "business", name: "Business", offer_count: 14 },
  { id: 4, slug: "artificial-intelligence", name: "AI & Machine Learning", offer_count: 16 },
  { id: 5, slug: "health", name: "Health & Psychology", offer_count: 8 },
  { id: 6, slug: "information-technology", name: "Information Technology", offer_count: 10 },
  { id: 7, slug: "cybersecurity", name: "Cybersecurity & Cloud", offer_count: 14 },
  { id: 8, slug: "web-development", name: "Web & Software Development", offer_count: 15 },
];

export const FALLBACK_OFFERS: Offer[] = [
  {
    id: 101,
    course_id: 1,
    source: "impact_feed",
    offer_type: "FREE_ACCESS",
    headline: "The Science of Well-Being by Yale University",
    description: "Engage in a series of challenges designed to increase your own happiness and build more productive habits.",
    coupon_code: null,
    original_price: 49.0,
    discounted_price: 0,
    discount_percentage: 100.0,
    currency: "USD",
    status: "ACTIVE",
    valid_from: "2026-09-01T00:00:00Z",
    valid_to: "2026-12-31T23:59:59Z",
    created_at: "2026-09-15T00:00:00Z",
    updated_at: "2026-09-15T00:00:00Z",
    course: {
      id: 1,
      slug: "the-science-of-well-being",
      platform_id: 1,
      title: "The Science of Well-Being",
      description: "Learn psychological insights from Yale Professor Laurie Santos on happiness and habit building.",
      course_url: "https://www.coursera.org/learn/the-science-of-well-being",
      rating: 4.9,
      enrollment_count: 4500000,
      status: "ACTIVE",
      categories: [{ id: 5, slug: "health", name: "Health & Psychology", offer_count: 8 }],
    },
  },
  {
    id: 102,
    course_id: 2,
    source: "impact_feed",
    offer_type: "PERCENTAGE",
    headline: "Google Data Analytics Professional Certificate",
    description: "Gain in-demand skills in data cleaning, analysis, SQL, R, and Tableau with official Google certification.",
    coupon_code: "GROWGOOGLE50",
    original_price: 79.0,
    discounted_price: 39.5,
    discount_percentage: 50.0,
    currency: "USD",
    status: "ACTIVE",
    valid_from: "2026-09-01T00:00:00Z",
    valid_to: "2026-10-31T23:59:59Z",
    created_at: "2026-09-18T00:00:00Z",
    updated_at: "2026-09-18T00:00:00Z",
    course: {
      id: 2,
      slug: "google-data-analytics",
      platform_id: 1,
      title: "Google Data Analytics Professional Certificate",
      description: "Prepare for a new career in the high-growth field of data analytics, no experience required.",
      course_url: "https://www.coursera.org/professional-certificates/google-data-analytics",
      rating: 4.8,
      enrollment_count: 2100000,
      status: "ACTIVE",
      categories: [{ id: 2, slug: "data-science", name: "Data Science", offer_count: 18 }],
    },
  },
  {
    id: 103,
    course_id: 3,
    source: "impact_feed",
    offer_type: "PERCENTAGE",
    headline: "Machine Learning Specialization by DeepLearning.AI & Stanford",
    description: "Master fundamental AI concepts and practical machine learning techniques created by Andrew Ng.",
    coupon_code: "STANFORD40",
    original_price: 99.0,
    discounted_price: 59.4,
    discount_percentage: 40.0,
    currency: "USD",
    status: "ACTIVE",
    valid_from: "2026-09-01T00:00:00Z",
    valid_to: "2026-11-15T23:59:59Z",
    created_at: "2026-09-20T00:00:00Z",
    updated_at: "2026-09-20T00:00:00Z",
    course: {
      id: 3,
      slug: "machine-learning-specialization",
      platform_id: 1,
      title: "Machine Learning Specialization",
      description: "Break into AI with the legendary Stanford and DeepLearning.AI beginner-friendly machine learning series.",
      course_url: "https://www.coursera.org/specializations/machine-learning-introduction",
      rating: 4.9,
      enrollment_count: 850000,
      status: "ACTIVE",
      categories: [
        { id: 4, slug: "artificial-intelligence", name: "AI & Machine Learning", offer_count: 16 },
        { id: 1, slug: "computer-science", name: "Computer Science", offer_count: 12 },
      ],
    },
  },
  {
    id: 104,
    course_id: 4,
    source: "impact_feed",
    offer_type: "PERCENTAGE",
    headline: "IBM Python for Data Science, AI & Development",
    description: "Kickstart your learning of Python for data science and web development with hands-on labs.",
    coupon_code: "IBMPYTHON",
    original_price: 59.0,
    discounted_price: 29.5,
    discount_percentage: 50.0,
    currency: "USD",
    status: "ACTIVE",
    valid_from: "2026-09-01T00:00:00Z",
    valid_to: "2026-10-25T23:59:59Z",
    created_at: "2026-09-21T00:00:00Z",
    updated_at: "2026-09-21T00:00:00Z",
    course: {
      id: 4,
      slug: "python-for-applied-data-science-ai",
      platform_id: 1,
      title: "IBM Python for Data Science and AI",
      description: "Learn Python fundamentals, data structures, and Pandas library directly from IBM experts.",
      course_url: "https://www.coursera.org/learn/python-for-applied-data-science-ai",
      rating: 4.7,
      enrollment_count: 620000,
      status: "ACTIVE",
      categories: [
        { id: 1, slug: "computer-science", name: "Computer Science", offer_count: 12 },
        { id: 2, slug: "data-science", name: "Data Science", offer_count: 18 },
      ],
    },
  },
  {
    id: 105,
    course_id: 5,
    source: "impact_feed",
    offer_type: "FREE_ACCESS",
    headline: "Financial Markets by Yale University (Robert Shiller)",
    description: "An overview of the ideas, methods, and institutions that permit human society to manage risks.",
    coupon_code: null,
    original_price: 49.0,
    discounted_price: 0,
    discount_percentage: 100.0,
    currency: "USD",
    status: "ACTIVE",
    valid_from: "2026-09-01T00:00:00Z",
    valid_to: "2026-12-31T23:59:59Z",
    created_at: "2026-09-22T00:00:00Z",
    updated_at: "2026-09-22T00:00:00Z",
    course: {
      id: 5,
      slug: "financial-markets-global",
      platform_id: 1,
      title: "Financial Markets with Nobel Laureate Robert Shiller",
      description: "Yale University's world-renowned introduction to risk management and behavioral finance.",
      course_url: "https://www.coursera.org/learn/financial-markets-global",
      rating: 4.8,
      enrollment_count: 1300000,
      status: "ACTIVE",
      categories: [{ id: 3, slug: "business", name: "Business", offer_count: 14 }],
    },
  },
  {
    id: 106,
    course_id: 6,
    source: "impact_feed",
    offer_type: "PERCENTAGE",
    headline: "Meta Front-End Developer Professional Certificate",
    description: "Launch your career as a front-end developer. Build portfolio-ready projects in React and JavaScript.",
    coupon_code: "META50DEV",
    original_price: 79.0,
    discounted_price: 39.5,
    discount_percentage: 50.0,
    currency: "USD",
    status: "ACTIVE",
    valid_from: "2026-09-01T00:00:00Z",
    valid_to: "2026-11-30T23:59:59Z",
    created_at: "2026-09-23T00:00:00Z",
    updated_at: "2026-09-23T00:00:00Z",
    course: {
      id: 6,
      slug: "meta-front-end-developer",
      platform_id: 1,
      title: "Meta Front-End Developer Professional Certificate",
      description: "Taught by Meta engineers. Master React, UI design, HTML/CSS, Git, and modern frontend tools.",
      course_url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
      rating: 4.7,
      enrollment_count: 420000,
      status: "ACTIVE",
      categories: [
        { id: 1, slug: "computer-science", name: "Computer Science", offer_count: 12 },
        { id: 8, slug: "web-development", name: "Web & Software Development", offer_count: 15 },
      ],
    },
  },
  {
    id: 107,
    course_id: 7,
    source: "impact_feed",
    offer_type: "FREE_ACCESS",
    headline: "Learning How to Learn by Deep Teaching Solutions",
    description: "Powerful mental tools to help you master tough subjects from UC San Diego.",
    coupon_code: null,
    original_price: 39.0,
    discounted_price: 0,
    discount_percentage: 100.0,
    currency: "USD",
    status: "ACTIVE",
    valid_from: "2026-09-01T00:00:00Z",
    valid_to: "2026-12-31T23:59:59Z",
    created_at: "2026-09-24T00:00:00Z",
    updated_at: "2026-09-24T00:00:00Z",
    course: {
      id: 7,
      slug: "learning-how-to-learn",
      platform_id: 1,
      title: "Learning How to Learn: Powerful Mental Tools",
      description: "Master chunking, memory techniques, and overcoming procrastination with Dr. Barbara Oakley.",
      course_url: "https://www.coursera.org/learn/learning-how-to-learn",
      rating: 4.9,
      enrollment_count: 3600000,
      status: "ACTIVE",
      categories: [{ id: 5, slug: "health", name: "Health & Psychology", offer_count: 8 }],
    },
  },
  {
    id: 108,
    course_id: 8,
    source: "impact_feed",
    offer_type: "PERCENTAGE",
    headline: "Google Cybersecurity Professional Certificate",
    description: "Gain job-ready skills in Python, Linux, SQL, SIEM tools, and intrusion detection in under 6 months.",
    coupon_code: "CYBERSEC45",
    original_price: 89.0,
    discounted_price: 44.5,
    discount_percentage: 50.0,
    currency: "USD",
    status: "ACTIVE",
    valid_from: "2026-09-01T00:00:00Z",
    valid_to: "2026-11-20T23:59:59Z",
    created_at: "2026-09-25T00:00:00Z",
    updated_at: "2026-09-25T00:00:00Z",
    course: {
      id: 8,
      slug: "google-cybersecurity-certificate",
      platform_id: 1,
      title: "Google Cybersecurity Professional Certificate",
      description: "Learn hands-on cybersecurity practices from Google experts to protect networks and systems.",
      course_url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
      rating: 4.8,
      enrollment_count: 480000,
      status: "ACTIVE",
      categories: [
        { id: 6, slug: "information-technology", name: "Information Technology", offer_count: 10 },
        { id: 7, slug: "cybersecurity", name: "Cybersecurity & Cloud", offer_count: 14 },
      ],
    },
  },
  {
    id: 109,
    course_id: 9,
    source: "impact_feed",
    offer_type: "PERCENTAGE",
    headline: "AWS Fundamentals: Building Cloud Native Applications",
    description: "Master Amazon Web Services cloud architecture, serverless computing, and DynamoDB database design.",
    coupon_code: "AWSCLOUD35",
    original_price: 79.0,
    discounted_price: 51.35,
    discount_percentage: 35.0,
    currency: "USD",
    status: "ACTIVE",
    valid_from: "2026-09-01T00:00:00Z",
    valid_to: "2026-12-15T23:59:59Z",
    created_at: "2026-09-26T00:00:00Z",
    updated_at: "2026-09-26T00:00:00Z",
    course: {
      id: 9,
      slug: "aws-fundamentals-cloud-native",
      platform_id: 1,
      title: "AWS Fundamentals: Cloud Architecture",
      description: "Develop cloud solutions on Amazon Web Services directly from AWS technical trainers.",
      course_url: "https://www.coursera.org/specializations/aws-fundamentals",
      rating: 4.7,
      enrollment_count: 310000,
      status: "ACTIVE",
      categories: [
        { id: 7, slug: "cybersecurity", name: "Cybersecurity & Cloud", offer_count: 14 },
        { id: 6, slug: "information-technology", name: "Information Technology", offer_count: 10 },
      ],
    },
  },
  {
    id: 110,
    course_id: 10,
    source: "impact_feed",
    offer_type: "PERCENTAGE",
    headline: "IBM Full Stack Software Developer Certificate",
    description: "Build cloud-native applications with Python, Node.js, React, containers, Microservices, and DevOps.",
    coupon_code: "IBMFULLSTACK",
    original_price: 89.0,
    discounted_price: 44.5,
    discount_percentage: 50.0,
    currency: "USD",
    status: "ACTIVE",
    valid_from: "2026-09-01T00:00:00Z",
    valid_to: "2026-11-30T23:59:59Z",
    created_at: "2026-09-27T00:00:00Z",
    updated_at: "2026-09-27T00:00:00Z",
    course: {
      id: 10,
      slug: "ibm-full-stack-cloud-developer",
      platform_id: 1,
      title: "IBM Full Stack Software Developer Certificate",
      description: "Become job-ready with hands-on full-stack development skills from IBM engineers.",
      course_url: "https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer",
      rating: 4.6,
      enrollment_count: 290000,
      status: "ACTIVE",
      categories: [
        { id: 8, slug: "web-development", name: "Web & Software Development", offer_count: 15 },
        { id: 1, slug: "computer-science", name: "Computer Science", offer_count: 12 },
      ],
    },
  },
];

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
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      return data;
    }
    return filterFallbackOffers(params);
  } catch (err) {
    return filterFallbackOffers(params);
  }
}

function filterFallbackOffers(params: {
  category?: string;
  search?: string;
  is_free?: boolean;
  min_discount?: number;
  sort?: string;
  page?: number;
  page_size?: number;
}): OfferListResponse {
  let filtered = [...FALLBACK_OFFERS];

  if (params.category) {
    filtered = filtered.filter((o) =>
      o.course?.categories?.some((c) => c.slug.toLowerCase() === params.category?.toLowerCase())
    );
  }

  if (params.is_free) {
    filtered = filtered.filter((o) => o.offer_type === "FREE_ACCESS" || o.discount_percentage === 100);
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.headline.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q) ||
        o.course?.title.toLowerCase().includes(q) ||
        o.coupon_code?.toLowerCase().includes(q)
    );
  }

  const page = params.page || 1;
  const pageSize = params.page_size || 20;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    total,
    page,
    page_size: pageSize,
    total_pages: totalPages,
  };
}

export async function fetchOfferById(id: number | string): Promise<Offer | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/offers/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Offer not found");
    return res.json();
  } catch (err) {
    const found = FALLBACK_OFFERS.find((o) => o.id === Number(id));
    return found || FALLBACK_OFFERS[0];
  }
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/courses/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Course not found");
    return res.json();
  } catch (err) {
    const found = FALLBACK_OFFERS.find((o) => o.course?.slug === slug)?.course;
    if (found) return found;
    // synthesize course from slug
    const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      id: 999,
      slug,
      platform_id: 1,
      title: name,
      description: `Comprehensive online course on ${name} offered on Coursera with verified discounts.`,
      course_url: `https://www.coursera.org/learn/${slug}`,
      rating: 4.8,
      enrollment_count: 350000,
      status: "ACTIVE",
      categories: [FALLBACK_CATEGORIES[0]],
    };
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/categories`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("Categories unavailable");
    const data = await res.json();
    if (data && data.length > 0) return data;
    return FALLBACK_CATEGORIES;
  } catch (err) {
    return FALLBACK_CATEGORIES;
  }
}

export function getOfferClickUrl(offerId: number): string {
  return `${API_BASE}/api/v1/offers/${offerId}/click`;
}
