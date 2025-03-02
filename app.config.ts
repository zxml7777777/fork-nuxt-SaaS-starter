export default defineAppConfig({
  ui: {
    primary: "zinc",
    gray: "slate",
  },
  site: {
    name: "Nova",
    description: "Perfect Fusion of Design and Performance",
    logo: "/logo.svg",
    social: {
      twitter: "https://twitter.com",
      github: "https://github.com/zxml7777777/fork-nuxt-SaaS-starter",
      discord: "https://discord.com",
    },
  },
  seo: {
    siteName: "Nova",
  },
  footer: {
    credits: "Nova © 2024. All Rights Reserved.",
    navigation: [
      { name: "Pricing", href: "/pricing" },
      { name: "Support", href: "/docs" },
      { name: "Privacy", href: "/privacy" },
    ],
    links: [
      {
        icon: "i-simple-icons-nuxtdotjs",
        to: "https://nuxt.com",
        target: "_blank",
        "aria-label": "Nuxt Website",
      },
      {
        icon: "i-simple-icons-github",
        to: "https://github.com/zxml7777777/fork-nuxt-SaaS-starter",
        target: "_blank",
        "aria-label": "Nuxt SaaS Starter on GitHub",
      },
    ],
  },
  subscriptions: {
    frequencies: [
      { value: "monthly", label: "Monthly", default: true },
      { value: "yearly", label: "Yearly (Save 20%)" },
    ],
    currency: "USD",
    plans: [
      {
        title: "Nova",
        description: "Basic Experience",
        benefits: [
          "Clean and intuitive user interface",
          "Basic data analytics",
          "Standard template library",
        ],
        prices: {
          monthly: 0,
          yearly: 0,
        },
        stripeIds: {
          monthly: null,
          yearly: null,
        },
      },
      {
        mostPopular: true,
        title: "Nova Pro",
        description: "Professional Creative Experience",
        benefits: [
          "Advanced UI customization",
          "Detailed data analytics and reporting",
          "Professional template library",
          "Priority technical support",
          "Exclusive training resources",
        ],
        prices: {
          monthly: 14.99,
          yearly: 143.90,
        },
        stripeIds: {
          monthly: "",
          yearly: "",
        },
      },
      {
        title: "Nova Max",
        description: "Unlimited Creative Possibilities",
        benefits: [
          "Completely unlimited usage",
          "Real-time data analytics",
          "Exclusive custom templates",
          "24/7 dedicated customer support",
          "Personalized onboarding",
        ],
        prices: {
          monthly: 29.99,
          yearly: 287.90,
        },
        stripeIds: {
          monthly: "",
          yearly: "",
        },
      },
    ],
  },
  pricing: {
    title: "Choose a Plan",
    subtitle: "Best Support for Your Creative Ideas",
    description:
      "Select a plan that fits your needs and experience the perfect combination of excellent design and powerful functionality.",
  },
  CTA: {
    title: "Ready to Start Your Innovation Journey?",
    description:
      "Sign up for Nova now and start creating amazing applications in minutes.",
    buttons: {
      auth: [
        {
          label: "Go to Dashboard",
          to: "/dashboard",
          size: "lg",
          icon: "i-heroicons-arrow-right",
          trailing: true,
        },
      ],
      guest: [
        {
          label: "Learn More",
          to: "/pricing",
          size: "lg",
          icon: "i-heroicons-arrow-right",
          trailing: true,
        },
      ],
    },
  },
  features: {
    title: "Innovative Technology",
    subtitle: "Redefining the App Development Experience",
    description:
      "Nova provides an extremely minimalist yet powerful platform, turning your ideas into reality at unprecedented speed.",
    items: [
      {
        title: "Elegant Design",
        description:
          "Simple yet sophisticated interface design, perfectly showcasing your creativity.",
        icon: "i-simple-icons-apple",
      },
      {
        title: "Lightning-Fast Deployment",
        description: "One-click deployment to the cloud, no complex configuration needed.",
        icon: "i-simple-icons-vercel",
      },
      {
        title: "Seamless Integration",
        description: "Perfect integration with your favorite tools and services, enhancing productivity.",
        icon: "i-simple-icons-figma",
      },
      {
        title: "Outstanding Performance",
        description:
          "Powerful performance support, easily handling millions of user visits.",
        icon: "i-simple-icons-amazonaws",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "What is Nova?",
        answer:
          "Nova is an application development platform that combines design and performance, helping you build and deploy professional-grade applications in minutes.",
      },
      {
        question: "How do I cancel my subscription?",
        answer:
          "You can log into your account at any time and follow the instructions to cancel your subscription. We respect your choice and won't set up complicated cancellation processes.",
      },
      {
        question: "Can I change my plan later?",
        answer:
          "Yes, you can upgrade or downgrade your plan at any time. The new plan will take effect at the end of your current billing cycle.",
      },
      {
        question: "What advantages does Nova have over other platforms?",
        answer:
          "Nova focuses on providing an exceptional user experience and design aesthetics while maintaining powerful functionality and performance. We believe in the philosophy of simplicity without being simplistic.",
      },
    ],
  },
});
