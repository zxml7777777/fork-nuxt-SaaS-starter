<template>
  <div>
    <div v-if="pending" class="flex justify-center items-center py-24 sm:py-32">
      <ULoading />
    </div>
    
    <div v-else>
      <h2 class="text-2xl font-semibold leading-7 text-gray-900">{{ t('dashboard.billing.title') }}</h2>
      <p class="mt-1 text-sm leading-6 text-gray-500 mb-2">
        {{ t('dashboard.billing.subtitle') }}
      </p>
      <div
        class="mt-4 mx-auto max-w-2xl space-y-16 sm:space-y-8 lg:mx-0 lg:max-w-none"
      >
        <UAlert
          icon="i-heroicons-information-circle"
          color="primary"
          variant="solid"
          :title="t('dashboard.billing.demoAlert')"
        >
          <template #description>
            {{ t('dashboard.billing.demoDescription') }}
            <NuxtLink
              to="https://stripe.com/docs/testing"
              :external="true"
              target="_blank"
              class="underline"
              >{{ t('dashboard.billing.stripeDoc') }}</NuxtLink
            >
          </template>
        </UAlert>
        <USkeleton v-if="!subscription" class="w-full h-64" />
        <div v-else>
          <h2 class="text-base font-semibold leading-7 text-gray-900">
            Subscription plan
          </h2>
          <p class="mt-1 text-sm leading-6 text-gray-500 mb-2">
            You are currently on to the
            <strong>{{ subscription.title }}</strong> plan.
          </p>
          <p
            class="mt-1 text-sm leading-6 mb-2 font-semibold"
            :class="[subscription.isCanceled ? 'text-red-700' : 'text-green-700']"
            v-if="subscription.stripeCurrentPeriodEnd"
          >
            {{
              subscription.isCanceled
                ? "Your plan will be canceled on: "
                : "Your plan renews on:"
            }}
            {{ formatDate(subscription.stripeCurrentPeriodEnd) }}
          </p>
          <div class="pt-2">
            <UButton
              :loading="manageSubscriptionLoading"
              :disabled="manageSubscriptionLoading"
              @click.prevent="handleManageSubscription"
              size="lg"
              v-if="subscription.isPaid && subscription.stripeCustomerId"
            >
              Manage subscription
            </UButton>
            <UButton size="lg" v-else to="/pricing"> Choose a plan</UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UserSubscriptionPlan } from "~/types";
const toast = useToast();
const manageSubscriptionLoading = ref(false);
const isLoading = ref(false)
const { t } = useI18n();

const { pending: i18nPending } = useAsyncData('billing-i18n', async () => {
  await nextTick();
  return true;
});

async function handleManageSubscription() {
  try {
    manageSubscriptionLoading.value = true;
    const response = await $fetch('/api/subscriptions/manage', {
      method: 'POST'
    });
    
    if (response?.url) {
      window.location.href = response.url;
    } else {
      throw new Error('Failed to get subscription management URL');
    }
  } catch (error: any) {
    toast.add({
      title: "Error",
      color: "red", 
      description: error.data?.message || "Unable to open subscription management page. Please try again later.",
    });
  } finally {
    manageSubscriptionLoading.value = false;
  }
}

const { data: subscription, pending: subscriptionPending } = await useFetch<UserSubscriptionPlan>(
  "/api/get-subscription",
  {
    server: false,
    lazy: true,
  }
);

const pending = computed(() => i18nPending.value || subscriptionPending.value || isLoading.value);

useHead({
  title: t('dashboard.billing.title'),
});

definePageMeta({
  layout: "dashboard",
});
</script>
