<template>
  <div class="min-h-screen px-6 py-24">
    <div class="max-w-2xl mx-auto">

      <NuxtLink to="/dashboard"
        class="inline-flex items-center gap-2 font-mono text-xs text-ash-muted hover:text-gold transition-colors mb-8">
        ← Kembali ke Dashboard
      </NuxtLink>

      <div v-if="loading" class="text-center py-20">
        <div class="font-mono text-gold text-xs tracking-widest animate-pulse">Memuat quiz...</div>
      </div>

      <div v-else-if="onCooldown" class="text-center py-20">
        <div class="font-mono text-gold text-xs tracking-widest mb-4">COOLDOWN</div>
        <div class="font-display text-6xl text-ash font-semibold mb-2">{{ cooldownDisplay }}</div>
        <p class="text-ash-muted text-sm mb-8">Tunggu sebelum bisa mengulang quiz.</p>
        <NuxtLink to="/dashboard" class="px-6 py-3 border border-gold/30 text-ash font-mono text-sm tracking-widest hover:border-gold transition-all">
          KEMBALI KE DASHBOARD
        </NuxtLink>
      </div>

      <div v-else-if="!quiz" class="text-center py-20">
        <div class="font-mono text-red-400 text-xs tracking-widest mb-4">QUIZ TIDAK DITEMUKAN</div>
        <NuxtLink to="/dashboard" class="px-6 py-3 border border-gold/30 text-ash font-mono text-sm tracking-widest">
          KEMBALI
        </NuxtLink>
      </div>

      <div v-else-if="!submitted">
        <div class="mb-6">
          <p class="font-mono text-gold text-xs tracking-widest uppercase mb-2">QUIZ</p>
          <h1 class="font-display text-3xl text-ash font-semibold mb-3">{{ quiz.title }}</h1>
          <div class="flex items-center justify-between font-mono text-xs text-ash-muted">
            <span>{{ currentIndex + 1 }} / {{ questions.length }} soal</span>
            <span :class="timeLeft <= 60 ? 'text-red-400 font-bold' : 'text-gold'">{{ timerDisplay }}</span>
          </div>
        </div>

        <div class="h-1 bg-ink-muted mb-8">
          <div class="h-1 bg-gold transition-all" :style="`width: ${((currentIndex + 1) / questions.length) * 100}%`"></div>
        </div>

        <div v-if="currentQuestion" class="mb-8">
          <p class="text-ash text-lg mb-2 leading-relaxed">{{ currentQuestion.question_text }}</p>
          <p v-if="currentQuestion.question_jp" class="text-gold font-display text-xl italic mb-6">{{ currentQuestion.question_jp }}</p>

          <div v-if="currentQuestion.question_type === 'mcq'" class="space-y-3">
            <button v-for="(opt, i) in parseOptions(currentQuestion.options)" :key="i"
              @click="selectAnswer(opt)"
              :class="['w-full text-left px-5 py-4 border font-mono text-sm transition-all',
                answers[currentQuestion.id] === opt
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-gold/20 text-ash-muted hover:border-gold/50']">
              <span class="text-gold mr-3">{{ String.fromCharCode(65 + i) }}.</span>{{ opt }}
            </button>
          </div>

          <div v-else>
            <input v-model="fillAnswer" @keyup.enter="nextQuestion"
              class="w-full bg-ink-soft border border-gold/20 focus:border-gold px-4 py-3 text-ash text-lg outline-none font-mono text-center tracking-widest"
              placeholder="Ketik jawaban..."/>
          </div>
        </div>

        <div class="flex justify-between gap-4">
          <button v-if="currentIndex > 0" @click="prevQuestion"
            class="px-6 py-3 border border-gold/20 text-ash-muted font-mono text-sm tracking-widest hover:border-gold transition-all">
            ← SEBELUMNYA
          </button>
          <div v-else></div>
          <button v-if="currentIndex < questions.length - 1" @click="nextQuestion"
            class="px-6 py-3 bg-gold text-ink font-mono text-sm tracking-widest hover:bg-gold-light transition-all">
            BERIKUTNYA →
          </button>
          <button v-else @click="submitQuiz"
            class="px-6 py-3 bg-gold text-ink font-mono text-sm tracking-widest hover:bg-gold-light transition-all">
            KUMPULKAN
          </button>
        </div>
      </div>

      <div v-else-if="result" class="text-center py-10">
        <div class="font-mono text-gold text-xs tracking-widest mb-4">HASIL QUIZ</div>
        <div class="font-display text-7xl text-ash font-semibold mb-1">{{ result.score }}</div>
        <div class="font-mono text-ash-muted text-sm mb-6">/ 100</div>
        <div :class="['font-mono text-xs tracking-widest mb-6 px-6 py-2 inline-block',
          result.passed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30']">
          {{ result.passed ? 'LULUS' : 'TIDAK LULUS' }}
        </div>
        <div v-if="result.grade" class="font-display text-4xl text-gold font-semibold mb-8">Grade {{ result.grade }}</div>
        <div v-if="!result.passed" class="border border-gold/20 p-4 mb-6 font-mono text-sm text-ash-muted">
          Bisa mengulang dalam <span class="text-gold">3 menit</span>.
        </div>
        <div class="flex gap-4 justify-center flex-wrap">
          <NuxtLink to="/dashboard" class="px-6 py-3 border border-gold/30 text-ash font-mono text-sm tracking-widest hover:border-gold transition-all">
            DASHBOARD
          </NuxtLink>
          <NuxtLink v-if="result.eligible_for_cert" to="/dashboard/certificates"
            class="px-6 py-3 bg-gold text-ink font-mono text-sm tracking-widest hover:bg-gold-light transition-all">
            KLAIM SERTIFIKAT
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const config = useRuntimeConfig()

