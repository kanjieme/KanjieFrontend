<template>
  <footer class="border-t border-gold/10 px-6 py-8 mt-20">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="font-display text-lg text-ash">KanjiMe</span>
        <span class="font-display text-lg text-gold">漢字</span>
      </div>
      <p class="text-ash-muted text-xs font-mono tracking-widest">
        © 2026 KANJIEME — JLPT N3 & N2 CERTIFICATION
      </p>
      <NuxtLink to="/verify" class="text-ash-muted hover:text-gold text-xs font-mono tracking-widest transition-colors uppercase">
        Verify Certificate
      </NuxtLink>
    </div>
  </footer>
</template>
