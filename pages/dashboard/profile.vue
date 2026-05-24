<template>
  <div>
    <div class="mb-10">
      <p class="font-mono text-gold text-xs tracking-widest uppercase mb-1">Profil</p>
      <h1 class="font-display text-4xl text-ash font-semibold">Profil Saya</h1>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Profile form -->
      <div class="border border-gold/20 p-6">
        <h2 class="font-mono text-xs text-gold tracking-widest uppercase mb-6">Data Diri</h2>
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div>
            <label class="font-mono text-xs text-gold tracking-widest uppercase block mb-2">Nama Lengkap</label>
            <input v-model="fullName" type="text"
              class="w-full bg-ink-soft border border-gold/20 focus:border-gold px-4 py-3 text-ash text-sm outline-none transition-colors font-mono"/>
          </div>
          <div>
            <label class="font-mono text-xs text-gold tracking-widest uppercase block mb-2">Email</label>
            <input :value="user?.email" disabled
              class="w-full bg-ink-muted border border-gold/10 px-4 py-3 text-ash-muted text-sm font-mono cursor-not-allowed"/>
          </div>
          <div>
            <label class="font-mono text-xs text-gold tracking-widest uppercase block mb-2">Telegram Username</label>
            <input v-model="telegramUsername" type="text"
              class="w-full bg-ink-soft border border-gold/20 focus:border-gold px-4 py-3 text-ash text-sm outline-none transition-colors font-mono"
              placeholder="@username"/>
          </div>
          <p v-if="success" class="text-green-400 text-xs font-mono">{{ success }}</p>
          <p v-if="error" class="text-red-400 text-xs font-mono">{{ error }}</p>
          <button type="submit" :disabled="loading"
            class="w-full py-3 bg-gold text-ink font-mono text-sm tracking-widest hover:bg-gold-light transition-all disabled:opacity-50">
            {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </form>
      </div>

      <!-- Account info -->
      <div class="border border-gold/20 p-6">
        <h2 class="font-mono text-xs text-gold tracking-widest uppercase mb-6">Akun</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center py-3 border-b border-gold/10">
            <span class="font-mono text-xs text-ash-muted uppercase tracking-widest">Member sejak</span>
            <span class="font-mono text-xs text-ash">{{ joinDate }}</span>
          </div>
          <div class="flex justify-between items-center py-3 border-b border-gold/10">
            <span class="font-mono text-xs text-ash-muted uppercase tracking-widest">Status</span>
            <span class="font-mono text-xs text-green-400">Aktif</span>
          </div>
        </div>
        <button @click="logout"
          class="w-full mt-6 py-3 border border-red-500/30 text-red-400 font-mono text-sm tracking-widest hover:bg-red-500/10 transition-all">
          Keluar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const supabase = useSupabaseClient()
const router = useRouter()
const user = useSupabaseUser()
const fullName = ref('')
const telegramUsername = ref('')
const success = ref('')
const error = ref('')
const loading = ref(false)

const joinDate = computed(() => {
  if (!user.value?.created_at) return '-'
  return new Date(user.value.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
})

onMounted(async () => {
  if (!user.value) return
  const { data } = await supabase.from('profiles').select('*').eq('id', user.value.id).single()
  if (data) {
    fullName.value = data.full_name || ''
    telegramUsername.value = data.telegram_username || ''
  }
})

async function updateProfile() {
  if (!user.value) return
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.from('profiles').upsert({
    id: user.value.id,
    full_name: fullName.value,
    telegram_username: telegramUsername.value,
    email: user.value.email,
  })
  if (err) { error.value = err.message } else { success.value = 'Profil berhasil diperbarui!' }
  loading.value = false
}

async function logout() {
  await supabase.auth.signOut()
  router.push('/')
}
</script>
