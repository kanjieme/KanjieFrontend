<template>
  <div>
    <!-- Hero -->
    <section class="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span class="font-display text-[28vw] text-gold/[0.03] font-bold leading-none">漢字</span>
      </div>
      <div class="max-w-4xl mx-auto text-center relative z-10">
        <p class="font-mono text-gold text-xs tracking-[0.4em] uppercase mb-6">Japanese Language Proficiency</p>
        <h1 class="font-display text-6xl md:text-8xl font-semibold text-ash leading-[0.95] tracking-tight mb-6">
          Kuasai<br/>
          <span class="text-gold italic">JLPT</span><br/>
          N3 & N2
        </h1>
        <p class="text-ash-muted text-lg max-w-xl mx-auto leading-relaxed mb-10">
          Belajar bahasa Jepang dengan kurikulum terstruktur.
          Semua materi gratis — sertifikat untuk yang serius.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/auth/register"
            class="px-8 py-4 bg-gold text-ink font-mono font-medium tracking-widest text-sm hover:bg-gold-light transition-all">
            Mulai Belajar Gratis
          </NuxtLink>
          <NuxtLink to="/learn/n3"
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

    <!-- Pricing — CLEAR VERSION -->
    <section class="px-6 py-24 border-t border-gold/10">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-6">
          <p class="font-mono text-gold text-xs tracking-[0.4em] uppercase mb-3">Harga</p>
          <h2 class="font-display text-5xl text-ash font-semibold">Transparan & Terjangkau</h2>
        </div>
        <p class="text-center text-ash-muted text-sm mb-16 max-w-lg mx-auto">
          Semua materi & sertifikat Basic <strong class="text-gold">100% gratis</strong>.
          Sertifikat Advanced untuk yang butuh pengakuan lebih tinggi.
        </p>

        <!-- Free tier -->
        <div class="border border-gold/20 p-8 mb-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div class="font-mono text-gold text-xs tracking-widest mb-2">PAKET GRATIS</div>
              <div class="font-display text-4xl text-ash font-semibold">Rp 0</div>
              <p class="text-ash-muted text-sm mt-2">Untuk semua user yang daftar</p>
            </div>
            <NuxtLink to="/auth/register"
              class="px-8 py-3 border border-gold text-gold font-mono text-sm tracking-widest hover:bg-gold hover:text-ink transition-all text-center">
              Daftar Sekarang
            </NuxtLink>
          </div>
          <div class="grid md:grid-cols-2 gap-8">
            <div v-for="level in ['N3','N2']" :key="level"
              class="border border-gold/10 p-5">
              <div class="font-mono text-gold text-xs tracking-widest mb-3">
                JLPT {{ level }} BASIC
              </div>
              <ul class="space-y-2">
                <li v-for="f in freeFeatures" :key="f" class="flex items-center gap-3 text-sm text-ash-muted">
                  <span class="text-gold text-xs">✦</span>{{ f }}
                </li>
                <li class="flex items-center gap-3 text-sm text-gold font-mono">
                  <span class="text-xs">✦</span>Sertifikat {{ level }} Basic — GRATIS
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Paid tier -->
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="plan in paidPlans" :key="plan.level"
            class="border border-gold/40 bg-gold/5 p-8">
            <div class="font-mono text-gold text-xs tracking-widest mb-2">{{ plan.tag }}</div>
            <div class="font-display text-4xl text-ash font-semibold mb-1">{{ plan.price }}</div>
            <p class="text-ash-muted text-sm mb-6">{{ plan.desc }}</p>
            <ul class="space-y-2 mb-8">
              <li v-for="f in plan.features" :key="f" class="flex items-center gap-3 text-sm text-ash-muted">
                <span class="text-gold text-xs">✦</span>{{ f }}
              </li>
            </ul>
            <NuxtLink to="/dashboard/certificates"
              class="block text-center py-3 bg-gold text-ink font-mono text-sm tracking-widest hover:bg-gold-light transition-all">
              Ambil Sertifikat
            </NuxtLink>
          </div>
        </div>

        <!-- Note -->
        <p class="text-center text-ash-muted text-xs font-mono mt-8 tracking-wide">
          Sertifikat Advanced hanya tersedia setelah lulus Final Exam Basic terlebih dahulu.
        </p>
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
  { title: 'Klaim Sertifikat', desc: 'Basic gratis langsung download. Advanced mulai 25rb.' },
]

const freeFeatures = [
  'Semua materi & lesson',
  'Quiz tiap modul',
  'Final Exam Basic',
]

const paidPlans = [
  {
    level: 'N3',
    tag: 'SERTIFIKAT N3 ADVANCED',
    price: 'Rp 25.000',
    desc: 'Untuk yang serius buktikan kemampuan N3',
    features: [
      'Proctored exam (anti-cheat)',
      'Sertifikat premium design',
      'QR code verifikasi',
      'Terkirim via Telegram & email',
    ],
  },
  {
    level: 'N2',
    tag: 'SERTIFIKAT N2 ADVANCED',
    price: 'Rp 50.000',
    desc: 'Untuk yang siap buktikan level N2',
    features: [
      'Proctored exam (anti-cheat)',
      'Sertifikat premium design',
      'QR code verifikasi',
      'Terkirim via Telegram & email',
    ],
  },
]
</script>
