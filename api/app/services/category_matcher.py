"""Category matcher — maps Coursera domain/subdomain types to local category slugs.

Coursera's API returns domainTypes like:
  [{"domainId": "data-science", "subdomainId": "machine-learning"}, ...]

We map these to our category slugs. Unknown domains are logged but do not fail.
"""
from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)

# Mapping from Coursera domainId → our category slug
DOMAIN_MAP: dict[str, str] = {
    "data-science": "data-science",
    "computer-science": "computer-science",
    "business": "business",
    "information-technology": "information-technology",
    "language-learning": "language-learning",
    "math-and-logic": "math-and-logic",
    "personal-development": "personal-development",
    "physical-science-and-engineering": "engineering",
    "social-sciences": "social-sciences",
    "arts-and-humanities": "arts-humanities",
    "health": "health",
}

# Mapping from Coursera subdomainId → our category slug (more specific)
SUBDOMAIN_MAP: dict[str, str] = {
    "machine-learning": "machine-learning",
    "python-programming": "python",
    "algorithms": "algorithms",
    "web-development": "web-development",
    "mobile-development": "mobile-development",
    "databases": "databases",
    "networking": "networking",
    "cloud-computing": "cloud-computing",
    "security": "cybersecurity",
    "ai": "artificial-intelligence",
    "natural-language-processing": "nlp",
    "deep-learning": "deep-learning",
    "data-analysis": "data-analysis",
    "statistics": "statistics",
    "leadership-and-management": "leadership",
    "finance": "finance",
    "marketing": "marketing",
    "entrepreneurship": "entrepreneurship",
}


def extract_categories(domain_types: list[dict[str, Any]]) -> list[str]:
    """Extract local category slugs from Coursera's domainTypes array.

    Unknown domains/subdomains are logged but not fatal.
    Returns deduplicated list of category slugs.
    """
    slugs: list[str] = []

    for entry in domain_types:
        domain_id = entry.get("domainId", "")
        subdomain_id = entry.get("subdomainId", "")

        # Try subdomain first (more specific)
        if subdomain_id and subdomain_id in SUBDOMAIN_MAP:
            slugs.append(SUBDOMAIN_MAP[subdomain_id])
        elif domain_id and domain_id in DOMAIN_MAP:
            slugs.append(DOMAIN_MAP[domain_id])
        else:
            logger.debug(
                "Unknown Coursera category: domainId=%r subdomainId=%r",
                domain_id,
                subdomain_id,
            )

    # Deduplicate while preserving order
    seen: set[str] = set()
    result: list[str] = []
    for slug in slugs:
        if slug not in seen:
            seen.add(slug)
            result.append(slug)
    return result
