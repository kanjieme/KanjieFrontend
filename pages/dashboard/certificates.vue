<template>
  <div>
    <div class="mb-10">
      <p class="font-mono text-gold text-xs tracking-widest uppercase mb-1">Sertifikat</p>
      <h1 class="font-display text-4xl text-ash font-semibold">Sertifikat Kamu</h1>
      <p class="text-ash-muted text-sm mt-2">Klaim sertifikat setelah lulus Final Exam.</p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <div v-for="level in ['N3','N2']" :key="level" class="border border-gold/20 p-6">
        <div class="font-mono text-gold text-xs tracking-widest mb-2">JLPT {{ level }}</div>
        <div class="space-y-4">
          <!-- Basic cert -->
          <div class="border border-gold/10 p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="font-display text-lg text-ash">Basic</span>
              <span class="font-mono text-xs text-gold">GRATIS</span>
            </div>
            <p class="text-ash-muted text-xs mb-3">Selesaikan semua modul basic & lulus final exam.</p>
            <button class="w-full py-2 border border-gold/30 text-ash-muted font-mono text-xs tracking-widest cursor-not-allowed">
              BELUM ELIGIBLE
            </button>
          </div>
          <!-- Advanced cert -->
          <div class="border border-gold/40 bg-gold/5 p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="font-display text-lg text-ash">Advanced</span>
              <span class="font-mono text-xs text-gold">{{ level === 'N3' ? 'Rp 25.000' : 'Rp 50.000' }}</span>
            </div>
            <p class="text-ash-muted text-xs mb-3">Lulus basic cert terlebih dahulu untuk unlock.</p>
            <button class="w-full py-2 border border-gold/20 text-ash-muted font-mono text-xs tracking-widest cursor-not-allowed">
              LOCKED
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
</script>
