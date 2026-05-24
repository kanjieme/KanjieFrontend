<template>
  <aside class="fixed left-0 top-0 bottom-0 w-64 bg-ink-soft border-r border-gold/10 flex flex-col z-40 hidden lg:flex">
    <!-- Logo -->
    <div class="px-6 py-6 border-b border-gold/10">
      <NuxtLink to="/" class="flex items-center gap-2">
        <span class="font-display text-xl text-ash">KanjiMe</span>
        <span class="font-display text-xl text-gold">漢字</span>
      </NuxtLink>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-4 py-6 space-y-1">
      <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 text-sm font-mono tracking-wide transition-all group"
        :class="$route.path === item.to
          ? 'text-gold border-l-2 border-gold pl-[10px]'
          : 'text-ash-muted hover:text-ash border-l-2 border-transparent'">
        <span class="text-base">{{ item.icon }}</span>
        {{ item.label }}
      </NuxtLink>
    </nav>

    <!-- User -->
    <div class="px-4 py-4 border-t border-gold/10">
      <button @click="logout"
        class="w-full text-left px-3 py-2 font-mono text-xs text-ash-muted hover:text-gold tracking-widest transition-colors uppercase">
        Keluar
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()

const navItems = [
  { to: '/dashboard', icon: '◈', label: 'Dashboard' },
  { to: '/learn/n3', icon: '三', label: 'JLPT N3' },
  { to: '/learn/n2', icon: '二', label: 'JLPT N2' },
  { to: '/dashboard/certificates', icon: '◎', label: 'Sertifikat' },
  { to: '/dashboard/profile', icon: '◇', label: 'Profil' },
]

async function logout() {
  await supabase.auth.signOut()
  router.push('/')
}
</script>
