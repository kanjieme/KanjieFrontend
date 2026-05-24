export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/verify']
  
  if (publicRoutes.some(route => to.path.startsWith(route))) return
  
  if (!user.value) return navigateTo('/auth/login')
})
