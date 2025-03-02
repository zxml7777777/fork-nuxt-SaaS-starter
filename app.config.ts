export default defineAppConfig({
  ui: {
    primary: "zinc",
    gray: "slate",
  },
  site: {
    name: "Nova",
    description: "设计与性能的完美融合",
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
    credits: "Nova © 2024. 保留所有权利。",
    navigation: [
      { name: "选购", href: "/pricing" },
      { name: "支持", href: "/docs" },
      { name: "隐私", href: "/privacy" },
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
      { value: "monthly", label: "月付", default: true },
      { value: "yearly", label: "年付（节省20%）" },
    ],
    currency: "CNY",
    plans: [
      {
        title: "Nova",
        description: "基础体验",
        benefits: [
          "简洁直观的用户界面",
          "基础数据分析",
          "标准模板库",
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
        description: "专业创作体验",
        benefits: [
          "高级用户界面定制",
          "详细数据分析与报告",
          "专业模板库",
          "优先技术支持",
          "专属培训资源",
        ],
        prices: {
          monthly: 99,
          yearly: 999,
        },
        stripeIds: {
          monthly: "",
          yearly: "",
        },
      },
      {
        title: "Nova Max",
        description: "无限创作可能",
        benefits: [
          "完全无限制使用",
          "实时数据分析",
          "独家定制模板",
          "24/7专属客户支持",
          "个性化入职培训",
        ],
        prices: {
          monthly: 199,
          yearly: 1999,
        },
        stripeIds: {
          monthly: "",
          yearly: "",
        },
      },
    ],
  },
  pricing: {
    title: "选购方案",
    subtitle: "为您的创意提供最佳支持",
    description:
      "选择一个适合您需求的方案，体验卓越设计与强大功能的完美结合。",
  },
  CTA: {
    title: "准备好开启创新之旅了吗？",
    description:
      "立即注册Nova，在几分钟内开始创建令人惊叹的应用。",
    buttons: {
      auth: [
        {
          label: "进入控制台",
          to: "/dashboard",
          size: "lg",
          icon: "i-heroicons-arrow-right",
          trailing: true,
        },
      ],
      guest: [
        {
          label: "了解更多",
          to: "/pricing",
          size: "lg",
          icon: "i-heroicons-arrow-right",
          trailing: true,
        },
      ],
    },
  },
  features: {
    title: "创新科技",
    subtitle: "重新定义应用开发体验",
    description:
      "Nova提供极致简约而强大的平台，让您的创意以前所未有的速度成为现实。",
    items: [
      {
        title: "优雅设计",
        description:
          "简约而不简单的界面设计，为您的创意提供完美展示。",
        icon: "i-simple-icons-apple",
      },
      {
        title: "闪电部署",
        description: "一键部署应用到云端，无需复杂配置。",
        icon: "i-simple-icons-vercel",
      },
      {
        title: "无缝集成",
        description: "与您喜爱的工具和服务完美融合，提升工作效率。",
        icon: "i-simple-icons-figma",
      },
      {
        title: "卓越性能",
        description:
          "强大的性能支持，轻松应对数百万用户访问。",
        icon: "i-simple-icons-amazonaws",
      },
    ],
  },
  faq: {
    title: "常见问题",
    items: [
      {
        question: "什么是Nova？",
        answer:
          "Nova是一个融合了设计与性能的应用开发平台，帮助您在几分钟内构建并部署专业级应用。",
      },
      {
        question: "如何取消订阅？",
        answer:
          "您可以随时登录账户并按照说明取消订阅。我们尊重您的选择，不会设置复杂的取消流程。",
      },
      {
        question: "我可以稍后更改我的方案吗？",
        answer:
          "是的，您可以随时升级或降级您的方案。新方案将在当前计费周期结束时生效。",
      },
      {
        question: "Nova与其他平台相比有什么优势？",
        answer:
          "Nova专注于提供极致的用户体验和设计美感，同时保持强大的功能性和性能。我们相信简约而不简单的设计理念。",
      },
    ],
  },
});
