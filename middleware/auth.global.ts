import {
  DEFAULT_LOGGED_IN_REDIRECT,
  apiAuthPrefix,
  guestOnlyRoutes,
  publicRoutes,
} from "~/routes";

export default defineNuxtRouteMiddleware((to, _from) => {
  const { status: authStatus } = useAuth();
  const isLoggedIn = authStatus.value === "authenticated";
  const isApiAuthRoute = to.path.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.some((route) =>
    route === "/" ? to.path === route : to.path.startsWith(route)
  );
  const isGuestRoute = guestOnlyRoutes.includes(to.path);

  // 检查是否是定价页面、文档页面或主页
  const isPublicPage = 
    to.path === "/pricing" || 
    to.path === "/" || 
    to.path === "/zh/pricing" || 
    to.path === "/zh" ||
    to.path === "/docs" ||
    to.path === "/zh/docs" ||
    to.path.startsWith("/docs/") ||
    to.path.startsWith("/zh/docs/");

  // Vérifier si la route existe
  const routeExists = to.matched.length > 0;

  // Allow access to API authentication routes
  if (isApiAuthRoute) return;

  // Si la route n'existe pas, laisser Nuxt gérer l'erreur 404
  if (!routeExists) return;

  // Redirect logged-in users trying to access guest-only routes
  if (isGuestRoute && isLoggedIn) {
    return navigateTo(DEFAULT_LOGGED_IN_REDIRECT);
  }

  // 如果是公共页面（定价页面、文档页面或主页），允许未登录用户访问，不进行重定向
  if (isPublicPage) return;

  // Redirect to / if user is not authenticated and route is not public
  if (!isLoggedIn && !isPublicRoute) {
    return navigateTo("/");
  }

  // Let Nuxt handle the navigation
});
