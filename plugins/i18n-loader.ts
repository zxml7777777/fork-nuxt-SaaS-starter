// plugins/i18n-loader.ts
export default defineNuxtPlugin(async (nuxtApp) => {
    // 获取i18n实例
    const i18n = nuxtApp.$i18n as any;
    const { locale, messages } = i18n;
    
    // 预加载函数
    const preloadTranslations = async (lang: string) => {
      if (messages.value[lang] && Object.keys(messages.value[lang]).length > 0) {
        console.log(`${lang}翻译已加载，跳过预加载`);
        return;
      }
      
      console.log(`预加载${lang}翻译...`);
      
      try {
        // 加载主文件
        const mainTranslation = await import(`~/i18n/locales/${lang}.json`)
          .catch(err => {
            console.warn(`无法从i18n/locales加载${lang}主文件，尝试从locales加载:`, err);
            return import(`~/locales/${lang}.json`)
              .catch(innerErr => {
                console.error(`无法加载${lang}主文件:`, innerErr);
                return { default: {} };
              });
          });
        
        // 加载组件文件
        const componentPaths = [
          'header', 'footer', 'dashboard', 'hero', 
          'auth', 'features', 'pricing', 'faq'
        ];
        
        const componentPromises = componentPaths.map(component => 
          import(`~/i18n/locales/components/${lang}/${component}.json`)
            .catch(err => {
              console.warn(`无法从i18n/locales加载组件${component}，尝试从locales加载`);
              return import(`~/locales/components/${lang}/${component}.json`)
                .catch(innerErr => {
                  console.warn(`无法加载组件${component}:`, innerErr);
                  return { default: {} };
                });
            })
        );
        
        const componentResults = await Promise.all(componentPromises);
        
        // 合并翻译
        const mergedTranslation = {};
        
        // 合并主文件
        if (mainTranslation.default) {
          Object.assign(mergedTranslation, mainTranslation.default);
        }
        
        // 合并组件文件
        componentResults.forEach(module => {
          if (module.default) {
            Object.assign(mergedTranslation, module.default);
          }
        });
        
        // 如果有翻译内容，设置到messages中
        if (Object.keys(mergedTranslation).length > 0) {
          messages.value[lang] = mergedTranslation;
          console.log(`${lang}翻译已手动加载，包含${Object.keys(mergedTranslation).length}个顶级键`);
        } else {
          console.warn(`${lang}翻译为空`);
        }
      } catch (error) {
        console.error(`加载${lang}翻译失败:`, error);
      }
    };
    
    // 启动时预加载所有翻译
    const supportedLocales = ['en', 'zh'];
    await Promise.all(supportedLocales.map(lang => preloadTranslations(lang)));
    
    // 提供一个全局方法用于手动加载翻译
    return {
      provide: {
        preloadTranslations
      }
    };
  });