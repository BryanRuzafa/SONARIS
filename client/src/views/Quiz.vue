<template>
  <div class="relative min-h-screen bg-[#080808] text-white font-sans flex flex-col justify-between selection:bg-[#1ED760]/30 selection:text-white">
    
    <!-- Fons amb llum ambient -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-[10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[120px] bg-purple-600/10"></div>
      <div class="absolute -bottom-[10%] right-[20%] w-[450px] h-[450px] rounded-full blur-[140px] bg-[#1ED760]/10"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Header -->
    <header class="relative z-10 px-8 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
      <div class="flex items-center gap-3">
        <router-link to="/dashboard" class="flex items-center gap-2 group">
          <div class="w-8 h-8 rounded-full bg-[#1ED760] flex items-center justify-center font-black text-black text-xs">
            S
          </div>
          <span class="font-bold text-sm tracking-wider group-hover:text-[#1ED760] transition">SONARIS QUIZ</span>
        </router-link>
      </div>

      <div class="flex items-center gap-4">
        <div v-if="estatJoc === 'jugant'" class="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-bold">
          <span class="text-white/50">Punts:</span>
          <span class="text-[#1ED760]">{{ puntuacio }}</span>
        </div>
        <router-link to="/dashboard" class="text-xs text-white/50 hover:text-white transition">
          ✕ Sortir
        </router-link>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 flex-1 flex items-center justify-center p-6 max-w-2xl mx-auto w-full">
      
      <!-- PANTALLA 1: INICI -->
      <div v-if="estatJoc === 'inici'" class="text-center space-y-6 w-full animate-fade-in">
        <div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#1ED760] to-cyan-400 mx-auto flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(30,215,96,0.3)]">
          🎮
        </div>

        <div>
          <h1 class="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            Music Quiz Personalitzat
          </h1>
          <p class="text-white/60 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Un test de 7 preguntes generat exclusivament amb el teu historial d'escolta a Spotify.
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-sm mx-auto text-left text-xs space-y-2 text-white/70">
          <div class="flex items-center gap-2">
            <span>⏱️</span>
            <span>15 segons per pregunta</span>
          </div>
          <div class="flex items-center gap-2">
            <span>🎯</span>
            <span>+100 punts per resposta correcta</span>
          </div>
          <div class="flex items-center gap-2">
            <span>⚡</span>
            <span>Bonus de temps addicional</span>
          </div>
        </div>

        <button 
          @click="iniciarQuiz" 
          :disabled="carregantPreguntes"
          class="px-8 py-4 rounded-full bg-[#1ED760] text-black font-black text-sm tracking-wider uppercase transition hover:scale-105 hover:bg-[#1fdf64] shadow-[0_0_30px_rgba(30,215,96,0.4)] disabled:opacity-50"
        >
          {{ carregantPreguntes ? 'Sintonitzant preguntes...' : 'Començar Ara' }}
        </button>
      </div>

      <!-- PANTALLA 2: JUGANT -->
      <div v-else-if="estatJoc === 'jugant'" class="space-y-6 w-full animate-fade-in">
        
        <!-- Header pregunta & Timer -->
        <div class="flex items-center justify-between">
          <span class="text-xs uppercase font-bold tracking-widest text-[#1ED760]">
            Pregunta {{ indexPregunta + 1 }} de {{ preguntes.length }}
          </span>

          <!-- Countdown -->
          <div class="flex items-center gap-2">
            <div 
              class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-colors"
              :class="tempsRestant <= 5 ? 'border-red-500 text-red-400 animate-pulse' : 'border-white/20 text-white'"
            >
              {{ tempsRestant }}
            </div>
          </div>
        </div>

        <!-- Barra de temps -->
        <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-1000 ease-linear"
            :class="tempsRestant <= 5 ? 'bg-red-500' : 'bg-[#1ED760]'"
            :style="{ width: `${(tempsRestant / 15) * 100}%` }"
          ></div>
        </div>

        <!-- Targeta de la pregunta -->
        <div class="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
          
          <div v-if="preguntaActual.imatge" class="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-lg border border-white/10">
            <img :src="preguntaActual.imatge" class="w-full h-full object-cover" />
          </div>

          <h2 class="text-xl sm:text-2xl font-black text-center leading-snug">
            {{ preguntaActual.pregunta }}
          </h2>
        </div>

        <!-- Opcions -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button 
            v-for="(opcio, idx) in preguntaActual.opcions" 
            :key="idx"
            @click="respondre(opcio)"
            :disabled="haRespost"
            :class="[
              'p-4 rounded-2xl border text-left font-bold text-sm transition-all duration-200 flex items-center justify-between',
              obteClasseOpcio(opcio)
            ]"
          >
            <span class="truncate">{{ opcio }}</span>
            <span v-if="haRespost && opcio === preguntaActual.correcta" class="text-base">✅</span>
            <span v-else-if="haRespost && opcio === respostaTriada && opcio !== preguntaActual.correcta" class="text-base">❌</span>
          </button>
        </div>

        <!-- Feedback explicatiu -->
        <div v-if="haRespost" class="p-4 rounded-2xl bg-white/5 border border-white/10 text-center animate-fade-in">
          <p class="text-xs text-white/80 leading-relaxed mb-3">
            {{ preguntaActual.explicacio }}
          </p>
          <button 
            @click="següentPregunta" 
            class="px-6 py-2 rounded-full bg-white text-black font-black text-xs hover:bg-[#1ED760] transition"
          >
            {{ indexPregunta + 1 === preguntes.length ? 'Veure Resultats →' : 'Següent Pregunta →' }}
          </button>
        </div>

      </div>

      <!-- PANTALLA 3: RESULTATS -->
      <div v-else-if="estatJoc === 'final'" class="text-center space-y-6 w-full animate-fade-in max-w-md mx-auto">
        <div class="text-6xl mb-2">{{ iconaFinal }}</div>
        
        <div>
          <span class="text-xs uppercase font-bold tracking-widest text-[#1ED760]">Final del Quiz</span>
          <h2 class="text-3xl sm:text-4xl font-black mt-1">{{ titolFinal }}</h2>
        </div>

        <div class="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3">
          <div class="text-5xl font-black text-white drop-shadow-[0_0_20px_rgba(30,215,96,0.3)]">
            {{ puntuacio }}
          </div>
          <span class="text-xs uppercase tracking-wider text-white/40 block">Punts Totals</span>
          <div class="pt-2 text-xs text-white/70">
            Has encertat <span class="text-[#1ED760] font-bold">{{ encerts }}</span> de <span class="font-bold">{{ preguntes.length }}</span> preguntes!
          </div>
        </div>

        <div class="flex gap-3 justify-center">
          <button 
            @click="iniciarQuiz" 
            class="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
          >
            ↺ Jugar de nou
          </button>
          <router-link 
            to="/wrapped" 
            class="px-6 py-3 rounded-full bg-[#1ED760] text-black font-black text-xs transition hover:scale-105"
          >
            ✨ Veure Wrapped
          </router-link>
        </div>
      </div>

    </main>

    <!-- Footer -->
    <footer class="relative z-10 py-4 text-center border-t border-white/5 text-[11px] text-white/30">
      SONARIS Music Quiz · Generat dinàmicament des del teu Spotify
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const estatJoc = ref('inici') // 'inici', 'jugant', 'final'
const carregantPreguntes = ref(false)
const preguntes = ref([])
const indexPregunta = ref(0)
const tempsRestant = ref(15)
const puntuacio = ref(0)
const encerts = ref(0)
const haRespost = ref(false)
const respostaTriada = ref(null)

