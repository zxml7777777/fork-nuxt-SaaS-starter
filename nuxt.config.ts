// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  routeRules: {
    "/dashboard/**": { ssr: false },
  },
  css: ["~/assets/main.css", "~/assets/scss/main.scss"],
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
    '@nuxtjs/i18n',
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
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "fade", mode: "out-in" },
  },

  typescript: {
    strict: true,
  },

  runtimeConfig: {
    // The private keys which are only available within server-side
    AuthSecret: "",
    GoogleClientId: "",
    GoogleClientSecret: "",
    StripeSecretKey: "",
    StripeWebhookSecret: "",
    ResendApiKey: "",
    // Stripe Price IDs
    StripePrices: {
      pro: {
        monthly: process.env.NUXT_STRIPE_PRO_PRICE_MONTHLY,
        yearly: process.env.NUXT_STRIPE_PRO_PRICE_YEARLY,
      },
      business: {
        monthly: process.env.NUXT_STRIPE_BUSINESS_PRICE_MONTHLY,
        yearly: process.env.NUXT_STRIPE_BUSINESS_PRICE_YEARLY,
      }
    },
    public: {
      SiteUrl: "",
    },
  },

  compatibilityDate: "2024-07-06",

  i18n: {
    langDir: 'locales',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'zh', iso: 'zh-CN', file: 'zh.json', name: '中文' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  }
});
