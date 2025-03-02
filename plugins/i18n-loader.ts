// plugins/i18n-loader.ts
export default defineNuxtPlugin(async (nuxtApp) => {
    // 获取i18n实例
    const i18n = nuxtApp.$i18n as any;
    const { locale, messages } = i18n;
    
    // 翻译加载状态缓存
    const loadingCache = new Map<string, Promise<any>>();
    
    // 预加载翻译函数
    const preloadTranslations = async (lang: string) => {
      // 如果已经在加载中，返回缓存的promise
      if (loadingCache.has(lang)) {
        console.log(`${lang}翻译正在加载中，返回缓存的promise`);
        return loadingCache.get(lang);
      }
      
      // 如果已加载完成且有内容，直接返回
      if (messages.value[lang] && Object.keys(messages.value[lang]).length > 0) {
        console.log(`${lang}翻译已加载，共${Object.keys(messages.value[lang]).length}个键`);
        return messages.value[lang];
      }
      
      console.log(`预加载${lang}翻译...`);
      
      // 创建加载promise并缓存
      const loadingPromise = (async () => {
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
          
          // 加载docs文件
          const docsPromises = [
            import(`~/i18n/locales/docs/${lang}/index.json`).catch(() => ({ default: {} })),
            import(`~/i18n/locales/docs/${lang}/getting-started.json`).catch(() => ({ default: {} })),
            import(`~/i18n/locales/docs/${lang}/configuration.json`).catch(() => ({ default: {} })),
          ];
          
          const [componentResults, docsResults] = await Promise.all([
            Promise.all(componentPromises),
            Promise.all(docsPromises)
          ]);
          
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
          
          // 合并docs文件
          docsResults.forEach(module => {
            if (module.default) {
              Object.assign(mergedTranslation, module.default);
            }
          });
          
          // 如果有翻译内容，设置到messages中
          if (Object.keys(mergedTranslation).length > 0) {
            messages.value[lang] = mergedTranslation;
            console.log(`${lang}翻译已手动加载，包含${Object.keys(mergedTranslation).length}个顶级键`);
            return mergedTranslation;
          } else {
            console.warn(`${lang}翻译为空`);
            return {};
          }
        } catch (error) {
          console.error(`加载${lang}翻译失败:`, error);
          throw error;
        } finally {
          // 无论成功失败，都从缓存中移除
          loadingCache.delete(lang);
        }
      })();
      
      // 缓存加载promise
      loadingCache.set(lang, loadingPromise);
      
      // 等待加载完成并返回结果
      return loadingPromise;
    };
    
    // 为了兼容性，保留单独加载组件翻译的函数
    const loadComponentTranslation = async (lang: string, component: string) => {
      // 直接调用整体加载函数
      return await preloadTranslations(lang);
    };
    
    // 为了兼容性，提供preloadBaseTranslations函数
    const preloadBaseTranslations = async (lang: string) => {
      return await preloadTranslations(lang);
    };
    
    // 启动时预加载所有翻译
    const supportedLocales = ['en', 'zh'];
    await Promise.all(supportedLocales.map(lang => preloadTranslations(lang)));
    
    // 提供全局方法用于加载翻译
    return {
      provide: {
        preloadTranslations,
        preloadBaseTranslations,
        loadComponentTranslation
      }
    };
  });