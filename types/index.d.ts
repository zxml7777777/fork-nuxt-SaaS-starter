import type { User } from "@prisma/client";
declare module "nuxt/schema" {
  interface PublicRuntimeConfig {
    SiteUrl: string;
    StripePrices: {
      pro: {
        monthly: string;
        yearly: string;
      };
      business: {
        monthly: string;
        yearly: string;
      };
    };
  }
}
declare module "@nuxt/schema" {
  interface PublicRuntimeConfig {
    SiteUrl: string;
  }
  interface ConfigSchema {
    runtimeConfig: {
      AuthSecret: string;
      GoogleClientId: string;
      GoogleClientSecret: string;
      StripeSecretKey: string;
      StripeWebhookSecret: string;
      ResendApiKey: string;
      StripePrices: {
        pro: {
          monthly: string;
          yearly: string;
        };
        business: {
          monthly: string;
          yearly: string;
        };
      };
      public: {
        SiteUrl: string;
        StripePrices: {
          pro: {
            monthly: string;
            yearly: string;
          };
          business: {
            monthly: string;
            yearly: string;
          };
        };
      };
    };
  }
}
export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
    stripeCurrentPeriodEnd?: number;
    isPaid: boolean;
    interval: "month" | "year" | null;
    isCanceled?: boolean;
  };

export type Frenquency = {
  value: "monthly" | "yearly";
  label: string;
  default?: boolean;
};
export type SubscriptionPlan = {
  mostPopular?: boolean;
  title: string;
  description: string;
  benefits: string[];
  prices: {
    monthly: number;
    yearly: number;
  };
  stripeIds: {
    monthly: string | null;
    yearly: string | null;
  };
};