let timerInterval = null

const preguntaActual = computed(() => preguntes.value[indexPregunta.value] || {})

const titolFinal = computed(() => {
  const ratio = encerts.value / (preguntes.value.length || 1)
  if (ratio === 1) return 'Coneixedor/a Absolut/a! 🏆'
  if (ratio >= 0.7) return 'Oïda d\'Or 🎧'
  if (ratio >= 0.4) return 'Bon Ritme 🎵'
  return 'Toca escoltar més atenció! 📻'
})

const iconaFinal = computed(() => {
  const ratio = encerts.value / (preguntes.value.length || 1)
  if (ratio >= 0.8) return '👑'
  if (ratio >= 0.5) return '🔥'
  return '🌱'
})

const iniciarQuiz = async () => {
  carregantPreguntes.value = true
  try {
    const res = await fetch('http://localhost:3000/api/dashboard/quiz/preguntes', {
      headers: { Authorization: `Bearer ${authStore.tokenAcces}` }
    })
    if (res.ok) {
      const data = await res.json()
      if (data?.preguntes?.length) {
        preguntes.value = data.preguntes
        indexPregunta.value = 0
        puntuacio.value = 0
        encerts.value = 0
        estatJoc.value = 'jugant'
        carregarNovaPregunta()
      }
    }
  } catch (err) {
    console.error('Error descarregant preguntes:', err)
  } finally {
    carregantPreguntes.value = false
  }
}

const carregarNovaPregunta = () => {
  haRespost.value = false
  respostaTriada.value = null
  tempsRestant.value = 15
  clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    if (tempsRestant.value > 0) {
      tempsRestant.value--
    } else {
      clearInterval(timerInterval)
      tempsEsgotat()
    }
  }, 1000)
}

const respondre = (opcio) => {
  if (haRespost.value) return
  clearInterval(timerInterval)
  haRespost.value = true
  respostaTriada.value = opcio

  if (opcio === preguntaActual.value.correcta) {
    encerts.value++
    const puntsBase = 100
    const puntsBonus = tempsRestant.value * 5
    puntuacio.value += (puntsBase + puntsBonus)
  }
}

const tempsEsgotat = () => {
  haRespost.value = true
  respostaTriada.value = null
}

const següentPregunta = () => {
  if (indexPregunta.value + 1 < preguntes.value.length) {
    indexPregunta.value++
    carregarNovaPregunta()
  } else {
    clearInterval(timerInterval)
    estatJoc.value = 'final'
  }
}

const obteClasseOpcio = (opcio) => {
  if (!haRespost.value) {
    return 'bg-white/5 border-white/10 hover:border-[#1ED760]/50 hover:bg-white/10'
  }
  if (opcio === preguntaActual.value.correcta) {
    return 'bg-[#1ED760]/20 border-[#1ED760] text-[#1ED760]'
  }
  if (opcio === respostaTriada.value && opcio !== preguntaActual.value.correcta) {
    return 'bg-red-500/20 border-red-500 text-red-400'
  }
  return 'bg-white/5 border-white/5 opacity-40'
}

onUnmounted(() => {
  clearInterval(timerInterval)
})
</script>

<style scoped>
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
