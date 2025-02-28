import { getServerSession } from "#auth";
import type { Session } from "next-auth";
import { prisma } from "~/lib/prisma";
import { getStripe } from "~/lib/stripe";
import { SubscriptionPlan } from "~/types";

export default defineEventHandler(async (event) => {
  try {
    const { plans } = useAppConfig().subscriptions as {
      plans: SubscriptionPlan[];
    };
    
    // 获取用户会话
    const session = await getServerSession(event);
    
    // 改进的授权检查
    if (!session?.user?.id || !session?.user?.email) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized - Please login first",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
      select: {
        stripeSubscriptionId: true,
        stripeCurrentPeriodEnd: true,
        stripeCustomerId: true,
        stripePriceId: true,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    // 检查用户是否有付费计划
    const isPaid =
      user.stripePriceId &&
      user.stripeCurrentPeriodEnd &&
      user.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now();

    // 查找用户的计划信息
    const userPlan =
      plans.find((plan) => plan.stripeIds.monthly === user.stripePriceId) ||
      plans.find((plan) => plan.stripeIds.yearly === user.stripePriceId);

    const plan = isPaid && userPlan ? userPlan : plans[0];

    const interval = isPaid
      ? userPlan?.stripeIds.monthly === user.stripePriceId
        ? "month"
        : userPlan?.stripeIds.yearly === user.stripePriceId
        ? "year"
        : null
      : null;

    let isCanceled = false;
    if (isPaid && user.stripeSubscriptionId) {
      try {
        const stripe = getStripe(); // 使用新的 getStripe() 方式
        const stripePlan = await stripe.subscriptions.retrieve(
          user.stripeSubscriptionId
        );
        isCanceled = stripePlan.cancel_at_period_end;
      } catch (error: any) {
        console.error('Error retrieving stripe subscription:', error);
        // 继续执行，但不抛出错误
      }
    }

    return {
      ...plan,
      ...user,
      stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd
        ? user.stripeCurrentPeriodEnd.getTime()
        : undefined,
      isPaid,
      interval,
      isCanceled,
    };
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal server error",
    });
  }
});
