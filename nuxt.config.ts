// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': "style-src 'self' https://m.stripe.network https://fonts.googleapis.com 'unsafe-inline';"
        }
      }
    }
  },
  routeRules: {
    "/dashboard/**": { ssr: false },
  },
  css: [
    "~/assets/css/main.css",
    "~/assets/scss/main.scss"
  ],
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@sidebase/nuxt-auth",
    "nuxt-headlessui",
    "@pinia/nuxt",
    "@nuxt/content",
    "@nuxt/eslint",
    "nuxt-og-image",
    "@nuxtjs/i18n",
    'nuxt-site-config',
  ],
  content: {
    highlight: {
      theme: "github-light",
    },
  },
  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    "components:extend": (components) => {
      const globals = components.filter((c) =>
        ["UButton", "UIcon", "UAlert"].includes(c.pascalName)
      );

      globals.forEach((c) => (c.global = true));
    },
  },

  ui: {
    icons: ["mdi", "heroicons", "simple-icons"],
  },

  auth: {
    provider: {
      type: "authjs",
    },
  },

  app: {
    pageTransition: {
      name: 'page-transition',
      mode: 'out-in'
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in'
    },
    head: {
      // ... existing head config if any
    }
  },

  typescript: {
    strict: true,
  },

  plugins: [
    '~/plugins/i18n-loader.ts'
  ],

  runtimeConfig: {
    // The private keys which are only available within server-side
    AuthSecret: "",
    GoogleClientId: "",
    GoogleClientSecret: "",
    ResendApiKey: "",
    
    // Stripe 配置
    stripeSecretKey: process.env.NUXT_STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.NUXT_STRIPE_WEBHOOK_SECRET,
    StripePrices: {
      pro: {
        monthly: process.env.NUXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
        yearly: process.env.NUXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID
      },
      business: {
        monthly: process.env.NUXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID,
        yearly: process.env.NUXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID
      }
    },

    public: {
      SiteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      StripePrices: {
        pro: {
          monthly: process.env.NUXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
          yearly: process.env.NUXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID
        },
        business: {
          monthly: process.env.NUXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID,
          yearly: process.env.NUXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID
        }
      },
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    }
  },

  compatibilityDate: "2024-07-06",

  i18n: {
    langDir: 'locales',  // 移除开头的 'i18n/'，因为模块会自动添加
    locales: [
      { 
        code: 'en', 
        iso: 'en-US', 
        files: [
          'en.json',
          'components/en/header.json',
          'components/en/footer.json',
          'components/en/dashboard.json',
          'components/en/hero.json',
          'components/en/auth.json',
          'components/en/features.json',
          'components/en/pricing.json',
          'components/en/faq.json',
          'docs/en/index.json',
          'docs/en/getting-started.json',
          'docs/en/configuration.json'
        ],
        name: 'English' 
      },
      { 
        code: 'zh', 
        iso: 'zh-CN', 
        files: [
          'zh.json',
          'components/zh/header.json',
          'components/zh/footer.json',
          'components/zh/dashboard.json',
          'components/zh/hero.json',
          'components/zh/auth.json',
          'components/zh/features.json',
          'components/zh/pricing.json',
          'components/zh/faq.json',
          'docs/zh/index.json',
          'docs/zh/getting-started.json',
          'docs/zh/configuration.json'
        ],
        name: '中文' 
      }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,  // 完全禁用浏览器语言检测，避免重定向循环
    lazy: true,
    pages: {
      'index': {
        en: '/',
        zh: '/zh'
      },
      'dashboard/index': {
        en: '/dashboard',
        zh: '/dashboard' // 移除重复的zh路径
      },
      'pricing': {
        en: '/pricing',
        zh: '/pricing' // 移除重复的zh路径
      }
    },
    customRoutes: 'config',
    vueI18n: './i18n/vue-i18n.options.ts',
    skipSettingLocaleOnNavigate: true,  // 导航时不重置语言设置
    compilation: {
      strictMessage: false,      // 不严格检查消息格式
      escapeHtml: false          // 不转义HTML
    }
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    name: '您的网站名称',
    robots: {
      // 默认配置
      enabled: true,
      // 可以添加更多自定义规则
      disallow: [],
      allow: ['/'],
    },
    i18n: {
      locales: ['en', 'zh'],
      defaultLocale: 'en',
      seo: true,
      routesNameSeparator: '___',
      strategy: 'prefix_except_default',
      detectBrowserLanguage: false  // 同样禁用site配置中的浏览器语言检测
    }
  },
});
