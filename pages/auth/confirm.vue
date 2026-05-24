<template>
  <div class="min-h-screen flex items-center justify-center px-6">
    <div class="text-center">
      <div class="font-display text-2xl text-ash mb-4">KanjiMe 漢字</div>
      <div class="font-mono text-gold text-xs tracking-widest mb-3">MEMVERIFIKASI...</div>
      <p class="text-ash-muted text-sm">Mohon tunggu sebentar.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
const router = useRouter()
onMounted(() => {
  setTimeout(() => router.push('/dashboard'), 2000)
})
</script>
