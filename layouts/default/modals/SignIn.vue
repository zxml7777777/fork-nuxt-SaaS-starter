<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const { signIn } = useAuth();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const loadingProviders = ref<Record<string, boolean>>({
  google: false,
  github: false
});
const authStore = useAuthStore();
const toast = useToast();

// 监听路由变化，处理错误重定向
watch(() => route.query, (query) => {
  // 如果URL中包含error参数，说明登录失败，重定向到首页
  if (query.error) {
    router.replace('/');
  }
}, { immediate: true, deep: true });

// 改进登录流程，添加强制选择账号的参数
const logInWith = async (provider: string) => {
  // 设置加载状态
  loadingProviders.value[provider] = true;
  
  try {
    // 服务器端已配置账号选择参数，这里只需要简单调用
    await signIn(provider, { 
      redirect: false,
      callbackUrl: window.location.origin
    });
    
    // 登录成功后关闭模态框
    setTimeout(() => {
      loadingProviders.value[provider] = false;
      authStore.toggleSignInModal();
    }, 500);
  } catch (error) {
    loadingProviders.value[provider] = false;
    
    // 简化错误处理，只显示一个通用错误
    toast.add({
      title: t('auth.errors.general'),
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
      </div>
    </div>
  </UModal>
</template>
