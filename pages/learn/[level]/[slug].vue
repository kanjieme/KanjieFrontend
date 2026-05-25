<template>
  <div class="min-h-screen px-6 py-24">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center gap-2 font-mono text-xs text-ash-muted mb-8">
        <NuxtLink to="/" class="hover:text-gold transition-colors">Home</NuxtLink>
        <span>→</span>
        <NuxtLink :to="`/learn/${levelCode.toLowerCase()}`" class="hover:text-gold transition-colors">JLPT {{ levelCode }}</NuxtLink>
        <span>→</span>
        <span class="text-gold">{{ lesson?.title }}</span>
      </div>
      <div v-if="loading" class="text-ash-muted font-mono text-sm">Memuat lesson...</div>
      <div v-else-if="lesson">
        <div class="mb-8">
          <p class="font-mono text-gold text-xs tracking-widest uppercase mb-2">{{ module?.title }}</p>
          <h1 class="font-display text-4xl text-ash font-semibold">{{ lesson.title }}</h1>
        </div>
        <div class="text-ash-muted leading-relaxed space-y-4 mb-12" v-html="renderedContent"></div>
        <div class="flex justify-between pt-8 border-t border-gold/10">
          <button @click="markComplete" :disabled="completed"
            :class="['px-6 py-3 font-mono text-sm tracking-widest transition-all',
              completed ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed' : 'bg-gold text-ink hover:bg-gold-light']">
            {{ completed ? 'SELESAI ✓' : 'TANDAI SELESAI' }}
          </button>
          <NuxtLink v-if="nextLesson" :to="`/learn/${levelCode.toLowerCase()}/${nextLesson.slug}`"
            class="px-6 py-3 border border-gold/30 text-ash font-mono text-sm tracking-widest hover:border-gold transition-all">
            BERIKUTNYA →
          </NuxtLink>
        </div>
      </div>
      <div v-else class="text-ash-muted font-mono text-sm">Lesson tidak ditemukan.</div>
    </div>
  </div>
</template>

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
  return md
    .replace(/^# (.*)/gm, '<h1 class="font-display text-3xl text-ash font-semibold mt-8 mb-4">$1</h1>')
    .replace(/^## (.*)/gm, '<h2 class="font-display text-2xl text-ash font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^### (.*)/gm, '<h3 class="font-display text-xl text-ash mt-4 mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-ash font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-gold">$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-ink-soft text-gold px-1.5 py-0.5 font-mono text-sm">$1</code>')
    .replace(/^\| (.*) \|$/gm, (_, row) => {
      const cells = row.split(' | ').map((c: string) =>
        `<td class="px-4 py-2 border border-gold/10 text-ash-muted text-sm">${c}</td>`).join('')
      return `<tr>${cells}</tr>`
    })
    .replace(/(<tr>.*?<\/tr>\n?)+/gs, rows => `<table class="w-full border-collapse my-4">${rows}</table>`)
    .replace(/^---$/gm, '<hr class="border-gold/20 my-6"/>')
    .replace(/\n\n/g, '<br/><br/>')
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
