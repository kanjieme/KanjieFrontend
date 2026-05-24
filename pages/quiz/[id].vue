<template>
  <div class="min-h-screen px-6 py-24">
    <div class="max-w-2xl mx-auto">
      <!-- Loading -->
      <div v-if="loading" class="text-ash-muted font-mono text-sm text-center">Memuat quiz...</div>

      <!-- Quiz -->
      <div v-else-if="quiz && !submitted">
        <div class="mb-8">
          <p class="font-mono text-gold text-xs tracking-widest uppercase mb-2">Quiz</p>
          <h1 class="font-display text-3xl text-ash font-semibold">{{ quiz.title }}</h1>
          <div class="flex items-center gap-4 mt-3 font-mono text-xs text-ash-muted">
            <span>{{ currentIndex + 1 }} / {{ questions.length }} soal</span>
            <span v-if="quiz.time_limit_minutes" class="text-gold">{{ timeLeft }} menit tersisa</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="h-1 bg-ink-muted mb-8">
          <div class="h-1 bg-gold transition-all" :style="`width: ${((currentIndex + 1) / questions.length) * 100}%`"></div>
        </div>

        <!-- Question -->
        <div v-if="currentQuestion" class="mb-8">
          <p class="text-ash text-lg mb-2 leading-relaxed">{{ currentQuestion.question_text }}</p>
          <p v-if="currentQuestion.question_jp" class="text-gold font-display text-xl italic mb-6">
            {{ currentQuestion.question_jp }}
          </p>

          <!-- MCQ -->
          <div v-if="currentQuestion.question_type === 'mcq'" class="space-y-3">
            <button v-for="(opt, i) in currentQuestion.options" :key="i"
              @click="selectAnswer(opt)"
              :class="['w-full text-left px-5 py-4 border font-mono text-sm transition-all quiz-option',
                answers[currentQuestion.id] === opt ? 'selected' : 'border-gold/20 text-ash-muted']">
              <span class="text-gold mr-3">{{ String.fromCharCode(65 + i) }}.</span>{{ opt }}
            </button>
          </div>

          <!-- Fill in the blank -->
          <div v-else-if="currentQuestion.question_type === 'fill'">
            <input v-model="fillAnswer"
              @keyup.enter="submitFill"
              class="w-full bg-ink-soft border border-gold/20 focus:border-gold px-4 py-3 text-ash text-lg outline-none font-mono text-center tracking-widest"
              placeholder="Ketik jawaban..."/>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between">
          <button v-if="currentIndex > 0" @click="prevQuestion"
            class="px-6 py-3 border border-gold/20 text-ash-muted font-mono text-sm tracking-widest hover:border-gold transition-all">
            ← SEBELUMNYA
          </button>
          <div v-else></div>
          <button v-if="currentIndex < questions.length - 1" @click="nextQuestion"
            :disabled="!answers[currentQuestion?.id]"
            class="px-6 py-3 bg-gold text-ink font-mono text-sm tracking-widest hover:bg-gold-light transition-all disabled:opacity-30">
            BERIKUTNYA →
          </button>
          <button v-else @click="submitQuiz"
            :disabled="!answers[currentQuestion?.id]"
            class="px-6 py-3 bg-gold text-ink font-mono text-sm tracking-widest hover:bg-gold-light transition-all disabled:opacity-30">
            KUMPULKAN
          </button>
        </div>
      </div>

      <!-- Result -->
      <div v-else-if="submitted && result" class="text-center">
        <div class="font-display text-6xl text-gold font-semibold mb-2">{{ result.score }}</div>
        <div class="font-mono text-ash-muted text-sm mb-6">/ 100</div>
        <div :class="['font-mono text-xs tracking-widest mb-8 px-4 py-2 inline-block',
          result.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400']">
          {{ result.passed ? 'LULUS' : 'TIDAK LULUS' }}
        </div>
        <div v-if="result.grade" class="font-display text-4xl text-ash font-semibold mb-8">
          Grade {{ result.grade }}
        </div>
        <div class="flex gap-4 justify-center">
          <NuxtLink to="/dashboard"
            class="px-6 py-3 border border-gold/30 text-ash font-mono text-sm tracking-widest hover:border-gold transition-all">
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
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const { post } = useApi()

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

const currentQuestion = computed(() => questions.value[currentIndex.value])

onMounted(async () => {
  const { data: quizData } = await supabase.from('quizzes').select('*').eq('id', route.params.id).single()
  const { data: questionsData } = await supabase.from('questions').select('*').eq('quiz_id', route.params.id).order('order_num')
  quiz.value = quizData
  questions.value = questionsData || []
  if (quizData?.time_limit_minutes) timeLeft.value = quizData.time_limit_minutes
  loading.value = false
})

function selectAnswer(opt: string) {
  if (currentQuestion.value) answers.value[currentQuestion.value.id] = opt
}

function submitFill() {
  if (currentQuestion.value && fillAnswer.value.trim()) {
    answers.value[currentQuestion.value.id] = fillAnswer.value.trim()
    fillAnswer.value = ''
    if (currentIndex.value < questions.value.length - 1) currentIndex.value++
  }
}

function nextQuestion() {
  if (currentQuestion.value?.question_type === 'fill' && fillAnswer.value.trim()) {
    answers.value[currentQuestion.value.id] = fillAnswer.value.trim()
    fillAnswer.value = ''
  }
  currentIndex.value++
}

function prevQuestion() {
  currentIndex.value--
}

async function submitQuiz() {
  if (!user.value) return
  if (currentQuestion.value?.question_type === 'fill' && fillAnswer.value.trim()) {
    answers.value[currentQuestion.value.id] = fillAnswer.value.trim()
  }
  const payload = {
    user_id: user.value.id,
    quiz_id: route.params.id,
    answers: Object.entries(answers.value).map(([question_id, answer]) => ({ question_id, answer })),
    started_at: startedAt.value.toISOString(),
    tab_switches: 0,
    fullscreen_exits: 0,
  }
  try {
    const res = await post('/api/quiz/submit', payload) as any
    result.value = res
    submitted.value = true
  } catch (e) {
    console.error(e)
  }
}
</script>
