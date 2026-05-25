<template>
  <div>
    <div class="mb-10">
      <p class="font-mono text-gold text-xs tracking-widest uppercase mb-1">Dashboard</p>
      <h1 class="font-display text-4xl text-ash font-semibold">
        おはよう、<span class="text-gold">{{ userName }}</span>
      </h1>
      <p class="text-ash-muted text-sm mt-2">Lanjutkan belajar dari mana kamu berhenti.</p>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mb-10">
      <div v-for="level in ['N3','N2']" :key="level"
        class="border border-gold/20 p-6 hover:border-gold/40 transition-all group">
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="font-mono text-gold text-xs tracking-widest mb-1">JLPT {{ level }}</div>
            <div class="font-display text-2xl text-ash font-semibold">
              {{ level === 'N3' ? 'Intermediate' : 'Upper Intermediate' }}
            </div>
          </div>
          <div class="font-display text-5xl text-gold/10 font-bold group-hover:text-gold/20 transition-all">
            {{ level === 'N3' ? '三' : '二' }}
          </div>
        </div>
        <div class="h-1 bg-ink-muted rounded-full mb-3">
          <div class="h-1 bg-gold rounded-full" style="width: 0%"></div>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-mono text-xs text-ash-muted">0 / 6 modul</span>
          <NuxtLink :to="`/learn/${level.toLowerCase()}`"
            class="font-mono text-xs text-gold hover:underline tracking-widest">
            MULAI →
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-4 mb-10">
      <NuxtLink to="/learn/n3" class="border border-gold/20 p-4 hover:border-gold/40 transition-all">
        <div class="font-mono text-gold text-xs tracking-widest mb-1">N3</div>
        <div class="text-ash text-sm">Mulai belajar N3</div>
      </NuxtLink>
      <NuxtLink to="/learn/n2" class="border border-gold/20 p-4 hover:border-gold/40 transition-all">
        <div class="font-mono text-gold text-xs tracking-widest mb-1">N2</div>
        <div class="text-ash text-sm">Mulai belajar N2</div>
      </NuxtLink>
      <NuxtLink to="/dashboard/certificates" class="border border-gold/20 p-4 hover:border-gold/40 transition-all">
        <div class="font-mono text-gold text-xs tracking-widest mb-1">SERTIFIKAT</div>
        <div class="text-ash text-sm">Lihat sertifikatmu</div>
      </NuxtLink>
    </div>

    <div class="border border-gold/10 p-6">
      <h2 class="font-mono text-xs text-gold tracking-widest uppercase mb-4">Aktivitas Terbaru</h2>
      <p class="text-ash-muted text-sm">Belum ada aktivitas. Mulai lesson pertamamu!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const user = useSupabaseUser()
const userName = computed(() => user.value?.user_metadata?.full_name?.split(' ')[0] || 'Pelajar')
</script>
