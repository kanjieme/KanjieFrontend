<template>
  <div class="min-h-screen px-6 py-24">
    <div class="max-w-3xl mx-auto">
      <!-- Back button -->
      <NuxtLink v-if="module" :to="`/learn/${levelCode.toLowerCase()}/module/${module.slug}`"
        class="inline-flex items-center gap-2 font-mono text-xs text-ash-muted hover:text-gold transition-colors mb-8">
        ← Kembali ke {{ module.title }}
      </NuxtLink>

      <div v-if="loading" class="text-ash-muted font-mono text-sm">Memuat lesson...</div>

      <div v-else-if="lesson">
        <p class="font-mono text-gold text-xs tracking-widest uppercase mb-2">{{ module?.title }}</p>
        <h1 class="font-display text-4xl text-ash font-semibold mb-8">{{ lesson.title }}</h1>
        <div class="lesson-content mb-12" v-html="renderedContent"></div>

        <div class="pt-8 border-t border-gold/10 flex justify-between items-center gap-4">
          <button @click="markComplete" :disabled="completed"
            :class="['px-6 py-3 font-mono text-sm tracking-widest transition-all',
              completed
                ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                : 'bg-gold text-ink hover:bg-gold-light']">
            {{ completed ? 'SELESAI ✓' : 'TANDAI SELESAI' }}
          </button>
          <NuxtLink v-if="nextLesson" :to="`/learn/${levelCode.toLowerCase()}/${nextLesson.slug}`"
            class="px-6 py-3 border border-gold text-gold font-mono text-sm tracking-widest hover:bg-gold hover:text-ink transition-all">
            LESSON BERIKUTNYA →
          </NuxtLink>
          <NuxtLink v-else :to="`/learn/${levelCode.toLowerCase()}/module/${module?.slug}`"
            class="px-6 py-3 border border-gold text-gold font-mono text-sm tracking-widest hover:bg-gold hover:text-ink transition-all">
            ← KEMBALI KE MODUL
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.lesson-content h1 { font-family: 'Cormorant Garamond',Georgia,serif; font-size:1.8rem; color:#f0ece4; font-weight:600; margin:2rem 0 1rem; }
.lesson-content h2 { font-family: 'Cormorant Garamond',Georgia,serif; font-size:1.4rem; color:#f0ece4; font-weight:600; margin:1.5rem 0 .75rem; }
.lesson-content h3 { font-family: 'Cormorant Garamond',Georgia,serif; font-size:1.2rem; color:#f0ece4; margin:1.2rem 0 .5rem; }
.lesson-content p { color:#d4cfc6; line-height:1.8; margin-bottom:1rem; }
.lesson-content strong { color:#f0ece4; font-weight:600; }
.lesson-content em { color:#c9a84c; }
.lesson-content code { background:#1c2040; color:#c9a84c; padding:2px 6px; font-family:'DM Mono',monospace; font-size:.85rem; }
.lesson-content hr { border-color:rgba(201,168,76,.2); margin:1.5rem 0; }
.lesson-content table { width:100%; border-collapse:collapse; margin:1rem 0; }
.lesson-content th { background:rgba(201,168,76,.1); color:#c9a84c; padding:.6rem 1rem; border:1px solid rgba(201,168,76,.2); font-family:'DM Mono',monospace; font-size:.8rem; text-align:left; }
.lesson-content td { color:#d4cfc6; padding:.6rem 1rem; border:1px solid rgba(201,168,76,.1); font-size:.9rem; }
.lesson-content blockquote { border-left:2px solid #c9a84c; padding-left:1rem; color:#8a8580; margin:1rem 0; }
</style>

<script setup lang="ts">
const route = useRoute()
const levelCode = computed(() => (route.params.level as string).toUpperCase())
const slug = computed(() => route.params.slug as string)
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const lesson = ref<any>(null)
const module = ref<any>(null)
const nextLesson = ref<any>(null)
const loading = ref(true)
const completed = ref(false)
const renderedContent = ref('')

function renderMarkdown(md: string): string {
  if (!md) return ''
  let html = md
  html = html.replace(/^### (.*)/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*)/gm, '<h2>$2</h2>'.replace('$2','$1'))
  html = html.replace(/^# (.*)/gm, '<h1>$1</h1>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/`(.*?)`/g, '<code>$1</code>')
  html = html.replace(/^---$/gm, '<hr/>')

  // Tables
  const lines = html.split('\n')
  const result: string[] = []
  let inTable = false
  let tableRows: string[] = []

  for (const line of lines) {
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (!inTable) { inTable = true; tableRows = [] }
      const cells = line.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1)
      const isSeparator = cells.every(c => /^[-: ]+$/.test(c))
      if (!isSeparator) {
        const isFirst = tableRows.length === 0
        const tag = isFirst ? 'th' : 'td'
        tableRows.push(`<tr>${cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('')}</tr>`)
      }
    } else {
      if (inTable) {
        result.push(`<table>${tableRows.join('')}</table>`)
        inTable = false
        tableRows = []
      }
      result.push(line)
    }
  }
  if (inTable) result.push(`<table>${tableRows.join('')}</table>`)
  html = result.join('\n')
  html = html.replace(/\n\n/g, '</p><p>')
  html = html.replace(/^(?!<)(.+)$/gm, '<p>$1</p>')
  return html
}

onMounted(async () => {
  const { data } = await supabase
    .from('lessons')
    .select('*, modules!inner(*, levels!inner(code))')
    .eq('slug', slug.value)
    .eq('modules.levels.code', levelCode.value)
    .single()

  if (data) {
    lesson.value = data
    module.value = data.modules
    renderedContent.value = renderMarkdown(data.content_md || '')

    const { data: next } = await supabase
      .from('lessons')
      .select('slug, title')
      .eq('module_id', data.module_id)
      .gt('order_num', data.order_num)
      .order('order_num')
      .limit(1)
      .single()
    nextLesson.value = next

    if (user.value) {
      const { data: progress } = await supabase
        .from('lesson_progress')
        .select('status')
        .eq('user_id', user.value.id)
        .eq('lesson_id', data.id)
        .single()
      completed.value = progress?.status === 'completed'
    }
  }
  loading.value = false
})

async function markComplete() {
  if (!user.value || !lesson.value || completed.value) return
  await supabase.from('lesson_progress').upsert({
    user_id: user.value.id,
    lesson_id: lesson.value.id,
    status: 'completed',
    completed_at: new Date().toISOString(),
  })
  completed.value = true
}
</script>
