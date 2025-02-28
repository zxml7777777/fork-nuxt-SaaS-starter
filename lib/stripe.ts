import Stripe from "stripe";

const config = useRuntimeConfig();

export const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: "2024-04-10",
  typescript: true,
});

export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${config.public.siteUrl}/dashboard/billing`,
  });
  return session;
}
