// 引用nuxt-site-config模块
export default defineNuxtPlugin(() => {
  // 这个插件主要是确保nuxt-site-config模块被正确加载
  // 模块会自动生成robots.txt和sitemap.xml
  
  const config = useRuntimeConfig();
  
  // 记录robots.txt和sitemap.xml的主机名配置
  console.log('Site config plugin loaded - robots.txt and sitemap.xml will be generated');
  console.log(`Using host for robots.txt and sitemap: ${config.public.RobotsHost || config.public.SiteUrl || 'https://yourdomain.com'}`);
  
  return {
    provide: {
      siteConfig: {
        robotsHost: config.public.RobotsHost || config.public.SiteUrl || 'https://yourdomain.com'
      }
    }
  };
}); 