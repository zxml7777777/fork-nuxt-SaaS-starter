import Stripe from "stripe";

// 不要在顶层调用 useRuntimeConfig
let stripe: Stripe | null = null;

// 创建一个获取 stripe 实例的函数
export function getStripe() {
  if (!stripe) {
    const config = useRuntimeConfig();
    stripe = new Stripe(config.stripeSecretKey, {
      apiVersion: "2023-10-16",
      typescript: true,
    });
  }
  return stripe;
}

export async function createCustomerPortalSession(customerId: string) {
  const config = useRuntimeConfig();
  const stripe = getStripe();
  
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${config.public.siteUrl}/dashboard/billing`,
  });
  return session;
}
