<template>
  <div>
    <!-- Hero -->
    <section class="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden">
      <!-- Background kanji watermark -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span class="font-display text-[28vw] text-gold/[0.03] font-bold leading-none">漢字</span>
      </div>

      <div class="max-w-4xl mx-auto text-center relative z-10">
        <p v-motion-fade class="font-mono text-gold text-xs tracking-[0.4em] uppercase mb-6">
          Japanese Language Proficiency
        </p>
        <h1 v-motion-slide-visible-bottom
          class="font-display text-6xl md:text-8xl font-semibold text-ash leading-[0.95] tracking-tight mb-6">
          Kuasai<br/>
          <span class="text-gold italic">JLPT</span><br/>
          N3 & N2
        </h1>
        <p v-motion-fade class="text-ash-muted text-lg max-w-xl mx-auto leading-relaxed mb-10">
          Belajar bahasa Jepang dengan kurikulum terstruktur.
          Semua materi gratis — sertifikat untuk yang serius.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/auth/register"
            class="px-8 py-4 bg-gold text-ink font-mono font-medium tracking-widest text-sm hover:bg-gold-light transition-all">
            Mulai Belajar Gratis
          </NuxtLink>
          <NuxtLink to="/learn"
            class="px-8 py-4 border border-gold/30 text-ash font-mono text-sm tracking-widest hover:border-gold transition-all">
            Lihat Kurikulum
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="px-6 py-16 border-y border-gold/10">
      <div class="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
        <div v-for="stat in stats" :key="stat.label">
          <div class="font-display text-4xl text-gold font-semibold">{{ stat.value }}</div>
          <div class="font-mono text-xs text-ash-muted tracking-widest uppercase mt-2">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Levels -->
    <section class="px-6 py-24">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
          <p class="font-mono text-gold text-xs tracking-[0.4em] uppercase mb-3">Pilih Level</p>
          <h2 class="font-display text-5xl text-ash font-semibold">N3 atau N2?</h2>
        </div>
        <div class="grid md:grid-cols-2 gap-6">
          <NuxtLink v-for="level in levels" :key="level.code" :to="`/learn/${level.code.toLowerCase()}`"
            class="group p-8 border border-gold/20 hover:border-gold/60 transition-all relative overflow-hidden">
            <div class="absolute top-4 right-4 font-display text-6xl text-gold/5 font-bold group-hover:text-gold/10 transition-all">
              {{ level.kanji }}
            </div>
            <div class="font-mono text-gold text-xs tracking-widest mb-3">JLPT {{ level.code }}</div>
            <h3 class="font-display text-3xl text-ash font-semibold mb-3">{{ level.name }}</h3>
            <p class="text-ash-muted text-sm leading-relaxed mb-6">{{ level.desc }}</p>
            <div class="flex items-center gap-6 text-xs font-mono text-ash-muted">
              <span>{{ level.modules }} Modul</span>
              <span>{{ level.lessons }} Lessons</span>
              <span class="text-gold">Sertifikat Gratis</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="px-6 py-24 border-t border-gold/10">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <p class="font-mono text-gold text-xs tracking-[0.4em] uppercase mb-3">Cara Kerja</p>
          <h2 class="font-display text-5xl text-ash font-semibold">Simpel & Terstruktur</h2>
        </div>
        <div class="grid md:grid-cols-4 gap-8">
          <div v-for="(step, i) in steps" :key="i" class="text-center">
            <div class="w-12 h-12 border border-gold/40 flex items-center justify-center mx-auto mb-4 font-mono text-gold text-sm">
              {{ String(i + 1).padStart(2, '0') }}
            </div>
            <h4 class="font-display text-lg text-ash font-semibold mb-2">{{ step.title }}</h4>
            <p class="text-ash-muted text-sm leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="px-6 py-24 border-t border-gold/10">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <p class="font-mono text-gold text-xs tracking-[0.4em] uppercase mb-3">Harga</p>
          <h2 class="font-display text-5xl text-ash font-semibold">Belajar Gratis<br/>Sertifikat Terjangkau</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="plan in plans" :key="plan.name"
            :class="['p-8 border transition-all', plan.featured ? 'border-gold bg-gold/5' : 'border-gold/20']">
            <div class="font-mono text-gold text-xs tracking-widest mb-4">{{ plan.tag }}</div>
            <div class="font-display text-4xl text-ash font-semibold mb-1">{{ plan.price }}</div>
            <div class="text-ash-muted text-sm mb-6">{{ plan.desc }}</div>
            <ul class="space-y-3 mb-8">
              <li v-for="f in plan.features" :key="f" class="flex items-center gap-3 text-sm text-ash-muted">
                <span class="text-gold text-xs">✦</span>{{ f }}
              </li>
            </ul>
            <NuxtLink :to="plan.cta_link"
              :class="['block text-center py-3 font-mono text-sm tracking-widest transition-all',
                plan.featured ? 'bg-gold text-ink hover:bg-gold-light' : 'border border-gold/30 text-ash hover:border-gold']">
              {{ plan.cta }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { value: '300+', label: 'Vocab N3' },
  { value: '10', label: 'Modul' },
  { value: '100%', label: 'Gratis' },
]

const levels = [
  { code: 'N3', kanji: '三', name: 'Intermediate', desc: 'Grammar, vocabulary, kanji dasar. Cocok untuk yang sudah punya dasar bahasa Jepang.', modules: 10, lessons: 46 },
  { code: 'N2', kanji: '二', name: 'Upper Intermediate', desc: 'Grammar kompleks, keigo, reading & listening tingkat lanjut.', modules: 10, lessons: 46 },
]

const steps = [
  { title: 'Daftar Gratis', desc: 'Buat akun dan akses semua materi tanpa bayar.' },
  { title: 'Belajar & Quiz', desc: 'Selesaikan lesson dan quiz tiap modul.' },
  { title: 'Final Exam', desc: 'Ikuti ujian akhir setelah semua modul selesai.' },
  { title: 'Klaim Sertifikat', desc: 'Basic gratis, Advanced mulai 25rb.' },
]

const plans = [
  {
    tag: 'BASIC CERT',
    price: 'Gratis',
    desc: 'Untuk semua user',
    featured: false,
    cta: 'Mulai Sekarang',
    cta_link: '/auth/register',
    features: ['Semua materi N3 & N2', 'Quiz tiap modul', 'Final exam basic', 'Sertifikat basic (PDF)'],
  },
  {
    tag: 'N3 ADVANCED',
    price: 'Rp 25rb',
    desc: 'Sertifikat N3 Advanced',
    featured: true,
    cta: 'Ambil Sertifikat',
    cta_link: '/dashboard/certificates',
    features: ['Semua fitur Basic', 'Proctored exam', 'Sertifikat advanced premium', 'QR verification'],
  },
  {
    tag: 'N2 ADVANCED',
    price: 'Rp 50rb',
    desc: 'Sertifikat N2 Advanced',
    featured: false,
    cta: 'Ambil Sertifikat',
    cta_link: '/dashboard/certificates',
    features: ['Semua fitur Basic', 'Proctored exam N2', 'Sertifikat advanced premium', 'QR verification'],
  },
]
</script>
