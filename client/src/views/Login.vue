<template>
  <div class="relative min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden flex items-center justify-center">

    <!-- ═══ FONS ANIMAT ═══ -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Selector de llengua superior -->
    <div class="absolute top-6 right-8 z-30">
      <LanguageSelector />
    </div>

    <!-- ═══ LAYOUT SPLIT ═══ -->
    <div class="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 py-16">

      <!-- COSTAT ESQUERRE - Branding -->
      <div class="flex-1 text-center md:text-left space-y-6 animate-slide-left">
        <!-- Logo -->
        <div class="flex items-center justify-center md:justify-start gap-3 mb-8">
          <div class="w-10 h-10 rounded-full bg-[#1ED760] flex items-center justify-center shadow-[0_0_20px_rgba(30,215,96,0.5)]">
            <svg class="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          <span class="font-black text-xl tracking-widest text-white">SONARIS</span>
        </div>

        <!-- Títol gran -->
        <h1 class="text-5xl md:text-6xl font-black tracking-tighter leading-none">
          <span class="block text-white">La teva</span>
          <span class="block gradient-text">música,</span>
          <span class="block text-white">redescoberta.</span>
        </h1>

        <!-- Descripció -->
        <p class="text-[#666] text-lg leading-relaxed max-w-md">
          Connecta el teu Spotify i descobreix estadístiques, IA i experiències musicals que mai has tingut.
        </p>

        <!-- Features mini -->
        <div class="flex flex-col gap-3 pt-2">
          <div v-for="f in features" :key="f.text" class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-full bg-[#1ED760]/10 border border-[#1ED760]/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-[#1ED760]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span class="text-sm text-[#888]">{{ f.text }}</span>
          </div>
        </div>
      </div>

      <!-- COSTAT DRET - Login Card -->
      <div class="w-full md:w-auto flex-shrink-0 animate-slide-right">
        <div class="login-card w-full md:w-[400px] rounded-3xl p-8 space-y-6">

          <!-- Header card -->
          <div class="text-center space-y-2">
            <!-- Sound bars animades -->
            <div class="sound-bars mx-auto mb-4">
              <span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <h2 class="text-2xl font-black text-white">Iniciar Sessió</h2>
            <p class="text-sm text-[#666]">Connecta el teu compte de Spotify per continuar</p>
          </div>

          <!-- Divider -->
          <div class="h-px bg-white/5"></div>

          <!-- Botó Spotify -->
          <button
            @click="iniciarSessioSpotify"
            class="spotify-btn w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-3 group"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Accedir amb Spotify</span>
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </button>

          <!-- Stats previsualització -->
          <div class="grid grid-cols-3 gap-2">
            <div v-for="s in stats" :key="s.label" class="stat-mini rounded-xl p-3 text-center">
              <p class="text-lg font-black text-white">{{ s.value }}</p>
              <p class="text-[10px] text-[#555] uppercase tracking-wider mt-0.5">{{ s.label }}</p>
            </div>
          </div>

          <!-- Legal -->
          <p class="text-center text-[11px] text-[#444] leading-relaxed">
            En continuar, acceptes l'accés a les teves dades públiques de Spotify per generar estadístiques. No emmagatzemem contrasenyes.
          </p>
        </div>

        <!-- Back link -->
        <div class="text-center mt-4">
          <router-link to="/" class="text-xs text-[#444] hover:text-[#888] transition-colors">← Tornar a l'inici</router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import LanguageSelector from '../components/LanguageSelector.vue'

const iniciarSessioSpotify = () => {
  window.location.href = 'http://localhost:3000/api/auth/login'
}

const features = [
  { text: 'Estadístiques avançades del teu Spotify' },
  { text: 'IA Gemini integrada per recomanacions' },
  { text: 'Tinder Musical amb amics en temps real' },
  { text: 'Playlists autònomes per estat d\'ànim' },
]

const stats = [
  { value: '6', label: 'Features' },
  { value: '∞', label: 'Cançons' },
  { value: '0€', label: 'Cost' },
]
</script>

<style scoped>
/* ─── Orbs ─── */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float 8s ease-in-out infinite;
}
.orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(30,215,96,0.08) 0%, transparent 70%);
  top: -10%; right: 10%;
  animation-duration: 10s;
}
.orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%);
  bottom: 0%; left: 5%;
  animation-duration: 13s; animation-delay: -4s;
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-25px); }
}

/* ─── Grid overlay ─── */
.grid-overlay {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ─── Gradient text ─── */
.gradient-text {
  background: linear-gradient(135deg, #1ED760, #17c255);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── Login card ─── */
.login-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  backdrop-filter: blur(20px);
  box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset;
}

/* ─── Spotify button ─── */
.spotify-btn {
  background: #1ED760;
  color: #000;
  transition: all 0.2s ease;
  box-shadow: 0 0 40px rgba(30,215,96,0.3);
}
.spotify-btn:hover {
  background: #1fdf64;
  transform: scale(1.02);
  box-shadow: 0 0 60px rgba(30,215,96,0.5);
}
.spotify-btn:active {
  transform: scale(0.98);
}

/* ─── Stat mini ─── */
.stat-mini {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
}

/* ─── Sound bars ─── */
.sound-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 24px;
  width: fit-content;
}
.sound-bars span {
  display: block;
  width: 3px;
  background: #1ED760;
  border-radius: 2px;
  animation: soundBar 1.2s ease-in-out infinite;
}
.sound-bars span:nth-child(1) { height: 40%; animation-delay: 0s; }
.sound-bars span:nth-child(2) { height: 100%; animation-delay: 0.15s; }
.sound-bars span:nth-child(3) { height: 60%; animation-delay: 0.3s; }
.sound-bars span:nth-child(4) { height: 80%; animation-delay: 0.45s; }
.sound-bars span:nth-child(5) { height: 50%; animation-delay: 0.6s; }
.sound-bars span:nth-child(6) { height: 90%; animation-delay: 0.75s; }
@keyframes soundBar {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}

/* ─── Animations ─── */
.animate-slide-left {
  animation: slideLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-slide-right {
  animation: slideRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.1s;
  opacity: 0;
}
@keyframes slideLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slideRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
