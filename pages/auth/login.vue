<template>
  <div class="min-h-screen flex items-center justify-center px-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-10">
        <NuxtLink to="/" class="inline-flex items-center gap-2 mb-8">
          <span class="font-display text-2xl text-ash">KanjiMe</span>
          <span class="font-display text-2xl text-gold">漢字</span>
        </NuxtLink>
        <h1 class="font-display text-4xl text-ash font-semibold mb-2">Masuk</h1>
        <p class="text-ash-muted text-sm">Lanjutkan perjalanan belajarmu</p>
      </div>

      <div class="border border-gold/20 p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="font-mono text-xs text-gold tracking-widest uppercase block mb-2">Email</label>
            <input v-model="email" type="email" required
              class="w-full bg-ink-soft border border-gold/20 focus:border-gold px-4 py-3 text-ash text-sm outline-none transition-colors font-mono"
              placeholder="nama@email.com"/>
          </div>
          <div>
            <label class="font-mono text-xs text-gold tracking-widest uppercase block mb-2">Password</label>
            <input v-model="password" type="password" required
              class="w-full bg-ink-soft border border-gold/20 focus:border-gold px-4 py-3 text-ash text-sm outline-none transition-colors font-mono"
              placeholder="••••••••"/>
          </div>
          <p v-if="error" class="text-red-400 text-xs font-mono">{{ error }}</p>
          <button type="submit" :disabled="loading"
            class="w-full py-3 bg-gold text-ink font-mono text-sm tracking-widest hover:bg-gold-light transition-all disabled:opacity-50">
            {{ loading ? 'Memuat...' : 'Masuk' }}
          </button>
        </form>
        <p class="text-center text-ash-muted text-sm mt-6">
          Belum punya akun?
          <NuxtLink to="/auth/register" class="text-gold hover:underline">Daftar gratis</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
  if (err) { error.value = err.message; loading.value = false; return }
  router.push('/dashboard')
}
</script>
