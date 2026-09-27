"""Fixture data for Coursera catalog tests.

Mimics a realistic Coursera API catalog page response.
cs007 has null description and image to test null field handling.
"""

CATALOG_PAGE_7_COURSES = {
    "elements": [
        {
            "id": "cs001",
            "slug": "machine-learning-specialization",
            "name": "Machine Learning Specialization",
            "description": "Build ML models in Python using popular ML libraries.",
            "photoUrl": "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/ml.jpg",
            "domainTypes": [
                {"domainId": "data-science", "subdomainId": "machine-learning"}
            ],
        },
        {
            "id": "cs002",
            "slug": "deep-learning-specialization",
            "name": "Deep Learning Specialization",
            "description": "Master deep learning and neural networks.",
            "photoUrl": "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/dl.jpg",
            "domainTypes": [
                {"domainId": "data-science", "subdomainId": "deep-learning"}
            ],
        },
        {
            "id": "cs003",
            "slug": "python-for-everybody",
            "name": "Python for Everybody",
            "description": "Learn to program in Python.",
            "photoUrl": "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/py.jpg",
            "domainTypes": [
                {"domainId": "computer-science", "subdomainId": "python-programming"}
            ],
        },
        {
            "id": "cs004",
            "slug": "google-data-analytics",
            "name": "Google Data Analytics Professional Certificate",
            "description": "Launch your career in data analytics.",
            "photoUrl": "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/gda.jpg",
            "domainTypes": [
                {"domainId": "data-science", "subdomainId": "data-analysis"}
            ],
        },
        {
            "id": "cs005",
            "slug": "ibm-cybersecurity-analyst",
            "name": "IBM Cybersecurity Analyst Professional Certificate",
            "description": "Prepare for a cybersecurity analyst career.",
            "photoUrl": "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/cyber.jpg",
            "domainTypes": [
                {"domainId": "information-technology", "subdomainId": "security"}
            ],
        },
        {
            "id": "cs006",
            "slug": "introduction-to-cloud-computing",
            "name": "Introduction to Cloud Computing",
            "description": "Understand the fundamentals of cloud computing.",
            "photoUrl": "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/cloud.jpg",
            "domainTypes": [
                {"domainId": "information-technology", "subdomainId": "cloud-computing"}
            ],
        },
        {
            "id": "cs007",
            "slug": "intro-python-programming-sample",
            "name": "Intro to Python Programming",
            "description": None,  # null description — must be handled
            "photoUrl": None,  # null image — must be handled
            "domainTypes": [],  # no domain types
            # Extra unknown field that should be logged, not fatal
            "unknownExtraField": "some-value",
        },
    ],
    "paging": {"total": 7, "next": None},
}

# Single-course lookup response for cs007
CS007_LOOKUP = {
    "elements": [
        {
            "id": "cs007",
            "slug": "intro-python-programming-sample",
            "name": "Intro to Python Programming",
            "description": None,
            "photoUrl": None,
            "domainTypes": [],
        }
    ]
}

# Empty response for a non-existent slug
EMPTY_LOOKUP = {"elements": []}

# Page response with missing 'elements' key
MISSING_ELEMENTS_PAGE = {"paging": {"total": 0}}