const quiz = ref<any>(null)
const questions = ref<any[]>([])
const loading = ref(true)
const submitted = ref(false)
const result = ref<any>(null)
const currentIndex = ref(0)
const answers = ref<Record<string, string>>({})
const fillAnswer = ref('')
const startedAt = ref(new Date())
const timeLeft = ref(0)
const onCooldown = ref(false)
const cooldownLeft = ref(0)
let timerInterval: any = null
let cooldownInterval: any = null

const timerDisplay = computed(() => {
  const m = Math.floor(timeLeft.value / 60)
  const s = timeLeft.value % 60
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
})

const cooldownDisplay = computed(() => {
  const m = Math.floor(cooldownLeft.value / 60)
  const s = cooldownLeft.value % 60
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
})

const currentQuestion = computed(() => questions.value[currentIndex.value])

function parseOptions(opts: any): string[] {
  if (!opts) return []
  if (Array.isArray(opts)) return opts
  try { return JSON.parse(opts) } catch { return [] }
}

onMounted(async () => {
  const cooldownKey = `quiz_cooldown_${route.params.id}`
  const cooldownEnd = localStorage.getItem(cooldownKey)
  if (cooldownEnd) {
    const remaining = Math.floor((parseInt(cooldownEnd) - Date.now()) / 1000)
    if (remaining > 0) {
      onCooldown.value = true
      cooldownLeft.value = remaining
      cooldownInterval = setInterval(() => {
        cooldownLeft.value--
        if (cooldownLeft.value <= 0) {
          onCooldown.value = false
          clearInterval(cooldownInterval)
          localStorage.removeItem(cooldownKey)
        }
      }, 1000)
      loading.value = false
      return
    }
  }

  const { data: quizData, error: quizErr } = await supabase
    .from('quizzes').select('*').eq('id', route.params.id).single()
  
  if (quizErr || !quizData) {
    loading.value = false
    return
  }

  const { data: questionsData } = await supabase
    .from('questions').select('*').eq('quiz_id', route.params.id).order('order_num')

  quiz.value = quizData
  questions.value = questionsData || []
  timeLeft.value = (questionsData?.length || 10) * 60
  startTimer()
  loading.value = false
})

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval)
      submitQuiz()
    }
  }, 1000)
}

function selectAnswer(opt: string) {
  if (currentQuestion.value) answers.value[currentQuestion.value.id] = opt
}

function nextQuestion() {
  if (currentQuestion.value?.question_type === 'fill' && fillAnswer.value.trim()) {
    answers.value[currentQuestion.value.id] = fillAnswer.value.trim()
    fillAnswer.value = ''
  }
  if (currentIndex.value < questions.value.length - 1) currentIndex.value++
}

function prevQuestion() { currentIndex.value-- }

async function submitQuiz() {
  clearInterval(timerInterval)
  if (!user.value) return

  if (currentQuestion.value?.question_type === 'fill' && fillAnswer.value.trim()) {
    answers.value[currentQuestion.value.id] = fillAnswer.value.trim()
  }

  try {
    const { data: session } = await supabase.auth.getSession()
    const token = session?.session?.access_token

    const res = await $fetch(`${config.public.backendUrl}/api/quiz/submit`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: {
        user_id: user.value.id,
        quiz_id: route.params.id,
        answers: Object.entries(answers.value).map(([question_id, answer]) => ({ question_id, answer })),
        started_at: startedAt.value.toISOString(),
        tab_switches: 0,
        fullscreen_exits: 0,
      }
    }) as any
    result.value = res
    submitted.value = true

    if (!res.passed) {
      localStorage.setItem(`quiz_cooldown_${route.params.id}`, String(Date.now() + 3 * 60 * 1000))
    }
  } catch (e) {
    alert("Error: " + JSON.stringify(e))
  }
}

onUnmounted(() => {
  clearInterval(timerInterval)
  clearInterval(cooldownInterval)
})
</script>
