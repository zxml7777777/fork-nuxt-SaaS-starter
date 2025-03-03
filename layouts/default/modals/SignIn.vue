<script setup lang="ts">
import { ref, onMounted } from "vue";

const { signIn } = useAuth();
const { t } = useI18n();
const route = useRoute();

const loadingProviders = ref<Record<string, boolean>>({
  google: false,
  github: false
});
const authStore = useAuthStore();
const toast = useToast();
const adBlockerError = ref(false);

// 简化的错误检测
onMounted(() => {
  if (route.query.auth_error === 'true') {
    adBlockerError.value = true;
  }
});

const logInWith = async (provider: string) => {
  loadingProviders.value[provider] = true;
  adBlockerError.value = false;
  
  try {
    console.log(`Attempting to sign in with ${provider}`);
    
    // 使用默认配置进行登录
    await signIn(provider);
    
    setTimeout(() => {
      loadingProviders.value[provider] = false;
      authStore.toggleSignInModal();
    }, 500);
  } catch (error) {
    console.error(`Error signing in with ${provider}:`, error);
    loadingProviders.value[provider] = false;
    
    toast.add({
      title: '登录失败',
      description: `使用${provider}登录时出现错误`,
      color: 'red'
    });
  }
};
</script>
<template>
  <UModal v-model="authStore.isSignInModalOpen" closable>
    <div class="p-6">
      <div>
        <div class="mx-auto flex items-center justify-center">
          <SvgLogo class="h-16" aria-hidden="true" />
        </div>
        <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
          <!-- //Trick to avoid initial focus on the Close button (see https://github.com/nuxt/ui/issues/734) -->
          <button class="opacity-0 w-0 h-0" />
          <UButton
            color="indigo"
            :initial-focus="null"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="authStore.toggleSignInModal()"
          />
        </div>
        <div class="mt-5 text-center sm:mt-6">
          <h3 class="text-xl font-semibold leading-6 text-gray-900">{{ t('auth.signIn') }}</h3>
        </div>
      </div>
      
      <UAlert
        v-if="adBlockerError"
        class="mt-4"
        color="orange"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
      >
        {{ t('auth.errors.adBlocker') }}
      </UAlert>
      
      <div class="mt-8 sm:mt-10 pb-2">
        <UButton
          :loading="loadingProviders.google"
          :disabled="loadingProviders.google || loadingProviders.github"
          @click.prevent="logInWith('google')"
          type="button"
          block
          color="white"
          variant="solid"
          icon="i-mdi-google"
          size="lg"
          class="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
        >
          {{ t('auth.signInWith', ['Google']) }}
        </UButton>
        
        <div class="mt-5">
          <UButton
            :loading="loadingProviders.github"
            :disabled="loadingProviders.github || loadingProviders.google"
            @click.prevent="logInWith('github')"
            type="button"
            block
            color="white"
            variant="solid"
            icon="i-mdi-github"
            size="lg"
            class="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
          >
            {{ t('auth.signInWith', ['GitHub']) }}
          </UButton>
        </div>
        
        <!-- 将警告提示移到按钮下方，增加间距 -->
        <div class="mt-6 p-3 bg-orange-50 rounded-lg border border-orange-100">
          <p class="text-xs text-orange-700 flex items-start">
            <UIcon name="i-heroicons-exclamation-triangle" class="mr-2 flex-shrink-0 mt-0.5" />
            <span>{{ t('auth.githubAdBlockerWarning') }}</span>
          </p>
        </div>
      </div>
    </div>
  </UModal>
</template>
