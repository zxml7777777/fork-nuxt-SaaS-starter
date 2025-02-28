export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig() as any;
  const appConfig = useAppConfig() as any;

  if (!config.public.StripePrices) {
    console.warn('Stripe prices not configured in runtime config');
    return;
  }

  // 注入 Pro 计划的价格 ID
  if (appConfig.subscriptions?.plans?.[1]) {
    appConfig.subscriptions.plans[1].stripeIds = {
      monthly: config.public.StripePrices.pro.monthly || null,
      yearly: config.public.StripePrices.pro.yearly || null,
    };
  }

  // 注入 Business 计划的价格 ID
  if (appConfig.subscriptions?.plans?.[2]) {
    appConfig.subscriptions.plans[2].stripeIds = {
      monthly: config.public.StripePrices.business.monthly || null,
      yearly: config.public.StripePrices.business.yearly || null,
    };
  }
}); 