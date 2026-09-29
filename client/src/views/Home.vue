<template>
  <div class="relative min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden selection:bg-[#1ED760]/30 selection:text-white">

    <!-- ═══════════════ FONS ANIMAT ═══════════════ -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- Gradient orbs -->
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <!-- Grid lines -->
      <div class="grid-overlay"></div>
    </div>

    <!-- ═══════════════ NAVBAR ═══════════════ -->
    <nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 nav-glass">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-[#1ED760] flex items-center justify-center">
          <svg class="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        </div>
        <span class="font-bold text-lg tracking-widest text-white">{{ $t('nav.brand') }}</span>
      </div>
      <div class="flex items-center gap-4">
        <LanguageSelector />
        <router-link to="/login" class="px-5 py-2 text-sm font-bold text-[#121212] bg-[#1ED760] rounded-full hover:bg-[#1fdf64] transition-all duration-200 hover:scale-105">
          {{ $t('nav.access') }}
        </router-link>
      </div>
    </nav>

    <!-- ═══════════════ HERO ═══════════════ -->
    <section class="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">

      <!-- Badge animat -->
      <div class="reveal flex items-center gap-2 px-4 py-2 bg-[#1ED760]/10 border border-[#1ED760]/30 rounded-full mb-8">
        <span class="w-2 h-2 rounded-full bg-[#1ED760] animate-pulse"></span>
        <span class="text-xs font-semibold text-[#1ED760] tracking-widest uppercase">{{ $t('home.badge') }}</span>
      </div>

      <!-- Títol principal -->
      <div class="reveal text-center mb-6">
        <h1 class="hero-title text-[clamp(4rem,14vw,10rem)] font-black tracking-tighter leading-none">
          <span class="block text-white">{{ $t('home.title') }}</span>
        </h1>
        <div class="sound-bars mt-4 mx-auto">
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </div>
      </div>

      <!-- Subtítol -->
      <p class="reveal text-center text-xl md:text-2xl text-[#999] font-light max-w-2xl mx-auto mb-12 leading-relaxed">
        {{ $t('home.subtitlePart1') }} <span class="text-white font-semibold">{{ $t('home.subtitleHighlight') }}</span> {{ $t('home.subtitlePart2') }}
      </p>

      <!-- CTA Buttons -->
      <div class="reveal flex flex-col sm:flex-row items-center gap-4 mb-20">
        <router-link to="/login"
          class="cta-primary group inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-[#121212] bg-[#1ED760] rounded-full">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          {{ $t('home.startExperience') }}
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </router-link>
        <a href="#features" class="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white border border-white/10 rounded-full hover:border-white/30 hover:bg-white/5 transition-all duration-200">
          {{ $t('home.discoverFeatures') }}
        </a>
      </div>

      <!-- Mockup Preview -->
      <div class="reveal w-full max-w-4xl mx-auto">
        <div class="mockup-card rounded-2xl p-px">
          <div class="rounded-2xl bg-[#111] p-6 md:p-10">
            <!-- Faux UI -->
            <div class="flex items-center gap-2 mb-6">
              <div class="w-3 h-3 rounded-full bg-red-500/70"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div class="w-3 h-3 rounded-full bg-green-500/70"></div>
              <div class="flex-1 mx-4 h-6 bg-white/5 rounded-lg flex items-center px-3">
                <span class="text-xs text-white/20">sonaris.app/dashboard</span>
              </div>
            </div>
            <!-- Dashboard preview -->
            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-2 bg-[#1ED760]/5 border border-[#1ED760]/10 rounded-xl p-4">
                <p class="text-xs text-[#1ED760] font-semibold mb-3 uppercase tracking-wider">{{ $t('home.mockupMood') }}</p>
                <div class="flex items-end gap-1 h-16">
                  <div v-for="(h, i) in bars" :key="i" class="bar-preview flex-1 rounded-sm bg-[#1ED760]" :style="`height:${h}%; opacity:${0.3 + i*0.1}`"></div>
                </div>
              </div>
              <div class="flex flex-col gap-3">
                <div class="bg-white/3 border border-white/5 rounded-xl p-3">
                  <p class="text-[10px] text-white/40 uppercase tracking-wider mb-1">{{ $t('home.mockupTopGenre') }}</p>
                  <p class="text-sm font-bold text-white">Hip-Hop</p>
                </div>
                <div class="bg-white/3 border border-white/5 rounded-xl p-3">
                  <p class="text-[10px] text-white/40 uppercase tracking-wider mb-1">{{ $t('home.mockupTracksCount') }}</p>
                  <p class="text-sm font-bold text-white">2,847</p>
                </div>
              </div>
              <div class="col-span-3 bg-white/3 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-[#1ED760]/20 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-[#1ED760]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-white">Blinding Lights</p>
                  <p class="text-xs text-white/40">The Weeknd</p>
                </div>
                <div class="sound-bars-mini">
                  <span></span><span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════ FEATURES ═══════════════ -->
    <section id="features" class="relative z-10 px-6 py-24 max-w-6xl mx-auto">
      <div class="reveal text-center mb-16">
        <p class="text-xs font-semibold text-[#1ED760] uppercase tracking-widest mb-3">{{ $t('home.featuresCategory') }}</p>
        <h2 class="text-4xl md:text-5xl font-black text-white tracking-tight">{{ $t('home.featuresTitle') }}<br/><span class="text-[#1ED760]">{{ $t('home.featuresSubtitle') }}</span></h2>
      </div>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">

        <!-- Card 1 - Gran -->
        <div class="reveal feature-card md:col-span-8 rounded-2xl bg-[#111] border border-white/5 p-8 overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-[#1ED760]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="absolute top-0 right-0 w-48 h-48 blur-3xl bg-[#1ED760]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#1ED760]/10 transition-all duration-700"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 bg-[#1ED760]/10 border border-[#1ED760]/20 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-[#1ED760]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 class="text-2xl font-black text-white mb-3 tracking-tight">{{ $t('home.commandCenterTitle') }}</h3>
            <p class="text-[#999] leading-relaxed max-w-md">{{ $t('home.commandCenterDesc') }}</p>
            <div class="mt-6 flex flex-wrap gap-2">
              <span class="feature-tag">{{ $t('home.tagAiPredictive') }}</span>
              <span class="feature-tag">{{ $t('home.tagRealTime') }}</span>
              <span class="feature-tag">{{ $t('home.tagTopHistorical') }}</span>
            </div>
          </div>
        </div>

        <!-- Card 2 - Petita -->
        <div class="reveal feature-card md:col-span-4 rounded-2xl bg-[#111] border border-white/5 p-8 overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 h-full flex flex-col">
            <div class="w-14 h-14 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <h3 class="text-xl font-black text-white mb-3 tracking-tight">{{ $t('home.tinderTitle') }}</h3>
            <p class="text-[#999] text-sm leading-relaxed">{{ $t('home.tinderDesc') }}</p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="reveal feature-card md:col-span-4 rounded-2xl bg-[#111] border border-white/5 p-8 overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 h-full flex flex-col">
            <div class="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
            </div>
            <h3 class="text-xl font-black text-white mb-3 tracking-tight">{{ $t('home.radarTitle') }}</h3>
            <p class="text-[#999] text-sm leading-relaxed">{{ $t('home.radarDesc') }}</p>
          </div>
        </div>

        <!-- Card 4 - Gran -->
        <div class="reveal feature-card md:col-span-8 rounded-2xl bg-[#111] border border-white/5 p-8 overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="absolute bottom-0 left-0 w-64 h-32 blur-3xl bg-purple-500/5 rounded-full translate-y-1/2 -translate-x-1/4 group-hover:bg-purple-500/10 transition-all duration-700"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <h3 class="text-2xl font-black text-white mb-3 tracking-tight">{{ $t('home.geminiTitle') }}</h3>
            <p class="text-[#999] leading-relaxed max-w-md">{{ $t('home.geminiDesc') }}</p>
            <div class="mt-6 flex flex-wrap gap-2">
              <span class="feature-tag-purple">{{ $t('home.tagGeminiAi') }}</span>
              <span class="feature-tag-purple">{{ $t('home.tagRecommendations') }}</span>
              <span class="feature-tag-purple">{{ $t('home.tagMusicAnalysis') }}</span>
            </div>
          </div>
        </div>

        <!-- Card 5 - Stats -->
        <div class="reveal feature-card md:col-span-6 rounded-2xl bg-[#111] border border-white/5 p-8 overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 class="text-xl font-black text-white mb-3 tracking-tight">{{ $t('home.advancedStatsTitle') }}</h3>
            <p class="text-[#999] text-sm leading-relaxed">{{ $t('home.advancedStatsDesc') }}</p>
          </div>
        </div>

        <!-- Card 6 - Gestor de Playlists -->
        <div class="reveal feature-card md:col-span-6 rounded-2xl bg-[#111] border border-white/5 p-8 overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h10M4 18h10M15 14l3 3 5-5" /></svg>
            </div>
            <h3 class="text-xl font-black text-white mb-3 tracking-tight">{{ $t('home.playlistManagerTitle') }}</h3>
            <p class="text-[#999] text-sm leading-relaxed">{{ $t('home.playlistManagerDesc') }}</p>
            <div class="mt-5 flex flex-wrap gap-2">
              <span class="feature-tag-emerald">{{ $t('home.tagCreatePlaylists') }}</span>
              <span class="feature-tag-emerald">{{ $t('home.tagEdit') }}</span>
              <span class="feature-tag-emerald">{{ $t('home.tagOrganize') }}</span>
            </div>
          </div>
        </div>

        <!-- Card 7 - Netejador de Duplicades -->
        <div class="reveal feature-card md:col-span-6 rounded-2xl bg-[#111] border border-white/5 p-8 overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 class="text-xl font-black text-white mb-3 tracking-tight">{{ $t('home.duplicatesCleanerTitle') }}</h3>
            <p class="text-[#999] text-sm leading-relaxed">{{ $t('home.duplicatesCleanerDesc') }}</p>
            <div class="mt-5 flex flex-wrap gap-2">
              <span class="feature-tag-yellow">{{ $t('home.tagAutoDetection') }}</span>
              <span class="feature-tag-yellow">{{ $t('home.tagRemoveDuplicates') }}</span>
            </div>
          </div>
        </div>

        <!-- Card 8 - Wrapped en Temps Real -->
        <div class="reveal feature-card md:col-span-6 rounded-2xl bg-[#111] border border-white/5 p-8 overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
              <span class="text-2xl">✨</span>
            </div>
            <h3 class="text-xl font-black text-white mb-3 tracking-tight">{{ $t('home.wrappedTitle') }}</h3>
            <p class="text-[#999] text-sm leading-relaxed">{{ $t('home.wrappedDesc') }}</p>
            <div class="mt-5 flex flex-wrap gap-2">
              <span class="feature-tag">{{ $t('home.tag12Stories') }}</span>
              <span class="feature-tag">{{ $t('home.tagTopArtists') }}</span>
              <span class="feature-tag">{{ $t('home.tagAcousticDna') }}</span>
            </div>
          </div>
        </div>

        <!-- Card 9 - Music Quiz -->
        <div class="reveal feature-card md:col-span-6 rounded-2xl bg-[#111] border border-white/5 p-8 overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-6">
              <span class="text-2xl">🎮</span>
            </div>
            <h3 class="text-xl font-black text-white mb-3 tracking-tight">{{ $t('home.quizTitle') }}</h3>
            <p class="text-[#999] text-sm leading-relaxed">{{ $t('home.quizDesc') }}</p>
            <div class="mt-5 flex flex-wrap gap-2">
              <span class="feature-tag-emerald">{{ $t('home.tagRealTime') }}</span>
              <span class="feature-tag-emerald">{{ $t('home.tagScores') }}</span>
              <span class="feature-tag-emerald">{{ $t('home.tag100Yours') }}</span>
            </div>
          </div>
        </div>

        <!-- Card 10 - ADN Acústic & Mood -->
        <div class="reveal feature-card md:col-span-6 rounded-2xl bg-[#111] border border-white/5 p-8 overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-6">
              <span class="text-2xl">🧬</span>
            </div>
            <h3 class="text-xl font-black text-white mb-3 tracking-tight">{{ $t('home.dnaTitle') }}</h3>
            <p class="text-[#999] text-sm leading-relaxed">{{ $t('home.dnaDesc') }}</p>
            <div class="mt-5 flex flex-wrap gap-2">
              <span class="feature-tag-rose">{{ $t('home.tagRadarChart') }}</span>
              <span class="feature-tag-rose">{{ $t('home.tagSonicVibe') }}</span>
              <span class="feature-tag-rose">{{ $t('home.tagValence') }}</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ═══════════════ STATS ═══════════════ -->
    <section class="relative z-10 px-6 py-20">
      <div class="max-w-5xl mx-auto">
        <div class="rounded-3xl bg-[#111] border border-white/5 p-10 md:p-16">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div class="reveal">
              <p class="text-4xl md:text-5xl font-black text-[#1ED760] mb-2">∞</p>
              <p class="text-sm text-[#666] uppercase tracking-wider">{{ $t('home.statSongsAnalyzed') }}</p>
            </div>
            <div class="reveal">
              <p class="text-4xl md:text-5xl font-black text-white mb-2">6</p>
              <p class="text-sm text-[#666] uppercase tracking-wider">{{ $t('home.statAiFeatures') }}</p>
            </div>
            <div class="reveal">
              <p class="text-4xl md:text-5xl font-black text-white mb-2">0€</p>
              <p class="text-sm text-[#666] uppercase tracking-wider">{{ $t('home.statAccessCost') }}</p>
            </div>
            <div class="reveal">
              <p class="text-4xl md:text-5xl font-black text-white mb-2">24/7</p>
              <p class="text-sm text-[#666] uppercase tracking-wider">{{ $t('home.statAlwaysAvailable') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════ CTA FINAL ═══════════════ -->
    <section class="relative z-10 px-6 py-24 text-center">
      <div class="reveal max-w-3xl mx-auto">
        <div class="mb-4">
          <div class="sound-bars mx-auto mb-8">
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span>
          </div>
        </div>
        <h2 class="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
          {{ $t('home.ctaTitlePart1') }}<br/><span class="text-[#1ED760]">{{ $t('home.ctaTitlePart2') }}</span>
        </h2>
        <p class="text-xl text-[#666] mb-10 leading-relaxed">{{ $t('home.ctaSubtitle') }}</p>
        <router-link to="/login"
          class="cta-primary-lg group inline-flex items-center gap-3 px-10 py-5 text-lg font-black text-[#121212] bg-[#1ED760] rounded-full">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          {{ $t('home.ctaButton') }}
          <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-white/5 px-8 py-8 text-center">
      <p class="text-xs text-[#444] uppercase tracking-widest">{{ $t('home.footerText') }}</p>
    </footer>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import LanguageSelector from '../components/LanguageSelector.vue'

const bars = [40, 70, 55, 90, 65, 80, 45, 75, 60, 85, 50, 95]

onMounted(() => {
  // Scroll reveal amb IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
})
</script>

<style scoped>
/* ─── Orbs animats ─── */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float 8s ease-in-out infinite;
}
.orb-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(30,215,96,0.07) 0%, transparent 70%);
  top: -20%; left: -15%;
  animation-duration: 10s;
}
.orb-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%);
  top: 30%; right: -10%;
  animation-duration: 12s; animation-delay: -3s;
}
.orb-3 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(30,215,96,0.04) 0%, transparent 70%);
  bottom: 10%; left: 40%;
  animation-duration: 9s; animation-delay: -6s;
}
@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}

