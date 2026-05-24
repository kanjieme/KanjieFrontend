<template>
  <div class="min-h-screen flex items-center justify-center px-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-10">
        <NuxtLink to="/" class="inline-flex items-center gap-2 mb-8">
          <span class="font-display text-2xl text-ash">KanjiMe</span>
          <span class="font-display text-2xl text-gold">漢字</span>
        </NuxtLink>
        <h1 class="font-display text-4xl text-ash font-semibold mb-2">Reset Password</h1>
        <p class="text-ash-muted text-sm">Masukkan password baru kamu.</p>
      </div>
      <div class="border border-gold/20 p-8">
        <form v-if="!done" @submit.prevent="handleUpdate" class="space-y-5">
          <div>
            <label class="font-mono text-xs text-gold tracking-widest uppercase block mb-2">Password Baru</label>
            <input v-model="password" type="password" required minlength="8"
              class="w-full bg-ink-soft border border-gold/20 focus:border-gold px-4 py-3 text-ash text-sm outline-none transition-colors font-mono"
              placeholder="Min. 8 karakter"/>
          </div>
          <div>
            <label class="font-mono text-xs text-gold tracking-widest uppercase block mb-2">Konfirmasi Password</label>
            <input v-model="confirm" type="password" required
              class="w-full bg-ink-soft border border-gold/20 focus:border-gold px-4 py-3 text-ash text-sm outline-none transition-colors font-mono"
              placeholder="Ulangi password"/>
          </div>
          <p v-if="error" class="text-red-400 text-xs font-mono">{{ error }}</p>
          <button type="submit" :disabled="loading"
            class="w-full py-3 bg-gold text-ink font-mono text-sm tracking-widest hover:bg-gold-light transition-all disabled:opacity-50">
            {{ loading ? 'Menyimpan...' : 'Simpan Password Baru' }}
          </button>
        </form>
        <div v-else class="text-center py-4">
          <div class="text-gold font-mono text-xs tracking-widest mb-3">PASSWORD DIPERBARUI</div>
          <p class="text-ash-muted text-sm mb-4">Password kamu berhasil diubah.</p>
          <NuxtLink to="/auth/login"
            class="inline-block px-6 py-2 bg-gold text-ink font-mono text-sm tracking-widest hover:bg-gold-light transition-all">
            Masuk Sekarang
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
const supabase = useSupabaseClient()
const password = ref('')
const confirm = ref('')
const error = ref('')
const loading = ref(false)
const done = ref(false)

async function handleUpdate() {
  if (password.value !== confirm.value) {
    error.value = 'Password tidak cocok'
    return
  }
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.updateUser({ password: password.value })
  if (err) { error.value = err.message; loading.value = false; return }
  done.value = true
  loading.value = false
}
</script>
