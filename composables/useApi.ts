export function useApi() {
  const config = useRuntimeConfig()
  const supabase = useSupabaseClient()

  async function getAuthHeaders() {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async function post(path: string, body: any) {
    const headers = await getAuthHeaders()
    return $fetch(`${config.public.backendUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body,
    })
  }

  async function get(path: string) {
    const headers = await getAuthHeaders()
    return $fetch(`${config.public.backendUrl}${path}`, { headers })
  }

  return { post, get }
}