/* ─── Grid overlay ─── */
.grid-overlay {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ─── Navbar ─── */
.nav-glass {
  background: rgba(10,10,10,0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

/* ─── Hero title ─── */
.hero-title {
  background: linear-gradient(180deg, #ffffff 50%, rgba(255,255,255,0.4) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── Sound bars ─── */
.sound-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 32px;
  width: fit-content;
}
.sound-bars span {
  display: block;
  width: 4px;
  background: #1ED760;
  border-radius: 2px;
  animation: soundBar 1.2s ease-in-out infinite;
}
.sound-bars span:nth-child(1) { height: 40%; animation-delay: 0s; }
.sound-bars span:nth-child(2) { height: 80%; animation-delay: 0.1s; }
.sound-bars span:nth-child(3) { height: 60%; animation-delay: 0.2s; }
.sound-bars span:nth-child(4) { height: 100%; animation-delay: 0.3s; }
.sound-bars span:nth-child(5) { height: 70%; animation-delay: 0.4s; }
.sound-bars span:nth-child(6) { height: 90%; animation-delay: 0.5s; }
.sound-bars span:nth-child(7) { height: 50%; animation-delay: 0.6s; }
.sound-bars span:nth-child(8) { height: 75%; animation-delay: 0.7s; }
@keyframes soundBar {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}

/* ─── Sound bars mini (now playing) ─── */
.sound-bars-mini {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 16px;
}
.sound-bars-mini span {
  display: block;
  width: 3px;
  background: #1ED760;
  border-radius: 1px;
  animation: soundBar 1s ease-in-out infinite;
}
.sound-bars-mini span:nth-child(1) { height: 50%; animation-delay: 0s; }
.sound-bars-mini span:nth-child(2) { height: 100%; animation-delay: 0.2s; }
.sound-bars-mini span:nth-child(3) { height: 70%; animation-delay: 0.4s; }
.sound-bars-mini span:nth-child(4) { height: 85%; animation-delay: 0.6s; }

/* ─── CTA buttons ─── */
.cta-primary {
  transition: all 0.2s ease;
  box-shadow: 0 0 40px rgba(30,215,96,0.25);
}
.cta-primary:hover {
  transform: scale(1.04);
  box-shadow: 0 0 60px rgba(30,215,96,0.4);
}
.cta-primary-lg {
  transition: all 0.2s ease;
  box-shadow: 0 0 60px rgba(30,215,96,0.3);
}
.cta-primary-lg:hover {
  transform: scale(1.04);
  box-shadow: 0 0 80px rgba(30,215,96,0.5);
}

/* ─── Mockup card ─── */
.mockup-card {
  background: linear-gradient(135deg, rgba(30,215,96,0.15), rgba(255,255,255,0.05), rgba(168,85,247,0.1));
}

/* ─── Feature cards ─── */
.feature-card {
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255,255,255,0.1);
}

/* ─── Feature tags ─── */
.feature-tag {
  padding: 4px 12px;
  background: rgba(30,215,96,0.1);
  border: 1px solid rgba(30,215,96,0.2);
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  color: #1ED760;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.feature-tag-purple {
  padding: 4px 12px;
  background: rgba(168,85,247,0.1);
  border: 1px solid rgba(168,85,247,0.2);
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  color: #a855f7;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ─── Scroll reveal ─── */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
.feature-tag-emerald {
  padding: 4px 12px;
  background: rgba(16,185,129,0.1);
  border: 1px solid rgba(16,185,129,0.2);
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  color: #34d399;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.feature-tag-yellow {
  padding: 4px 12px;
  background: rgba(234,179,8,0.1);
  border: 1px solid rgba(234,179,8,0.2);
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  color: #facc15;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.feature-tag-rose {
  padding: 4px 12px;
  background: rgba(244,63,94,0.1);
  border: 1px solid rgba(244,63,94,0.2);
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  color: #fb7185;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
