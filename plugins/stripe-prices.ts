export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const appConfig = useAppConfig();

  // 注入 Pro 计划的价格 ID
  appConfig.subscriptions.plans[1].stripeIds = {
    monthly: config.StripePrices.pro.monthly,
    yearly: config.StripePrices.pro.yearly,
  };

  // 注入 Business 计划的价格 ID
  appConfig.subscriptions.plans[2].stripeIds = {
    monthly: config.StripePrices.business.monthly,
    yearly: config.StripePrices.business.yearly,
  };
}); 