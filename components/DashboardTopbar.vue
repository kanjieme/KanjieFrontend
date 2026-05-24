<template>
  <header class="border-b border-gold/10 px-6 py-4 flex items-center justify-between">
    <div class="font-mono text-xs text-ash-muted tracking-widest uppercase">
      {{ $route.meta.title || 'KanjiMe' }}
    </div>
    <div class="flex items-center gap-3">
      <span class="font-mono text-xs text-ash-muted">{{ user?.email }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
</script>
