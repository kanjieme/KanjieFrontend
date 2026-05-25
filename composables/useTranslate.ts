export function useTranslate() {
  const config = useRuntimeConfig()
  const translating = ref(false)

  async function translate(text: string, targetLang: string): Promise<string> {
    if (targetLang === 'en') return text
    translating.value = true
    try {
      const res = await $fetch(`${config.public.backendUrl}/api/ai/translate`, {
        method: 'POST',
        body: { text, target_lang: targetLang },
      }) as any
      return res.translated || text
    } catch {
      return text
    } finally {
      translating.value = false
    }
  }

  return { translate, translating }
}
