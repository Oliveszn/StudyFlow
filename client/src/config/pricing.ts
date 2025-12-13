export const heroConfig = {
  title: "Choose a plan for success",
  description:
    "Don't want to buy courses one by one? Pick a plan to help you, your team, or your organization achieve outcomes faster.",
};

export const plans = [
  {
    title: "Personal Plan",
    subTitle: "For you",
    people: "Individual",
    price: "Starting at ₦7,500 per month",
    billing: "Billed monthly or annually. Cancel anytime.",
    benefits: [
      "Access to 26,000+ top courses",
      "Certification prep",
      "Goal-focused recommendations",
      "AI-powered coding exercises",
    ],
    cta: {
      text: "Start subscription",
      href: "/explore",
    },
  },

  {
    title: "Team plan",
    subTitle: "For your team",
    people: "2 to 50 people",
    price: "₦18,000 a month per user",
    billing: "Billed annually. Cancel anytime",
    benefits: [
      "Access to 13,000+ top courses",
      "Certification prep",
      "Goal-focused recommendations",
      "AI-powered coding exercises",
      "Analytics and adoption reports",
    ],
    cta: {
      text: "Try it free",
      href: "/explore",
    },
  },

  {
    title: "Enterprise Plan",
    subTitle: "For your whole organization",
    people: "More than 20 people",
    price: "Contact sales for pricing",
    billing: "",
    benefits: [
      "Access to 30,000+ top courses",
      "Certification prep",
      "Goal-focused recommendations",
      "AI-powered coding exercises",
      "Advanced analytics and insights",
      "Dedicated customer success team",
      "International course collection featuring 15 languages",
      "Customizable content",
      "Hands-on tech training with add-on",
      "Strategic implementation services with add-on",
    ],
    cta: {
      text: "Request a demo",
      href: "/explore",
    },
  },
];

export const planComparisonConfig = {
  parents: [
    {
      id: "learner-experience",
      title: "Learner experience",
      features: [
        {
          name: "Certification prep courses and practice tests",
          availability: {
            personal: true,
            team: true,
            enterprise: true,
          },
        },
        {
          name: "AI-powered coding exercises",
          availability: {
            personal: true,
            team: true,
            enterprise: true,
          },
        },
        {
          name: "Goal-aligned recommendations",
          availability: {
            personal: true,
            team: true,
            enterprise: true,
          },
        },
        {
          name: "Instructor Q&A",
          availability: {
            personal: true,
            team: true,
            enterprise: false,
          },
        },
      ],
    },

    {
      id: "admin-experience",
      title: "Admin experience",
      features: [
        {
          name: "User adoption and engagement reports",
          availability: {
            personal: false,
            team: true,
            enterprise: true,
          },
        },
        {
          name: "24/7 customer support",
          availability: {
            personal: false,
            team: true,
            enterprise: true,
          },
        },
        {
          name: "Custom learning paths, courses, and user groups",
          availability: {
            personal: false,
            team: true,
            enterprise: true,
          },
        },
        {
          name: "User activity, learning trends, and benchmark insights",
          availability: {
            personal: false,
            team: true,
            enterprise: true,
          },
        },
      ],
    },
  ],

  plan: ["personal", "team", "enterprise"],
};
