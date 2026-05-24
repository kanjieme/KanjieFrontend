<template>
  <div class="min-h-screen flex items-center justify-center px-6">
    <div class="w-full max-w-lg text-center">
      <p class="font-mono text-gold text-xs tracking-widest uppercase mb-4">Verifikasi</p>
      <h1 class="font-display text-4xl text-ash font-semibold mb-8">Cek Keaslian Sertifikat</h1>
      <div class="border border-gold/20 p-8">
        <input v-model="certNumber"
          class="w-full bg-ink-soft border border-gold/20 focus:border-gold px-4 py-3 text-ash text-sm outline-none font-mono mb-4 text-center tracking-widest uppercase"
          placeholder="KNJM-N3B-2026-00001"/>
        <button @click="verifyCert" :disabled="loading"
          class="w-full py-3 bg-gold text-ink font-mono text-sm tracking-widest hover:bg-gold-light transition-all disabled:opacity-50">
          {{ loading ? 'Memverifikasi...' : 'Verifikasi' }}
        </button>

        <!-- Result -->
        <div v-if="result" class="mt-6 p-5 border"
          :class="result.valid ? 'border-green-500/40 bg-green-500/5' : 'border-red-500/40 bg-red-500/5'">
          <div v-if="result.valid">
            <div class="font-mono text-green-400 text-xs tracking-widest mb-3">VALID</div>
            <div class="font-display text-2xl text-ash font-semibold mb-1">{{ result.recipient_name }}</div>
            <div class="text-ash-muted text-sm">JLPT {{ result.level_code }} {{ result.tier }} — Grade {{ result.grade }}</div>
            <div class="text-ash-muted text-xs font-mono mt-2">{{ result.cert_number }}</div>
          </div>
          <div v-else>
            <div class="font-mono text-red-400 text-xs tracking-widest">TIDAK VALID</div>
            <p class="text-ash-muted text-sm mt-2">Sertifikat tidak ditemukan atau telah dicabut.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const config = useRuntimeConfig()
const certNumber = ref('')
const result = ref<any>(null)
const loading = ref(false)

async function verifyCert() {
  if (!certNumber.value.trim()) return
  loading.value = true
  result.value = null
  try {
    const data = await $fetch(`${config.public.backendUrl}/api/certificate/verify/${certNumber.value.trim()}`)
    result.value = data
  } catch {
    result.value = { valid: false }
  } finally {
    loading.value = false
  }
}
</script>
