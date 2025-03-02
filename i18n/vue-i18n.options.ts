import { defineI18nConfig } from '#imports'

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    // 禁用缓存，确保每次都从服务器获取最新的翻译文件
    sync: true,
    silentTranslationWarn: process.env.NODE_ENV === 'production',
    missingWarn: process.env.NODE_ENV !== 'production',
    fallbackWarn: process.env.NODE_ENV !== 'production',
    // 添加调试选项
    debug: process.env.NODE_ENV !== 'production',
    // 禁用组合式API缓存
    compositionOnly: false,
    // 添加自定义加载器选项
    datetimeFormats: {
      'en': {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        },
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric'
        }
      },
      'zh': {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        },
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }
      }
    },
    numberFormats: {
      'en': {
        currency: {
          style: 'currency',
          currency: 'USD'
        }
      },
      'zh': {
        currency: {
          style: 'currency',
          currency: 'CNY'
        }
      }
    }
  }
}) 