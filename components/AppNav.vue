<template>
  <nav class="fixed top-0 left-0 right-0 z-50 px-6 py-4"
       :class="scrolled ? 'bg-ink/90 backdrop-blur-md border-b border-gold/10' : ''">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <span class="font-display text-2xl font-semibold text-ash tracking-wide">KanjiMe</span>
        <span class="font-display text-2xl text-gold">漢字</span>
      </NuxtLink>

      <!-- Nav links -->
      <div class="hidden md:flex items-center gap-8">
        <NuxtLink to="/learn" class="text-ash-muted hover:text-ash text-sm font-mono tracking-widest uppercase transition-colors">Learn</NuxtLink>
        <NuxtLink to="/pricing" class="text-ash-muted hover:text-ash text-sm font-mono tracking-widest uppercase transition-colors">Pricing</NuxtLink>
        <NuxtLink to="/verify" class="text-ash-muted hover:text-ash text-sm font-mono tracking-widest uppercase transition-colors">Verify</NuxtLink>
      </div>

      <!-- Auth -->
      <div class="flex items-center gap-3">
        <template v-if="user">
          <NuxtLink to="/dashboard"
            class="px-4 py-2 text-sm font-mono border border-gold text-gold hover:bg-gold hover:text-ink transition-all tracking-wider">
            Dashboard
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/auth/login"
            class="text-ash-muted hover:text-ash text-sm font-mono tracking-widest uppercase transition-colors">
            Login
          </NuxtLink>
          <NuxtLink to="/auth/register"
            class="px-4 py-2 text-sm font-mono bg-gold text-ink hover:bg-gold-light transition-all tracking-wider font-medium">
            Mulai Gratis
          </NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { scrollY } = useWindowScroll()
const scrolled = computed(() => scrollY.value > 20)
const supabase = useSupabaseClient()
const user = useSupabaseUser()
</script>
