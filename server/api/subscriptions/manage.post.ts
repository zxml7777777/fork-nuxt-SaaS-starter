import { getServerSession } from '#auth'
import { createCustomerPortalSession } from '~/lib/stripe'
import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Get user session
    const session = await getServerSession(event)
    if (!session?.user?.id) {
      throw createError({
        statusCode: 401,
        message: 'Authentication required to manage subscription'
      })
    }

    // Get user's Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true }
    })

    if (!user?.stripeCustomerId) {
      throw createError({
        statusCode: 400,
        message: 'No payment information found for this user'
      })
    }

    // Create customer portal session
    try {
      const portalSession = await createCustomerPortalSession(user.stripeCustomerId)
      return {
        url: portalSession.url
      }
    } catch (stripeError: any) {
      throw createError({
        statusCode: 500,
        message: `Stripe error: ${stripeError.message}`
      })
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create subscription management session'
    })
  }
})
