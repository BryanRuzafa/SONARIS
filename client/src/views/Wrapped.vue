<template>
  <div class="relative min-h-screen bg-[#060606] text-white font-sans overflow-hidden flex flex-col justify-between select-none">
    
    <!-- Fons ambiental dinàmic -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <div 
        class="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-30 transition-all duration-1000"
        :style="{ background: currentSlideColor }"
      ></div>
      <div 
        class="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full blur-[160px] opacity-20 transition-all duration-1000"
        :style="{ background: currentSlideColorSecondary }"
      ></div>
      <div class="stars-overlay"></div>
    </div>

    <!-- Barra de progrés superior (Stories style) -->
    <header class="relative z-20 px-6 pt-6 max-w-4xl mx-auto w-full">
      <div class="flex items-center justify-between gap-4 mb-4">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[#1ED760] animate-ping"></span>
          <span class="text-xs font-black tracking-widest uppercase text-white/80">SONARIS WRAPPED LIVE</span>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="toggleAudio" 
            class="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white/80 transition flex items-center gap-1.5 backdrop-blur-md"
          >
            <span>{{ isMuted ? '🔇' : '🔊' }}</span>
            <span class="hidden sm:inline">{{ isMuted ? 'Activar àudio' : 'So ambient' }}</span>
          </button>
          <router-link 
            to="/dashboard" 
            class="text-xs text-white/50 hover:text-white px-3 py-1 rounded-full bg-white/5 border border-white/10 transition"
          >
            ✕ Sortir
          </router-link>
        </div>
      </div>

      <!-- Línies de progrés -->
      <div class="grid gap-1.5" :style="{ gridTemplateColumns: `repeat(${totalSlides}, minmax(0, 1fr))` }">
        <div 
          v-for="index in totalSlides" 
          :key="index"
          class="h-1 rounded-full overflow-hidden bg-white/15"
        >
          <div 
            class="h-full bg-white transition-all duration-300"
            :style="{ 
              width: currentSlide > index ? '100%' : currentSlide === index ? `${progressPercent}%` : '0%' 
            }"
          ></div>
        </div>
      </div>
    </header>

    <!-- Contingut principal de la Slide -->
    <main class="relative z-10 flex-1 flex items-center justify-center px-6 py-8 max-w-3xl mx-auto w-full">
      
      <!-- LOADING STATE -->
      <div v-if="carregant" class="text-center space-y-4 animate-pulse">
        <div class="w-16 h-16 border-4 border-[#1ED760] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-lg font-medium text-white/80">{{ $t('wrapped.loading') }}</p>
      </div>

      <!-- ERROR STATE -->
      <div v-else-if="error" class="text-center space-y-4 max-w-md">
        <p class="text-red-400 text-lg">⚠️ {{ error }}</p>
        <button @click="carregarDadesWrapped" class="px-6 py-2.5 bg-[#1ED760] text-black font-bold rounded-full">
          Reintentar
        </button>
      </div>

      <!-- SLIDES CONTENT -->
      <div v-else class="w-full">

        <!-- SLIDE 1: INTRO -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentSlide === 1" class="text-center space-y-6">
            <div class="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl mb-2">
              <span class="text-6xl">✨</span>
            </div>
            <h1 class="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Prepara't per al teu <br/>
              <span class="bg-gradient-to-r from-[#1ED760] via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Viatge Sonar
              </span>
            </h1>
            <p class="text-lg text-white/60 max-w-md mx-auto">
              Hem submergit l'analítica en el teu ADN musical de Spotify per revelar com sona la teva essència.
            </p>
            <div class="pt-4">
              <span class="text-xs uppercase tracking-widest text-[#1ED760] font-bold animate-bounce block">
                Fes clic a qualsevol lloc per continuar →
              </span>
            </div>
          </div>
        </transition>

        <!-- SLIDE 2: MINUTS ESTIMATS -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentSlide === 2" class="text-center space-y-5">
            <span class="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Temps d'immersió
            </span>
            <p class="text-sm sm:text-base text-white/70">Has navegat a través d'oceans de música</p>
            <div class="py-6">
              <span class="text-6xl sm:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_35px_rgba(30,215,96,0.3)]">
                {{ wrappedData?.minutsEstimats?.toLocaleString() }}
              </span>
              <span class="block text-xl text-white/50 font-bold mt-2">minuts estimats gaudits</span>
            </div>
            <p class="text-xs text-white/40 max-w-sm mx-auto">
              Això equival aproximadament a {{ Math.round((wrappedData?.minutsEstimats || 0) / 60) }} hores de freqüències sense pausa.
            </p>
          </div>
        </transition>

        <!-- SLIDE 3: TOP ARTISTA #1 -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentSlide === 3" class="text-center space-y-6">
            <span class="text-xs font-bold uppercase tracking-widest text-[#1ED760] bg-[#1ED760]/10 px-3 py-1 rounded-full border border-[#1ED760]/20">
              La teva obsessió absoluta
            </span>
            
            <div class="relative w-48 h-48 sm:w-60 sm:h-60 mx-auto rounded-full p-1.5 bg-gradient-to-tr from-[#1ED760] via-cyan-400 to-indigo-500 shadow-[0_0_50px_rgba(30,215,96,0.4)]">
              <img 
                v-if="wrappedData?.artista1?.images?.[0]?.url" 
                :src="wrappedData.artista1.images[0].url" 
                class="w-full h-full object-cover rounded-full"
                alt="Top Artist"
              />
              <div v-else class="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-4xl">
                🎤
              </div>
              <div class="absolute -bottom-2 right-4 bg-black border-2 border-[#1ED760] text-xs font-black px-3 py-1 rounded-full text-[#1ED760]">
                #1 TOP
              </div>
            </div>

            <div>
              <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {{ wrappedData?.artista1?.name }}
              </h2>
              <p class="text-sm text-white/60 mt-1 capitalize">
                {{ wrappedData?.artista1?.genres?.slice(0, 2).join(' · ') || 'Artista Clau' }}
              </p>
            </div>
          </div>
        </transition>

        <!-- SLIDE 4: TOP 5 ARTISTES -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentSlide === 4" class="space-y-6 max-w-md mx-auto">
            <div class="text-center space-y-1">
              <span class="text-xs font-bold uppercase tracking-widest text-cyan-400">El teu Olympe Sonor</span>
              <h2 class="text-2xl sm:text-4xl font-black">Top 5 Artistes</h2>
            </div>

            <div class="space-y-2.5">
              <div 
                v-for="(artista, idx) in wrappedData?.top5Artistes" 
                :key="artista.id"
                class="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md transition hover:bg-white/10"
              >
                <span class="font-black text-sm text-[#1ED760] w-5 text-center">{{ idx + 1 }}</span>
                <img 
                  :src="artista.images?.[0]?.url || ''" 
                  class="w-11 h-11 rounded-xl object-cover" 
                  alt="avatar" 
                />
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-sm text-white truncate">{{ artista.name }}</p>
                  <p class="text-[11px] text-white/40 truncate capitalize">{{ artista.genres?.[0] || 'Música' }}</p>
                </div>
                <div class="text-xs font-black text-white/40">{{ artista.popularity }}% pop</div>
              </div>
            </div>
          </div>
        </transition>

        <!-- SLIDE 5: TOP CANÇÓ #1 -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentSlide === 5" class="text-center space-y-6">
            <span class="text-xs font-bold uppercase tracking-widest text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
              L'himne que no pots parar de cantar
            </span>

            <div class="relative w-48 h-48 sm:w-60 sm:h-60 mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                v-if="wrappedData?.canco1?.album?.images?.[0]?.url" 
                :src="wrappedData.canco1.album.images[0].url" 
                class="w-full h-full object-cover"
                alt="Cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div class="text-left">
                  <span class="text-[10px] uppercase font-bold text-yellow-400">Cançó de l'any</span>
                </div>
              </div>
            </div>

            <div>
              <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {{ wrappedData?.canco1?.name }}
              </h2>
              <p class="text-base text-white/70 mt-1">
                {{ wrappedData?.canco1?.artists?.map(a => a.name).join(', ') }}
              </p>
            </div>
          </div>
        </transition>

        <!-- SLIDE 6: GÈNERES DOMINANTS -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentSlide === 6" class="text-center space-y-6 max-w-md mx-auto">
            <span class="text-xs font-bold uppercase tracking-widest text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
              Codi Genètic
            </span>
            <h2 class="text-3xl sm:text-5xl font-black">Gènere Rei: <br/><span class="text-pink-400 capitalize">{{ wrappedData?.genere1 }}</span></h2>

            <div class="flex flex-wrap gap-2 justify-center pt-4">
              <span 
                v-for="(g, i) in wrappedData?.top3Generes" 
                :key="i"
                class="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold capitalize text-white/90"
              >
                #{{ i + 1 }} {{ g }}
              </span>
            </div>
          </div>
        </transition>

        <!-- SLIDE 7: AUDIOPRINT (BPM, ENERGIA, BALL) -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentSlide === 7" class="space-y-6 max-w-md mx-auto w-full">
            <div class="text-center space-y-1">
              <span class="text-xs font-bold uppercase tracking-widest text-purple-400">Fisiologia Acústica</span>
              <h2 class="text-2xl sm:text-4xl font-black">El Teu Batec</h2>
            </div>

            <div class="grid grid-cols-2 gap-3 pt-2">
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span class="text-3xl sm:text-4xl font-black text-purple-400">{{ wrappedData?.mitjaBPM }}</span>
                <span class="block text-xs uppercase tracking-wider text-white/50 mt-1">BPM Mitjà</span>
              </div>
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span class="text-3xl sm:text-4xl font-black text-[#1ED760]">{{ wrappedData?.mitjaEnergia }}%</span>
                <span class="block text-xs uppercase tracking-wider text-white/50 mt-1">Energia</span>
              </div>
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span class="text-3xl sm:text-4xl font-black text-cyan-400">{{ wrappedData?.mitjaBall }}%</span>
                <span class="block text-xs uppercase tracking-wider text-white/50 mt-1">Ballabilitat</span>
              </div>
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span class="text-3xl sm:text-4xl font-black text-yellow-400">{{ wrappedData?.mitjaPositivitat }}%</span>
                <span class="block text-xs uppercase tracking-wider text-white/50 mt-1">Positivitat</span>
              </div>
            </div>
          </div>
        </transition>

        <!-- SLIDE 8: PERSONALITAT MUSICAL -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentSlide === 8" class="text-center space-y-6">
            <span class="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Diagnòstic Sonar
            </span>

            <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 mx-auto flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(168,85,247,0.4)]">
              🔮
            </div>

            <div>
              <p class="text-xs uppercase text-white/40 tracking-widest mb-1">El teu arquetip</p>
              <h2 class="text-3xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text">
                {{ wrappedData?.personalitat }}
              </h2>
            </div>

            <p class="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
              La teva selecció acústica reflecteix una inclinació única pel ritme, la textura emocional i l'autenticitat sonora.
            </p>
          </div>
        </transition>

        <!-- SLIDE 9: TARGETA FINAL / RESUM -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentSlide === 9" class="space-y-6 text-center max-w-md mx-auto w-full">
            <div class="p-6 rounded-3xl bg-gradient-to-br from-[#121212] to-[#1e1e1e] border border-white/10 shadow-2xl relative overflow-hidden">
              <div class="flex justify-between items-center mb-6">
                <span class="text-xs font-black tracking-widest text-[#1ED760]">SONARIS WRAPPED</span>
                <span class="text-xs text-white/40">2025/2026</span>
              </div>

              <div class="flex items-center gap-4 text-left mb-6">
                <img 
                  :src="wrappedData?.artista1?.images?.[0]?.url || ''" 
                  class="w-16 h-16 rounded-2xl object-cover border border-white/10"
                />
                <div>
                  <p class="text-xs uppercase text-[#1ED760] font-bold">#1 Artista</p>
                  <p class="font-black text-lg text-white">{{ wrappedData?.artista1?.name }}</p>
                  <p class="text-xs text-white/50">{{ wrappedData?.canco1?.name }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 text-left bg-white/5 p-3 rounded-2xl mb-4 text-xs">
                <div>
                  <span class="text-white/40 block">Arquetip</span>
                  <span class="font-bold text-white">{{ wrappedData?.personalitat }}</span>
                </div>
                <div>
                  <span class="text-white/40 block">Gènere Rei</span>
                  <span class="font-bold text-white capitalize">{{ wrappedData?.genere1 }}</span>
                </div>
              </div>

              <p class="text-[10px] text-white/40">sonaris.app · Dissenyat per Bryan Ruzafa</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                @click="currentSlide = 1" 
                class="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
              >
                ↺ Repetir
              </button>
              <router-link 
                to="/quiz" 
                class="px-6 py-3 rounded-full bg-[#1ED760] text-black font-black text-xs transition shadow-[0_0_20px_rgba(30,215,96,0.3)] hover:scale-105"
              >
                🎮 Jugar al Music Quiz
              </router-link>
            </div>
          </div>
        </transition>

      </div>
    </main>

    <!-- Controls tàctils / Clic navegació -->
    <div class="absolute inset-0 z-10 flex">
      <div @click="prevSlide" class="w-1/3 h-full cursor-w-resize" title="Anterior"></div>
      <div @click="nextSlide" class="w-2/3 h-full cursor-e-resize" title="Següent"></div>
    </div>

    <!-- Footer Controls -->
    <footer class="relative z-20 px-6 pb-6 max-w-4xl mx-auto w-full flex items-center justify-between text-xs text-white/40">
      <span>Toca a l'esquerra / dreta per navegar</span>
      <span>Slide {{ currentSlide }} / {{ totalSlides }}</span>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const totalSlides = 9
const currentSlide = ref(1)
const progressPercent = ref(0)
const carregant = ref(true)
const error = ref(null)
const wrappedData = ref(null)
const isMuted = ref(true)

let timer = null

const slideColors = [
  ['#1ED760', '#06b6d4'],
  ['#10b981', '#3b82f6'],
  ['#8b5cf6', '#ec4899'],
  ['#06b6d4', '#8b5cf6'],
  ['#eab308', '#ef4444'],
  ['#ec4899', '#f97316'],
  ['#8b5cf6', '#10b981'],
  ['#6366f1', '#a855f7'],
  ['#1ED760', '#8b5cf6']
]

const currentSlideColor = computed(() => slideColors[currentSlide.value - 1]?.[0] || '#1ED760')
const currentSlideColorSecondary = computed(() => slideColors[currentSlide.value - 1]?.[1] || '#3b82f6')

const carregarDadesWrapped = async () => {
  carregant.value = true
  error.value = null
  try {
    const res = await fetch('http://localhost:3000/api/dashboard/wrapped', {
      headers: { Authorization: `Bearer ${authStore.tokenAcces}` }
    })
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error recuperant el Wrapped')
    }
    wrappedData.value = await res.json()
    iniciarAutoplay()
  } catch (err) {
    console.error('Error descarregant wrapped:', err)
    error.value = err.message || 'No s\'han pogut recuperar les dades de Spotify.'
  } finally {
    carregant.value = false
  }
}

const iniciarAutoplay = () => {
  clearInterval(timer)
  progressPercent.value = 0
  const step = 2
  const interval = 120 // ~6 segons per slide

  timer = setInterval(() => {
    progressPercent.value += step
    if (progressPercent.value >= 100) {
      nextSlide()
    }
  }, interval)
}

const nextSlide = () => {
  if (currentSlide.value < totalSlides) {
    currentSlide.value++
    progressPercent.value = 0
  } else {
    clearInterval(timer)
  }
}

const prevSlide = () => {
  if (currentSlide.value > 1) {
    currentSlide.value--
    progressPercent.value = 0
  }
}

const toggleAudio = () => {
  isMuted.value = !isMuted.value
}

onMounted(() => {
  carregarDadesWrapped()
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.stars-overlay {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 32px 32px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(1.02);
}
</style>
