<template>
  <div class="min-h-screen px-6 py-24">
    <div class="max-w-4xl mx-auto">
      <!-- Back -->
      <NuxtLink to="/"
        class="inline-flex items-center gap-2 font-mono text-xs text-ash-muted hover:text-gold transition-colors mb-8">
        ← Kembali ke Beranda
      </NuxtLink>

      <div class="mb-12">
        <p class="font-mono text-gold text-xs tracking-widest uppercase mb-2">JLPT {{ levelCode }}</p>
        <h1 class="font-display text-5xl text-ash font-semibold mb-4">
          {{ levelCode === 'N3' ? 'Intermediate' : 'Upper Intermediate' }}
        </h1>
        <p class="text-ash-muted max-w-lg">Selesaikan semua modul untuk unlock Final Exam dan klaim sertifikat.</p>
      </div>

      <div class="flex gap-4 mb-8 border-b border-gold/10">
        <button v-for="tier in ['basic','advanced']" :key="tier"
          @click="activeTier = tier"
          :class="['pb-3 font-mono text-xs tracking-widest uppercase transition-colors',
            activeTier === tier ? 'text-gold border-b-2 border-gold' : 'text-ash-muted hover:text-ash']">
          {{ tier }}
        </button>
      </div>

      <div class="space-y-3">
        <div v-for="(mod, i) in filteredModules" :key="mod.id"
          class="border border-gold/20 p-5 hover:border-gold/40 transition-all flex items-center gap-5">
          <div class="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-gold/30 font-mono text-xs text-ash-muted">
            {{ String(i + 1).padStart(2, '0') }}
          </div>
          <div class="flex-1">
            <h3 class="font-display text-lg text-ash font-semibold">{{ mod.title }}</h3>
            <p class="text-ash-muted text-sm mt-1">{{ mod.description }}</p>
          </div>
          <NuxtLink :to="`/learn/${levelCode.toLowerCase()}/module/${mod.slug}`"
            class="font-mono text-xs text-gold hover:underline tracking-widest flex-shrink-0">
            MULAI →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const levelCode = computed(() => (route.params.level as string).toUpperCase())
const activeTier = ref('basic')
const supabase = useSupabaseClient()
const modules = ref<any[]>([])

onMounted(async () => {
  const { data } = await supabase
    .from('modules')
    .select('*, levels!inner(code)')
    .eq('levels.code', levelCode.value)
    .order('order_num')
  modules.value = data || []
})

const filteredModules = computed(() =>
  modules.value.filter(m => m.tier === activeTier.value)
)
</script>
