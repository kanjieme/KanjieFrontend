<template>
  <div class="min-h-screen flex items-center justify-center px-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-10">
        <NuxtLink to="/" class="inline-flex items-center gap-2 mb-8">
          <span class="font-display text-2xl text-ash">KanjiMe</span>
          <span class="font-display text-2xl text-gold">漢字</span>
        </NuxtLink>
        <h1 class="font-display text-4xl text-ash font-semibold mb-2">Lupa Password</h1>
        <p class="text-ash-muted text-sm">Masukkan email kamu, kami kirim link reset.</p>
      </div>
      <div class="border border-gold/20 p-8">
        <form v-if="!sent" @submit.prevent="handleReset" class="space-y-5">
          <div>
            <label class="font-mono text-xs text-gold tracking-widest uppercase block mb-2">Email</label>
            <input v-model="email" type="email" required
              class="w-full bg-ink-soft border border-gold/20 focus:border-gold px-4 py-3 text-ash text-sm outline-none transition-colors font-mono"
              placeholder="nama@email.com"/>
          </div>
          <p v-if="error" class="text-red-400 text-xs font-mono">{{ error }}</p>
          <button type="submit" :disabled="loading"
            class="w-full py-3 bg-gold text-ink font-mono text-sm tracking-widest hover:bg-gold-light transition-all disabled:opacity-50">
            {{ loading ? 'Mengirim...' : 'Kirim Link Reset' }}
          </button>
        </form>
        <div v-else class="text-center py-4">
          <div class="text-gold font-mono text-xs tracking-widest mb-3">EMAIL TERKIRIM</div>
          <p class="text-ash-muted text-sm">Cek inbox kamu dan klik link reset password.</p>
        </div>
        <p class="text-center text-ash-muted text-sm mt-6">
          Ingat password?
          <NuxtLink to="/auth/login" class="text-gold hover:underline">Masuk</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
const supabase = useSupabaseClient()
const email = ref('')
const error = ref('')
const loading = ref(false)
const sent = ref(false)

async function handleReset() {
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: 'https://kanjime.vercel.app/auth/reset-password'
  })
  if (err) { error.value = err.message; loading.value = false; return }
  sent.value = true
  loading.value = false
}
</script>
