// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': "style-src 'self' https://m.stripe.network https://fonts.googleapis.com 'unsafe-inline'; connect-src 'self' https://collector.github.com;"
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
    '~/plugins/i18n-loader.ts',
    '~/plugins/site-config.ts'
  ],

  runtimeConfig: {
    // The private keys which are only available within server-side
    AuthSecret: process.env.NUXT_AUTH_SECRET,
    GoogleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
    GoogleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
    ResendApiKey: process.env.NUXT_RESEND_API_KEY,
    GitHubClientId: process.env.NUXT_GITHUB_CLIENT_ID,
    GitHubClientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
    AppUrl: process.env.NUXT_APP_URL,
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
      AppUrl: process.env.NUXT_PUBLIC_APP_URL,
      RobotsHost: process.env.NUXT_PUBLIC_ROBOTS_HOST || 'https://yourdomain.com',
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
      stripePublishableKey: process.env.NUXT_STRIPE_PUBLISHABLE_KEY,
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
    lazy: false,  // 改为false，确保服务器端预渲染时加载所有翻译
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
    name: '您的SaaS应用名称',
    description: '专业的SaaS解决方案，满足您的所有需求',
    defaultLocale: 'en',
    
    // 优化robots.txt配置
    robots: {
      enabled: true,           // 启用robots.txt生成
      disableDevRobots: true,  // 开发环境禁止索引
      i18n: true,              // 自动处理多语言
      sitemap: true,           // 自动包含sitemap路径
      host: process.env.NUXT_PUBLIC_ROBOTS_HOST || process.env.NUXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
      disallow: [
        '/dashboard/**',       // 禁止索引仪表板页面
        '/api/**',             // 禁止索引API路径
        '/admin/**',           // 禁止索引管理页面
        '/account/**'          // 禁止索引账户页面
      ],
      allow: [
        '/',                   // 允许索引首页
        '/blog/**',            // 允许索引博客页面
        '/docs/**',            // 允许索引文档页面
        '/pricing'             // 允许索引定价页面
      ]
    },
    
    // 优化SEO配置
    i18n: {
      locales: ['en', 'zh'],
      defaultLocale: 'en',
      seo: true,
      routesNameSeparator: '___',
      strategy: 'prefix_except_default',
      detectBrowserLanguage: false
    },
    
    // 添加sitemap配置
    sitemap: {
      enabled: true,           // 启用sitemap生成
      autoLastmod: true,       // 自动添加lastmod属性
      xsl: true,               // 添加XSL样式表
      cacheTtl: 1000 * 60 * 60 * 24, // 缓存24小时
      host: process.env.NUXT_PUBLIC_ROBOTS_HOST || process.env.NUXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
      defaults: {
        changefreq: 'daily',
        priority: 0.7,
        lastmod: new Date()
      },
      // 自定义URL配置
      urls: [
        {
          loc: '/',
          changefreq: 'weekly',
          priority: 1.0
        },
        {
          loc: '/pricing',
          changefreq: 'monthly',
          priority: 0.8
        }
      ],
      // 排除特定路径
      exclude: [
        '/dashboard/**',
        '/api/**',
        '/admin/**',
        '/account/**'
      ]
    }
  },
});
