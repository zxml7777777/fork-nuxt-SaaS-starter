<template>
  <div>
    <div v-if="pending" class="flex justify-center items-center py-24 sm:py-32">
      <ULoading />
    </div>
    
    <div v-else>
      <h2 class="text-2xl font-semibold leading-7 text-gray-900">{{ t('dashboard.settings.title') }}</h2>
      <p class="mt-1 text-sm leading-6 text-gray-500 mb-2">
        {{ t('dashboard.settings.subtitle') }}
      </p>
      <div
        class="mt-4 mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none"
      >
        <div>
          <h2 class="text-base font-semibold leading-7 text-gray-900">{{ t('dashboard.settings.profile.title') }}</h2>
          <p class="mt-1 text-sm leading-6 text-gray-500 mb-2">
            {{ t('dashboard.settings.profile.description') }}
          </p>
          <dl
            class="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
          >
            <UForm :schema="schema" :state="state" @submit="onSubmit">
              <div class="pt-6 sm:flex">
                <dt
                  class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6"
                >
                  {{ t('dashboard.settings.profile.name') }}
                </dt>
                <dd
                  class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto"
                >
                  <UFormGroup name="name">
                    <UInput v-model="state.name" />
                  </UFormGroup>

                  <button
                    :disabled="isFormLoading"
                    type="submit"
                    class="font-semibold text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                  >
                    {{ t('dashboard.settings.profile.update') }}
                  </button>
                </dd>
              </div>
            </UForm>
            <div class="pt-6 sm:flex">
              <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                {{ t('dashboard.settings.profile.email') }}
              </dt>
              <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div class="text-gray-900">{{ authSession?.user?.email }}</div>
              </dd>
            </div>
            <div class="pt-6 sm:flex">
              <dt class="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                {{ t('dashboard.settings.profile.role') }}
              </dt>
              <dd class="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div class="text-gray-400">{{ t('dashboard.settings.profile.comingSoon') }}</div>
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <h2 class="text-base font-semibold leading-7 text-gray-900">
            {{ t('dashboard.settings.deleteAccount.title') }}
          </h2>
          <p class="mt-1 text-sm leading-6 text-gray-500 mb-2">
            {{ t('dashboard.settings.deleteAccount.description') }}
          </p>
          <dl
            class="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
          >
            <div class="pt-6 sm:flex">
              <UButton color="red" size="lg" @click.prevent="isOpen = true">
                {{ t('dashboard.settings.deleteAccount.button') }}
              </UButton>
            </div>
          </dl>
        </div>
      </div>
      <UModal v-model="isOpen">
        <div class="p-4">
          <div>
            <div class="mx-auto flex items-center justify-center rounded-full">
              <NuxtImg
                class="size-12 rounded-full"
                :src="authSession?.user?.image"
                alt="Photo de profil"
              />
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-base font-semibold leading-6 text-gray-900">
                {{ t('dashboard.settings.deleteAccount.modal.title') }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  <span class="font-bold">{{ t('dashboard.settings.deleteAccount.modal.warning') }}</span>
                </p>
              </div>
              <UDivider class="my-4" />
              <UFormGroup class="mt-2">
                <template #label>
                  {{ t('dashboard.settings.deleteAccount.modal.confirmText') }}
                  <span class="font-bold">"{{ t('dashboard.settings.deleteAccount.modal.confirmPhrase') }}"</span>
                  {{ t('dashboard.settings.deleteAccount.modal.inBox') }}
                </template>
                <UInput v-model="passphrase" />
              </UFormGroup>
            </div>
          </div>
          <div class="mt-2">
            <UButton
              :loading="isDeleteAccountLoading"
              :disabled="isDeleteAccountLoading"
              block
              @click.prevent="confirmDeleteAccount"
              color="red"
              size="lg"
            >
              {{ t('dashboard.settings.deleteAccount.modal.button') }}
            </UButton>
          </div>
        </div>
      </UModal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { useI18n } from "vue-i18n";

const { data: authSession, getSession, signOut } = useAuth();
const { t } = useI18n();

const { pending: i18nPending } = useAsyncData('settings-i18n', async () => {
  await nextTick();
  return true;
});

const schema = z.object({
  name: z.string().min(3).max(32),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  name: authSession.value?.user?.name ?? "",
});
const toast = useToast();
const isFormLoading = ref(false);
const isOpen = ref(false);
const passphrase = ref("");

const pending = computed(() => i18nPending.value || isFormLoading.value);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isFormLoading.value = true;
  await $fetch("/api/update-profile", {
    method: "POST",
    body: JSON.stringify(event.data),
  });
  isFormLoading.value = false;
  await getSession();
  toast.add({
    title: t('dashboard.settings.profile.updated'),
    description: t('dashboard.settings.profile.updateSuccess'),
    color: "green",
  });
}
const isDeleteAccountLoading = ref(false);
async function confirmDeleteAccount() {
  isDeleteAccountLoading.value = true;
  if (passphrase.value !== "confirm delete account") {
    toast.add({
      title: t('dashboard.settings.deleteAccount.modal.invalidVerification'),
      description: t('dashboard.settings.deleteAccount.modal.pleaseType'),
      color: "red",
    });
    isDeleteAccountLoading.value = false;
    return;
  }
  await $fetch("/api/delete-account", {
    method: "DELETE",
  });
  signOut({
    callbackUrl: "/",
  });
  isDeleteAccountLoading.value = false;
  isOpen.value = false;
}
definePageMeta({
  layout: "dashboard",
});
useHead({
  title: t('dashboard.settings.title'),
});
</script>
