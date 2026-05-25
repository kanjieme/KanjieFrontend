<template>
  <div class="min-h-screen px-6 py-24">
    <div class="max-w-3xl mx-auto">
      <!-- Back button -->
      <NuxtLink :to="`/learn/${levelCode.toLowerCase()}`"
        class="inline-flex items-center gap-2 font-mono text-xs text-ash-muted hover:text-gold transition-colors mb-8">
        ← Kembali ke JLPT {{ levelCode }}
      </NuxtLink>

      <div v-if="mod" class="mb-10">
        <p class="font-mono text-gold text-xs tracking-widest uppercase mb-2">{{ levelCode }} — {{ mod.tier }}</p>
        <h1 class="font-display text-4xl text-ash font-semibold mb-3">{{ mod.title }}</h1>
        <p class="text-ash-muted">{{ mod.description }}</p>
      </div>

      <div class="space-y-3">
        <NuxtLink v-for="(lesson, i) in lessons" :key="lesson.id"
          :to="`/learn/${levelCode.toLowerCase()}/${lesson.slug}`"
          class="flex items-center gap-4 p-4 border border-gold/20 hover:border-gold/60 transition-all group">
          <div class="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-gold/30 font-mono text-xs text-ash-muted group-hover:border-gold group-hover:text-gold transition-all">
            {{ String(i + 1).padStart(2, '0') }}
          </div>
          <div class="flex-1 font-display text-lg text-ash">{{ lesson.title }}</div>
          <span class="font-mono text-xs text-gold opacity-0 group-hover:opacity-100 transition-all">BUKA →</span>
        </NuxtLink>
      </div>

      <!-- Quiz modul -->
      <div v-if="quiz" class="mt-8 border border-gold/40 bg-gold/5 p-5">
        <div class="flex items-center justify-between gap-4">
          <div>
            <div class="font-mono text-gold text-xs tracking-widest mb-1">QUIZ MODUL</div>
            <div class="font-display text-lg text-ash">{{ quiz.title }}</div>
            <div class="text-ash-muted text-sm mt-1">{{ quiz.time_limit_minutes }} menit · Passing score {{ quiz.passing_score }}</div>
          </div>
          <NuxtLink :to="`/quiz/${quiz.id}`"
            class="px-5 py-2 bg-gold text-ink font-mono text-xs tracking-widest hover:bg-gold-light transition-all flex-shrink-0">
            MULAI QUIZ
          </NuxtLink>
        </div>
      </div>

      <!-- Back to level -->
      <div class="mt-8">
        <NuxtLink :to="`/learn/${levelCode.toLowerCase()}`"
          class="inline-flex items-center gap-2 font-mono text-xs text-ash-muted hover:text-gold transition-colors">
          ← Kembali ke semua modul JLPT {{ levelCode }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const levelCode = computed(() => (route.params.level as string).toUpperCase())
const moduleSlug = computed(() => route.params.moduleSlug as string)
const supabase = useSupabaseClient()
const mod = ref<any>(null)
const lessons = ref<any[]>([])
const quiz = ref<any>(null)

onMounted(async () => {
  const { data: modData } = await supabase.from('modules').select('*').eq('slug', moduleSlug.value).single()
  mod.value = modData
  if (modData) {
    const { data: lessonData } = await supabase.from('lessons').select('*').eq('module_id', modData.id).order('order_num')
    lessons.value = lessonData || []
    const { data: quizData } = await supabase.from('quizzes').select('*').eq('module_id', modData.id).single()
    quiz.value = quizData
  }
})
</script>
