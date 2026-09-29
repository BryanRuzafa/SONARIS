<template>
  <div class="min-h-screen bg-[#121212] text-white font-sans flex selection:bg-[#1ED760]/30 selection:text-white" :class="{'estalvi-energia': estalviEnergia}">

    <!-- Barra lateral de navegació -->
    <nav class="fixed top-0 left-0 h-full w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col py-8 px-4 z-50">
      <!-- Logo -->
      <div class="flex items-center gap-3 mb-10 px-2 cursor-default">
        <div class="relative w-8 h-8 flex items-center justify-center bg-[#181818] rounded-full border border-[#1ED760]/30 shadow-[0_0_10px_rgba(30,215,96,0.2)]">
            <svg class="w-4 h-4 text-[#1ED760]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
        </div>
        <span class="text-xl font-bold tracking-tight text-white">SONARIS</span>
      </div>

      <!-- Navegació principal -->
      <div class="space-y-1 flex-1">
        <button
          v-for="seccio in seccionsNav"
          :key="seccio.id"
          @click="seccioActiva = seccio.id"
          :class="[
            'w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
            seccioActiva === seccio.id
              ? 'bg-[#282828] text-white font-bold'
              : 'text-[#B3B3B3] hover:text-white hover:bg-[#181818]'
          ]"
        >
          <span :class="seccioActiva === seccio.id ? 'text-[#1ED760]' : 'text-[#B3B3B3]' " v-html="seccio.icona"></span>
          {{ seccio.etiqueta }}
        </button>
      </div>

      <!-- Perfil i tancament de sessió -->
      <div class="border-t border-white/5 pt-6 mt-4">
        <div class="flex items-center gap-3 px-2 mb-4">
          <img
            v-if="infoUsuari?.images?.[0]?.url"
            :src="infoUsuari.images[0].url"
            class="w-10 h-10 rounded-full border border-white/5 shadow-md"
            alt="Foto de perfil"
          />
          <div v-else class="w-10 h-10 rounded-full bg-[#282828] flex items-center justify-center text-white font-bold">
            {{ infoUsuari?.display_name?.[0]?.toUpperCase() || '?' }}
          </div>
          <div class="truncate">
            <p class="text-sm font-bold text-white truncate">{{ infoUsuari?.display_name || 'Usuari' }}</p>
            <p class="text-[11px] text-[#1ED760] font-medium tracking-wide">Spotify Connectat</p>
          </div>
        </div>
        <button
          @click="tancarSessioApp"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-[#B3B3B3] hover:text-white hover:bg-[#282828] transition-all"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Tancar sessió
        </button>
      </div>
    </nav>

    <!-- Contingut principal -->
    <main class="ml-64 flex-1 p-8 sm:p-10 min-h-screen">

      <!-- Capçalera amb filtre de termini i Estalvi Energia -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div class="flex items-center gap-4">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-white">
              {{ seccionsNav.find(s => s.id === seccioActiva)?.etiqueta }}
            </h1>
            <p class="text-[#B3B3B3] text-sm mt-1">{{ seccionsNav.find(s => s.id === seccioActiva)?.descripcio }}</p>
          </div>
          <!-- Botó Estalvi Energia (Subtil) -->
          <button @click="estalviEnergia = !estalviEnergia" 
                  class="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors text-xs font-bold whitespace-nowrap cursor-pointer shadow-sm"
                  :class="estalviEnergia ? 'bg-[#1ED760]/10 text-[#1ED760] border-[#1ED760]/30' : 'bg-[#181818] text-[#B3B3B3] border-white/5 hover:bg-[#282828] hover:text-white'"
                  title="Atura animacions 3D i anàlisi d'audio constant">
             <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             {{ estalviEnergia ? 'Mode Eco Actiu' : 'Estalvi Energia' }}
          </button>
        </div>

        <!-- Filtre de termini temporal (només visible al dashboard) -->
        <div v-if="seccioActiva === 'dashboard'" class="flex gap-2 p-1 bg-[#181818] rounded-full border border-white/5">
          <button
            v-for="termini in terminis"
            :key="termini.valor"
            @click="canviarTermini(termini.valor)"
            :class="[
              'px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200',
              terminiActual === termini.valor
                ? 'bg-[#282828] text-white shadow-sm'
                : 'text-[#B3B3B3] hover:text-white'
            ]"
          >
            {{ termini.etiqueta }}
          </button>
        </div>
      </header>

      <!-- SECCIÓ: DASHBOARD ANALÍTIC -->
      <div v-if="seccioActiva === 'dashboard'">
        
        <div class="mb-8 p-8 bg-[#181818] border border-white/5 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6 group hover:bg-[#202020] transition-colors">
          <!-- Icona Esquerra (Estil Premium Muted) -->
          <div class="bg-[#282828] p-4 rounded-xl flex-shrink-0 hidden md:flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>

          <!-- Contingut -->
          <div class="flex-1 flex flex-col justify-center gap-3">
             <h3 class="text-[11px] font-bold text-[#B3B3B3] tracking-widest uppercase truncate">
                La dada del dia · Gemini AI
             </h3>
             
             <!-- Text de Dada -->
             <div v-if="carregantDadaIA" class="py-2">
                 <div class="animate-pulse flex gap-2 w-1/2 h-4 bg-[#282828] rounded"></div>
             </div>
             <p v-else-if="dadaDelDia" class="text-white text-lg font-bold leading-relaxed max-w-4xl tracking-tight">{{ dadaDelDia }}</p>
             <p v-else class="text-[#B3B3B3] italic text-sm">No hem pogut carregar l'anàlisi de l'IA avui.</p>

             <!-- Controls IA inferiors -->
             <div class="flex flex-wrap gap-3 mt-4 mb-1">
                <button 
                   @click="regenerarDada(false)" 
                   :disabled="carregantDadaIA || carregant"
                   class="px-4 py-2 bg-transparent border border-white/20 text-white text-xs font-bold rounded-full hover:border-white hover:scale-105 transition disabled:opacity-50 flex items-center gap-2"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> Altra dada
                </button>
                <button 
                   @click="regenerarDada(true)" 
                   :disabled="carregantDadaIA || carregant"
                   class="px-4 py-2 bg-transparent border border-[#ff4d4d]/30 text-[#ff4d4d] text-xs font-bold rounded-full hover:bg-[#ff4d4d]/10 transition disabled:opacity-50 flex items-center gap-2"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg> Roast Me
                </button>
             </div>
          </div>
        </div>

        <div v-if="carregant" class="flex flex-col items-center justify-center py-24">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-signal mb-4"></div>
          <p class="text-gray-400">Carregant dades de Spotify...</p>
        </div>

        <div v-else-if="errorDades" class="text-center py-16 text-red-400">
          <p class="text-lg">Error carregant les dades.</p>
          <p class="text-sm text-gray-500 mt-2">{{ errorDades }}</p>
        </div>

        <div v-else>
          <!-- Mètriques Ràpides (Minuts i Obscuritat) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="p-6 bg-[#181818] border border-white/5 rounded-2xl flex flex-col justify-center hover:bg-[#202020] transition-colors">
               <p class="text-xs text-[#B3B3B3] uppercase tracking-widest font-bold mb-2">Minuts Escolats</p>
               <p class="text-3xl font-bold text-white tracking-tight">{{ typeof minutsEscoltats === 'number' ? minutsEscoltats.toLocaleString() : 0 }} <span class="text-sm text-[#B3B3B3] font-medium tracking-normal">min</span></p>
            </div>
            <div class="p-6 bg-[#181818] border border-white/5 rounded-2xl flex flex-col justify-center hover:bg-[#202020] transition-colors">
               <p class="text-xs text-[#B3B3B3] uppercase tracking-widest font-bold mb-2">Temps Actiu</p>
               <p class="text-3xl font-bold text-white tracking-tight">{{ diesActiu || 1 }} <span class="text-sm text-[#B3B3B3] font-medium tracking-normal">dies</span></p>
            </div>
            <div class="p-6 bg-[#181818] border border-white/5 rounded-2xl flex flex-col justify-center col-span-1 md:col-span-2 relative overflow-hidden group hover:border-[#1ED760]/30 transition-colors">
               <!-- Obscuritat Bar -->
               <div class="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#1ED760]/5 to-transparent pointer-events-none"></div>
               <p class="text-xs text-[#1ED760] uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  Nivell d'Obscuritat (Underground)
               </p>
               <div class="flex items-center gap-4 relative z-10">
                 <div class="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                   <div class="h-full bg-gradient-to-r from-gray-500 to-[#1ED760] rounded-full transition-all duration-1000" :style="{ width: `${obscuritat || 0}%` }"></div>
                 </div>
                 <span class="text-2xl font-bold text-white">{{ obscuritat || 0 }}%</span>
               </div>
               <p class="text-[11px] text-[#B3B3B3] mt-3">Mesura com de desconeguts són els teus artistes preferits globals.</p>
            </div>
          </div>

          <!-- Anàlisi d'ADN Musical -->
          <div v-if="adnMusical" class="mb-6 p-6 bg-[#181818] border border-white/5 rounded-2xl">
             <h3 class="text-xs font-bold text-[#B3B3B3] mb-2 tracking-widest uppercase">El teu ADN Musical</h3>
             <p class="text-sm text-gray-400 mb-6">Anàlisi d'Audio Features del teu estat actual segons les cançons més escoltades.</p>
             <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                <!-- Danceability -->
                <div class="flex flex-col gap-2">
                   <div class="flex justify-between items-end">
                      <span class="text-sm font-bold text-white">Bailable</span>
                      <span class="text-xs text-white">{{ adnMusical.danceability }}%</span>
                   </div>
                   <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div class="h-full bg-[#1ED760] rounded-full" :style="{ width: `${adnMusical.danceability}%` }"></div>
                   </div>
                </div>
                <!-- Energy -->
                <div class="flex flex-col gap-2">
                   <div class="flex justify-between items-end">
                      <span class="text-sm font-bold text-white">Energia</span>
                      <span class="text-xs text-white">{{ adnMusical.energy }}%</span>
                   </div>
                   <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div class="h-full bg-[#1ED760] rounded-full" :style="{ width: `${adnMusical.energy}%` }"></div>
                   </div>
                </div>
                <!-- Valence -->
                <div class="flex flex-col gap-2">
                   <div class="flex justify-between items-end">
                      <span class="text-sm font-bold text-white">Positivitat</span>
                      <span class="text-xs text-white">{{ adnMusical.valence }}%</span>
                   </div>
                   <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div class="h-full bg-[#1ED760] rounded-full" :style="{ width: `${adnMusical.valence}%` }"></div>
                   </div>
                </div>
                <!-- Acousticness -->
                <div class="flex flex-col gap-2">
                   <div class="flex justify-between items-end">
                      <span class="text-sm font-bold text-white">Acústica</span>
                      <span class="text-xs text-white">{{ adnMusical.acousticness }}%</span>
                   </div>
                   <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div class="h-full bg-[#1ED760] rounded-full" :style="{ width: `${adnMusical.acousticness}%` }"></div>
                   </div>
                </div>
             </div>
          </div>

          <!-- Gràfic de gèneres + Top Artistes -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            <!-- Gràfic de radar de gèneres -->
            <div class="lg:col-span-1 p-8 bg-[#181818] border border-white/5 rounded-2xl flex flex-col items-center">
              <h3 class="text-xs font-bold text-[#B3B3B3] mb-1 tracking-widest uppercase self-start">Gèneres Principals</h3>
              <p class="text-sm text-gray-400 mb-8 font-medium self-start">Mapa de gèneres del teu top</p>
              <div v-if="dadesRadar" class="w-full max-w-[280px] aspect-square relative mt-4">
                <Radar :data="dadesRadar" :options="opcionsRadar" />
              </div>
              <p v-else class="text-sm text-gray-500 mt-10">Sense dades de gèneres disponibles.</p>
            </div>

            <!-- Top Artistes -->
            <div class="lg:col-span-2 p-8 bg-[#181818] border border-white/5 rounded-2xl">
              <h3 class="text-xs font-bold text-[#B3B3B3] mb-1 tracking-widest uppercase">Top Artistes</h3>
              <p class="text-sm text-gray-400 mb-8 font-medium">Els artistes que més has escoltat</p>
              <div class="space-y-4">
                <div
                  v-for="(artista, index) in topArtistes"
                  :key="artista.id"
                  class="flex items-center gap-4 group hover:bg-white/5 p-2 rounded-xl transition-colors cursor-default"
                >
                  <span class="text-base font-bold text-[#B3B3B3] w-6 text-right">{{ index + 1 }}</span>
                  <img
                    :src="artista.images?.[1]?.url || artista.images?.[0]?.url"
                    :alt="artista.name"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div class="flex-1 min-w-0 flex flex-col justify-center">
                    <p class="font-bold text-base text-white truncate">{{ artista.name }}</p>
                    <p class="text-[13px] text-[#B3B3B3] capitalize truncate mt-0.5">{{ artista.genres.slice(0, 3).join(', ') || 'Sense gènere' }}</p>
                  </div>
                  <!-- Barra de popularitat (Score) -->
                  <div class="flex items-center gap-3">
                    <div class="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                      <div
                        class="h-full bg-[#1ED760] rounded-full"
                        :style="{ width: `${artista.popularity}%` }"
                      ></div>
                    </div>
                    <span class="text-xs font-bold text-white w-6 text-right">{{ artista.popularity }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Cançons -->
          <div class="p-8 bg-[#181818] border border-white/5 rounded-2xl">
            <h3 class="text-xs font-bold text-[#B3B3B3] mb-1 tracking-widest uppercase">Top Cançons</h3>
            <p class="text-sm text-gray-400 mb-6 font-medium">Les cançons que has repetit més</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              <div
                v-for="(cancio, index) in topCancions"
                :key="cancio.id"
                class="flex items-center gap-4 p-2.5 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <span class="text-sm font-bold text-[#B3B3B3] w-5 text-right opacity-0 group-hover:opacity-100 transition-opacity absolute">▶</span>
                <span class="text-sm font-bold text-[#B3B3B3] w-5 text-right group-hover:opacity-0 transition-opacity">{{ index + 1 }}</span>
                <img
                  :src="cancio.album.images?.[2]?.url || cancio.album.images?.[0]?.url"
                  :alt="cancio.name"
                  class="w-10 h-10 rounded shadow-sm object-cover"
                />
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-[15px] text-white truncate">{{ cancio.name }}</p>
                  <p class="text-[13px] text-[#B3B3B3] hover:text-white truncate transition-colors">
                    {{ cancio.artists.map(a => a.name).join(', ') }}
                  </p>
                </div>
                <span class="text-[13px] text-[#B3B3B3] ml-auto shrink-0 font-medium">
                  {{ formatarDurada(cancio.duration_ms) }}
                </span>
              </div>
            </div>
          </div>

          <!-- NOUS GRÀFICS: Evolució Temporal i Anàlisi de Freqüències -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-6">
            <!-- Line Chart: Evolució Escoltes -->
            <div class="p-8 bg-[#181818] border border-white/5 rounded-2xl flex flex-col items-center group hover:bg-[#202020] transition-colors">
               <h3 class="text-xs font-bold text-[#B3B3B3] mb-1 tracking-widest uppercase self-start">Pujades i Baixades</h3>
               <p class="text-sm text-gray-400 mb-6 font-medium self-start">La teva activitat d'escolta als darrers 6 mesos</p>
               <div class="w-full h-64 mt-2">
                 <Line :data="dadesEvolucio" :options="opcionsEvolucio" />
               </div>
            </div>

            <!-- Bar Chart: Balanç Freqüencial -->
            <div class="p-8 bg-[#181818] border border-white/5 rounded-2xl flex flex-col items-center group hover:bg-[#202020] transition-colors">
               <h3 class="text-xs font-bold text-[#B3B3B3] mb-1 tracking-widest uppercase self-start">Balanç d'Energia</h3>
               <p class="text-sm text-gray-400 mb-6 font-medium self-start">Distribució d'energia i positivitat per dies de la setmana</p>
               <div class="w-full h-64 mt-2">
                 <Bar :data="dadesEnergiaSetmanal" :options="opcionsBarres" />
               </div>
            </div>
          </div>

        </div>
      </div>

      <!-- SECCIÓ: PLAYLISTS (Netejador Quirúrgic) -->
      <div v-if="seccioActiva === 'playlists'" class="p-8 bg-[#181818] border border-white/5 rounded-2xl">

        <!-- Capçalera -->
        <div class="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h2 class="text-2xl font-black text-white mb-1 tracking-tight">Netejador de Playlists</h2>
            <p class="text-[#B3B3B3] font-medium text-sm">Escaneig automàtic de totes les llistes. Badge de duplicats per cada una. Eliminació amb un clic.</p>
          </div>
          <button
            v-if="!carregantPlaylists && !escaneigMassiuActiu"
            @click="escanejarTotes"
            class="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#1ED760] text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-[#1fdf64] transition shadow-md"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Escanejar Tot
          </button>
        </div>

        <!-- Barra de progrés global d'escaneig -->
        <div v-if="escaneigMassiuActiu" class="mb-6 bg-[#282828] rounded-xl p-4 border border-white/5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-bold text-[#1ED760]">Escanejant playlists... {{ progrésEscaneig.actual }}/{{ progrésEscaneig.total }}</p>
            <span class="text-xs text-[#B3B3B3]">{{ progrésEscaneig.total ? Math.round((progrésEscaneig.actual / progrésEscaneig.total) * 100) : 0 }}%</span>
          </div>
          <div class="w-full bg-[#181818] rounded-full h-2 overflow-hidden">
            <div class="h-full bg-[#1ED760] rounded-full transition-all duration-300" :style="{ width: `${progrésEscaneig.total ? (progrésEscaneig.actual / progrésEscaneig.total) * 100 : 0}%` }"></div>
          </div>
          <p class="text-[11px] text-[#B3B3B3] mt-2 truncate">{{ progrésEscaneig.nomActual }}</p>
        </div>

        <!-- Resum global post-escaneig -->
        <div v-if="Object.keys(duplicatsPerPlaylist).length > 0 && !escaneigMassiuActiu && !playlistSeleccionada" class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-[#282828] rounded-xl p-4 border border-white/5 text-center">
            <p class="text-2xl font-black text-white">{{ llistaPlaylists.length }}</p>
            <p class="text-[10px] text-[#B3B3B3] uppercase tracking-widest mt-1">Playlists</p>
          </div>
          <div class="bg-[#282828] rounded-xl p-4 border border-[#1ED760]/20 text-center">
            <p class="text-2xl font-black text-[#1ED760]">{{ playlistsNetes }}</p>
            <p class="text-[10px] text-[#B3B3B3] uppercase tracking-widest mt-1">Netes</p>
          </div>
          <div class="bg-[#282828] rounded-xl p-4 border border-red-500/20 text-center">
            <p class="text-2xl font-black text-red-400">{{ totalDuplicatsGlobal }}</p>
            <p class="text-[10px] text-[#B3B3B3] uppercase tracking-widest mt-1">Duplicats</p>
          </div>
        </div>

        <div v-if="carregantPlaylists" class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1ED760] mx-auto mb-4"></div>
          <p class="text-sm font-bold text-[#B3B3B3] uppercase tracking-wider">Carregant les teves llistes...</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- COL ESQUERRA: Llista de totes les playlists -->
          <div class="flex flex-col gap-3">

            <!-- Opcions d'anàlisi (col·lapsable) -->
            <div class="bg-[#282828] rounded-xl border border-white/5 overflow-hidden">
              <button @click="opcionsAvançadesObertes = !opcionsAvançadesObertes" class="w-full flex items-center justify-between p-3.5 hover:bg-[#333] transition text-sm">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-[#B3B3B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  <span class="font-bold text-white">Opcions d'anàlisi</span>
                  <span class="text-[10px] bg-white/10 text-[#B3B3B3] px-2 py-0.5 rounded-full font-bold capitalize">{{ modeAnalisi }}</span>
                </div>
                <svg class="w-4 h-4 text-[#B3B3B3] transition-transform" :class="{'rotate-180': opcionsAvançadesObertes}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div :class="opcionsAvançadesObertes ? 'max-h-[260px] p-4 border-t border-white/5' : 'max-h-0 overflow-hidden'" class="transition-all duration-200 text-xs">
                <div class="space-y-4">
                  <!-- Criteri d'anàlisi -->
                  <div>
                    <p class="font-black text-[#B3B3B3] uppercase tracking-widest mb-2.5 text-[10px]">Criteri d'anàlisi</p>
                    <div class="flex items-center gap-3 bg-[#1a1a1a] rounded-lg p-3">
                      <span :class="modeAnalisi === 'estricte' ? 'text-white font-bold' : 'text-gray-500'" class="text-xs flex-1">ID exacte</span>
                      <label class="relative inline-block w-10 h-5 cursor-pointer flex-shrink-0">
                        <input type="checkbox" :checked="modeAnalisi === 'difus'" @change="modeAnalisi = $event.target.checked ? 'difus' : 'estricte'" class="sr-only peer">
                        <span class="absolute inset-0 bg-[#383838] rounded-full transition peer-checked:bg-[#5D47FF] before:absolute before:content-[''] before:h-4 before:w-4 before:left-0.5 before:top-0.5 before:bg-white before:rounded-full before:transition-transform peer-checked:before:translate-x-5"></span>
                      </label>
                      <span :class="modeAnalisi === 'difus' ? 'text-[#7B61FF] font-bold' : 'text-gray-500'" class="text-xs flex-1 text-right">Per nom</span>
                    </div>
                  </div>

                  <!-- Tolerància (mode difús) -->
                  <div :class="modeAnalisi === 'difus' ? 'opacity-100' : 'opacity-30 pointer-events-none'">
                    <p class="font-black text-[#B3B3B3] uppercase tracking-widest mb-2 text-[10px]">Tolerància de durada: <span class="text-white">{{ toleranciaTemps }}s</span></p>
                    <input type="range" v-model="toleranciaTemps" min="1" max="10" class="w-full h-1.5 bg-[#404040] rounded-lg appearance-none cursor-pointer accent-[#7B61FF]">
                    <div class="flex justify-between text-[9px] text-gray-600 mt-1"><span>1s</span><span>10s</span></div>
                  </div>

                  <!-- Conservar + Mode simulacre en la mateixa fila -->
                  <div class="flex items-center gap-4">
                    <div class="flex-1">
                      <p class="font-black text-[#B3B3B3] uppercase tracking-widest mb-1.5 text-[10px]">Conservar</p>
                      <div class="flex gap-1.5">
                        <button @click="estrategiaConservacio = 'antiga'" :class="['flex-1 py-1.5 rounded-lg font-bold text-xs transition', estrategiaConservacio === 'antiga' ? 'bg-white text-black' : 'bg-[#383838] text-[#B3B3B3] hover:text-white']">1ª afegida</button>
                        <button @click="estrategiaConservacio = 'nova'" :class="['flex-1 py-1.5 rounded-lg font-bold text-xs transition', estrategiaConservacio === 'nova' ? 'bg-white text-black' : 'bg-[#383838] text-[#B3B3B3] hover:text-white']">Última</button>
                      </div>
                    </div>
                    <label class="flex items-center gap-2 cursor-pointer mt-4">
                      <input type="checkbox" v-model="modeSimulacre" class="w-3.5 h-3.5 accent-yellow-500 rounded">
                      <div>
                        <p class="font-bold text-[#B3B3B3] hover:text-yellow-400 transition text-[10px] uppercase tracking-wider">Simulacre</p>
                        <p class="text-[9px] text-gray-600">Sense esborrar res</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Llista playlists estil spotify-dedup -->
            <div class="space-y-1.5 max-h-[480px] overflow-y-auto custom-scrollbar pr-0.5">
              <div
                v-for="playlist in llistaPlaylists"
                :key="playlist.id"
                class="flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer group"
                :class="[
                  playlistSeleccionada === playlist.id ? 'bg-white/10 border-white/20' :
                  (duplicatsPerPlaylist[playlist.id] || 0) > 0 ? 'bg-[#282828] border-red-500/20 hover:border-red-500/40' :
                  estatEscaneig[playlist.id] === 'net' ? 'bg-[#282828] border-[#1ED760]/15 hover:border-[#1ED760]/30' :
                  'bg-[#282828] border-white/5 hover:border-white/15'
                ]"
                @click="analitzarPlaylist(playlist.id)"
              >
                <img v-if="playlist.images?.length" :src="playlist.images[0].url" class="w-10 h-10 rounded-lg object-cover shadow-md flex-shrink-0" alt="Portada" />
                <div v-else class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-white text-[13px] truncate leading-tight">{{ playlist.name }}</p>
                  <p class="text-[11px] text-[#B3B3B3]">{{ playlist.tracks.total }} cançons</p>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <div v-if="estatEscaneig[playlist.id] === 'escanejant'" class="w-4 h-4 border-2 border-[#B3B3B3]/20 border-t-[#1ED760] rounded-full animate-spin"></div>
                  <svg v-else-if="estatEscaneig[playlist.id] === 'net'" class="w-4 h-4 text-[#1ED760]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  <div v-else-if="(duplicatsPerPlaylist[playlist.id] || 0) > 0" class="flex items-center gap-1.5">
                    <span class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-red-500 text-white text-[10px] font-black rounded-full">{{ duplicatsPerPlaylist[playlist.id] }}</span>
                    <button @click.stop="fixRapid(playlist.id)" :disabled="netejantPlaylists" class="px-2.5 py-1 bg-red-500 hover:bg-red-400 text-white text-[10px] font-black uppercase rounded-full transition active:scale-95 disabled:opacity-50">Fix</button>
                  </div>
                  <svg v-else class="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>
          </div>

          <!-- COL DRETA: Detall / Resultats -->
          <div class="bg-[#282828] rounded-2xl border border-white/5 flex flex-col min-h-[400px] overflow-hidden">

            <!-- Vista de detall d'una playlist -->
            <div v-if="playlistSeleccionada && !analitzantPlaylists && duplicatsTrobats" class="flex flex-col h-full">
              <!-- Capçalera detall -->
              <div class="p-4 border-b border-white/5 flex items-center gap-3">
                <button @click="playlistSeleccionada = null; duplicatsTrobats = null" class="text-[#B3B3B3] hover:text-white transition p-1 rounded-lg hover:bg-white/5">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div class="flex-1 min-w-0">
                  <p class="font-black text-white text-sm truncate">{{ llistaPlaylists.find(p => p.id === playlistSeleccionada)?.name }}</p>
                </div>
              </div>

              <!-- Llista neta -->
              <div v-if="duplicatsTrobats.duplicats.length === 0" class="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
                <div class="w-14 h-14 bg-[#1ED760]/10 rounded-full flex items-center justify-center">
                  <svg class="w-7 h-7 text-[#1ED760]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 class="font-black text-white text-lg">Llista neta </h3>
                <p class="text-sm text-[#B3B3B3]">Cap duplicat detectat.</p>
              </div>

              <!-- Duplicats trobats -->
              <div v-else class="flex flex-col h-full p-4 gap-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-black text-white">{{ duplicatsTrobats.duplicats.length }} duplicats</p>
                    <p class="text-[11px] text-[#B3B3B3]">{{ duplicatsTrobats.totalDuplicats }} entrades extra</p>
                  </div>
                  <button @click="netejarPlaylist" :disabled="netejantPlaylists" :class="['px-4 py-2 font-black tracking-widest text-xs uppercase rounded-full transition disabled:opacity-50 flex items-center gap-1.5', modeSimulacre ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400' : 'bg-[#1ED760] text-black hover:bg-[#1fdf64] active:scale-95']">
                    <span v-if="netejantPlaylists" class="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-current"></span>
                    <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    {{ netejantPlaylists ? 'Netejant...' : (modeSimulacre ? 'Simulacre' : 'Fix') }}
                  </button>
                </div>

                <div class="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-0.5">
                  <div v-for="grup in duplicatsTrobats.duplicats" :key="grup.clau" class="bg-[#181818] rounded-xl border border-white/5 overflow-hidden">
                    <div class="flex items-center gap-2.5 p-3">
                      <div class="w-7 h-7 rounded-lg bg-[#1ED760]/10 flex items-center justify-center flex-shrink-0 text-[9px] font-black text-[#1ED760]">OK</div>
                      <div class="flex-1 min-w-0">
                        <p class="font-bold text-white text-[12px] truncate">{{ grup.original.name }}</p>
                        <p class="text-[10px] text-[#B3B3B3]">{{ grup.original.artists[0].name }}</p>
                      </div>
                      <span class="text-[9px] font-black text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">{{ grup.copies.length + 1 }}</span>
                    </div>
                    <div class="border-t border-white/5 bg-black/20">
                      <div v-for="copia in grup.copies" :key="copia.posicio_original" class="flex items-center gap-2 px-3 py-1.5 text-[10px] text-[#B3B3B3]">
                        <span class="text-red-400/50"></span>
                        <span>Còpia · posició #{{ copia.posicio_original + 1 }}</span>
                        <span class="ml-auto text-red-400 font-bold">Eliminar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading -->
            <div v-else-if="analitzantPlaylists" class="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
              <div class="w-10 h-10 border-4 border-[#282828] border-t-[#1ED760] rounded-full animate-spin"></div>
              <p class="text-[#1ED760] font-bold text-sm">Analitzant duplicats...</p>
            </div>

            <!-- Estat buit / Resum global -->
            <div v-else class="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
              <div v-if="totalDuplicatsGlobal > 0 && !escaneigMassiuActiu">
                <div class="text-5xl font-black text-red-400 mb-2">{{ totalDuplicatsGlobal }}</div>
                <p class="text-[#B3B3B3] text-sm mb-4">duplicats trobats en total</p>
                <div class="grid grid-cols-2 gap-3 text-center mb-4">
                  <div class="bg-[#181818] rounded-xl p-3 border border-white/5">
                    <p class="text-xl font-black text-[#1ED760]">{{ playlistsNetes }}</p>
                    <p class="text-[10px] text-[#B3B3B3] mt-1">Netes</p>
                  </div>
                  <div class="bg-[#181818] rounded-xl p-3 border border-red-500/20">
                    <p class="text-xl font-black text-red-400">{{ playlistsAmbDuplicats }}</p>
                    <p class="text-[10px] text-[#B3B3B3] mt-1">Amb duplicats</p>
                  </div>
                </div>
                <p class="text-[11px] text-gray-500">Clica una playlist <span class="text-red-400">roja</span> per veure el detall<br>o fes clic a <strong class="text-white">Fix</strong> per netejar-la directament.</p>
              </div>
              <div v-else-if="!escaneigMassiuActiu" class="flex flex-col items-center gap-4">
                <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                  <svg class="w-8 h-8 text-[#B3B3B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                </div>
                <p class="font-black text-white text-lg">Escaneig automàtic</p>
                <p class="text-[#B3B3B3] text-sm max-w-[200px]">Comprova totes les teves playlists alhora, com spotify-dedup.</p>
                <button @click="escanejarTotes" class="px-6 py-3 bg-[#1ED760] text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-[#1fdf64] transition shadow-lg">
                  Escanejar totes
                </button>
              </div>
              <div v-else class="text-center">
                <div class="w-10 h-10 border-4 border-[#282828] border-t-[#1ED760] rounded-full animate-spin mx-auto mb-3"></div>
                <p class="text-[#1ED760] font-bold text-sm">Escanejant {{ progrésEscaneig.actual }}/{{ progrésEscaneig.total }}...</p>
              </div>
            </div>
          </div>

        </div>
      </div>


      <!-- SECCIÓ: RADAR UNDERGROUND -->
      <div v-if="seccioActiva === 'radar_underground'" class="p-8 bg-[#181818] border border-white/5 rounded-2xl">
        <h2 class="text-2xl font-black text-white mb-2 tracking-tight">Radar Underground</h2>
        <p class="text-[#B3B3B3] mb-8 font-medium">Mentre dorms, la IA busca artistes desconeguts dels teus generes i en crea una llista exclusiva.</p>
        <div v-if="!radarCarregat" class="text-center py-10"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-4"></div></div>
        <div v-else class="max-w-2xl mx-auto bg-[#1a1a1a] p-8 rounded-2xl border border-white/10 shadow-2xl">
           <div class="space-y-8">
              <!-- Targeta d'estat del Radar -->
              <div class="flex items-center justify-between p-5 bg-[#222] rounded-xl border transition-all duration-300" :class="configRadar.radar_actiu ? 'border-[#1ED760]/40 shadow-[0_0_15px_rgba(30,215,96,0.1)]' : 'border-white/5'">
                 <div>
                    <h3 class="font-bold text-white text-lg flex items-center gap-2">
                       Estat del Radar
                       <span v-if="configRadar.radar_actiu" class="w-2 h-2 rounded-full bg-[#1ED760] animate-pulse"></span>
                    </h3>
                    <p class="text-[13px] text-[#B3B3B3]">Activa o desactiva l'execucio automatica de matinada.</p>
                 </div>
                 <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="configRadar.radar_actiu" class="sr-only peer">
                    <div class="w-14 h-7 bg-[#383838] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#1ED760]"></div>
                 </label>
              </div>

              <!-- Límit de Popularitat -->
              <div :class="!configRadar.radar_actiu ? 'opacity-40 grayscale pointer-events-none' : ''" class="transition-opacity duration-300">
                 <div class="flex justify-between items-end mb-3">
                    <div>
                       <h3 class="font-bold text-white text-[15px]">Límit de Fama</h3>
                       <p class="text-[12px] text-gray-400">Més baix vol dir artistes amb menys oients. Recomanat: 30</p>
                    </div>
                    <span class="text-[#1ED760] px-3 py-1.5 rounded-lg bg-[#1ED760]/10 border border-[#1ED760]/20 text-[14px] shadow-sm tracking-tight font-black">{{ famaEstimada }}</span>
                 </div>
                 <div class="py-6">
                    <input type="range" v-model="configRadar.limit_popularitat" min="1" max="50" class="w-full h-4 bg-[#2a2a2a] rounded-full appearance-none cursor-pointer outline-none shadow-inner 
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-[#1ED760] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                           [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:bg-[#1ED760] [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform">
                 </div>
              </div>

              <!-- Dia de la Setmana -->
              <div :class="!configRadar.radar_actiu ? 'opacity-40 grayscale pointer-events-none' : ''" class="transition-opacity duration-300">
                 <div class="mb-3">
                    <h3 class="font-bold text-white text-[15px]">Dia d'Execució <span class="text-xs font-normal text-gray-500 ml-2">Quan vols que es generi la llista de descobriments?</span></h3>
                 </div>
                 <div class="relative">
                    <select v-model="configRadar.dia_setmana" class="w-full bg-[#2a2a2a] border border-white/10 text-white text-sm rounded-xl focus:ring-[#1ED760] focus:border-[#1ED760] block p-3.5 appearance-none cursor-pointer outline-none hover:bg-[#3a3a3a] hover:border-white/20 transition-all font-bold shadow-sm">
                       <option :value="1">Dilluns</option>
                       <option :value="2">Dimarts</option>
                       <option :value="3">Dimecres</option>
                       <option :value="4">Dijous</option>
                       <option :value="5">Divendres (Recomanat)</option>
                       <option :value="6">Dissabte</option>
                       <option :value="0">Diumenge</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                 </div>
              </div>

              <!-- Gèneres Llavor -->
              <div :class="!configRadar.radar_actiu ? 'opacity-40 grayscale pointer-events-none' : ''" class="transition-opacity duration-300">
                 <div class="mb-3 flex justify-between items-center">
                    <h3 class="font-bold text-white text-[15px]">Gèneres Llavor</h3>
                    <button @click="carregarGeneresDisponibles" v-if="!generesDisponibles.length && !carregantGeneres" class="text-xs text-[#1ED760] hover:underline font-bold">Recarregar</button>
                 </div>
                 
                 <!-- Cercador de gèneres -->
                 <div class="relative mb-3">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                       <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input type="text" v-model="filtreGenere" placeholder="Cerca un gènere... (ex: techno)" class="w-full bg-[#2a2a2a] border border-white/10 text-white text-sm rounded-xl focus:ring-[#1ED760] focus:border-[#1ED760] block pl-10 p-3 outline-none transition-all placeholder-gray-500">
                 </div>

                 <div v-if="carregantGeneres" class="text-center p-6 bg-[#222] rounded-xl border border-white/5"><div class="animate-spin w-8 h-8 border-b-2 border-[#1ED760] rounded-full mx-auto"></div></div>
                 <div v-else-if="!generesDisponibles.length" class="text-center p-6 bg-[#222] rounded-xl border border-white/5 text-[#B3B3B3] text-sm">No s'han pogut carregar els gèneres de Spotify. Comprova la teva connexió.</div>
                 <div v-else class="bg-[#222] border border-white/5 rounded-xl max-h-64 overflow-y-auto custom-scrollbar shadow-inner divide-y divide-white/5">
                    <div v-if="!generesFiltrats.length" class="p-4 text-center text-sm text-gray-500">Cap gènere coincideix amb la cerca.</div>
                    <button v-for="genere in generesFiltrats" :key="genere" @click="toggleGenere(genere)" class="w-full text-left px-5 py-3 flex items-center justify-between transition-colors hover:bg-[#2a2a2a] group">
                       <span class="text-sm font-medium transition-colors" :class="configRadar.generes_preferits.includes(genere) ? 'text-white font-bold' : 'text-gray-400 group-hover:text-gray-200'">{{ traduirGenere(genere) }}</span>
                       <div class="w-5 h-5 rounded-full border flex items-center justify-center transition-all" :class="configRadar.generes_preferits.includes(genere) ? 'bg-[#1ED760] border-[#1ED760]' : 'border-gray-600 group-hover:border-gray-400'">
                          <svg v-if="configRadar.generes_preferits.includes(genere)" class="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                       </div>
                    </button>
                 </div>
              </div>
           </div>

           <!-- Botons d'acció -->
           <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <button @click="guardarConfigRadar" :disabled="guardantRadar" class="flex-1 py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-gray-200 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg justify-center flex items-center">
                 {{ guardantRadar ? 'Guardant...' : 'Guardar Configuració' }}
              </button>
              <button @click="generarRadarAra" :disabled="generantRadarManual" class="flex-1 py-4 border border-[#1ED760]/30 bg-[#1ED760]/10 text-[#1ED760] font-bold text-sm rounded-xl hover:bg-[#1ED760]/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2">
                 <span v-if="generantRadarManual" class="animate-spin h-5 w-5 border-2 border-[#1ED760] border-t-transparent rounded-full"></span>
                 <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 {{ generantRadarManual ? 'Processant...' : 'Generar Playlist Ara' }}
              </button>
           </div>
        </div>
      </div>

      <!-- SECCIÓ: RADAR DE CONCERTS -->
      <div v-if="seccioActiva === 'radar_concerts'" class="p-6 bg-[#181818] border border-white/5 rounded-2xl">
        <h2 class="text-2xl font-black text-white mb-1 tracking-tight">Radar de Concerts</h2>
        <p class="text-[#B3B3B3] mb-6 font-medium text-sm">Concerts en directe dels teus artistes preferits via Ticketmaster.</p>

        <!-- Banner: Clau API faltant -->
        <div v-if="errorConcertsApiKey" class="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex gap-4 items-start">
          <svg class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.539-1.333-3.309 0L3.732 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <p class="text-yellow-400 font-bold text-sm mb-1">Falta la clau de Ticketmaster</p>
            <p class="text-yellow-300/70 text-xs mb-2">Afegeix <code class="bg-black/30 px-1.5 py-0.5 rounded font-mono">TICKETMASTER_API_KEY</code> al fitxer <code class="bg-black/30 px-1.5 py-0.5 rounded font-mono">server/.env</code></p>
            <a href="https://developer.ticketmaster.com/products-and-docs/apis/getting-started/" target="_blank" class="text-xs text-yellow-400 underline font-bold">Obtenir clau gratuïta → developer.ticketmaster.com</a>
          </div>
        </div>

        <div v-if="!concertsCarregats && !cercantConcerts" class="text-center py-12">
          <div class="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#282828]">
            <svg class="w-7 h-7 text-[#B3B3B3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
          </div>
          <p class="text-[#B3B3B3] font-medium mb-6 text-sm">Troba concerts dels teus artistes a prop teu</p>
          <div class="flex gap-3 justify-center">
            <button @click="buscarConcertsAProp" class="px-6 py-3 bg-[#1ED760] text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-[#1fdf64] transition">Cercar a prop</button>
            <button @click="cercarConcertsGlobal" class="px-6 py-3 bg-white/10 text-white font-bold text-xs rounded-full hover:bg-white/15 transition">Cerca global</button>
          </div>
        </div>

        <div v-else-if="cercantConcerts" class="text-center py-16">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1ED760] mx-auto mb-4"></div>
          <p class="text-[#1ED760] font-bold text-sm">Escanejant Ticketmaster...</p>
          <p class="text-gray-500 text-xs mt-1">Això pot trigar uns segons</p>
        </div>

        <div v-else-if="concertsTrobats.length > 0">
          <p class="text-xs text-[#B3B3B3] mb-4 font-bold uppercase tracking-widest">{{ concertsTrobats.length }} concerts trobats</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="concert in concertsTrobats" :key="concert.id" class="bg-[#282828] border border-white/5 rounded-xl overflow-hidden hover:border-[#1ED760]/30 transition group">
               <div class="h-40 overflow-hidden relative">
                 <img :src="concert.imatge" alt="Concert" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                 <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                 <span class="absolute bottom-3 left-3 text-[#1ED760] font-bold">{{ concert.artista }}</span>
                 <span v-if="concert.esGeneric" class="absolute top-3 right-3 bg-[#1ED760]/20 text-[#1ED760] border border-[#1ED760]/30 text-[10px] uppercase font-black px-2 py-0.5 rounded backdrop-blur-sm shadow-md">RECOMANAT</span>
               </div>
               <div class="p-4">
                 <h3 class="font-bold text-white truncate text-sm mb-1">{{ concert.nom }}</h3>
                 <p class="text-xs text-gray-400 mb-1">{{ concert.ubicacio.venue }}</p>
                 <p class="text-xs text-gray-500 mb-3">{{ concert.ubicacio.ciutat }}, {{ concert.ubicacio.pais }}</p>
                 <a :href="concert.url" target="_blank" class="block text-center py-2 bg-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/20 transition">Veure Entrades</a>
               </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-400 font-medium mb-2">Cap concert trobat</p>
          <p class="text-gray-600 text-xs mb-6">Prova la cerca global per veure concerts a qualsevol lloc</p>
          <button @click="cercarConcertsGlobal" class="px-5 py-2.5 bg-white/10 text-white text-sm font-bold rounded-xl hover:bg-white/15 transition">Cercar globalment</button>
        </div>
      </div>

      <!-- SECCIÓ: CREADOR DE FESTIVALS -->
      <div v-if="seccioActiva === 'festival'" class="p-6 bg-[#181818] border border-white/5 rounded-2xl">
        <h2 class="text-2xl font-black text-white mb-2 tracking-tight">Creador de Cartells (AI)</h2>
        <p class="text-[#B3B3B3] mb-6 font-medium">Gemini analitza el teu Top 50 per crear un festival unic.</p>
        <div v-if="!cartellFestival && !generantCartell" class="text-center py-16"><button @click="generarCartell" class="px-6 py-3 bg-[#7B61FF] text-white font-black uppercase tracking-widest text-sm rounded-full hover:bg-[#6a54e8] transition">Generar Cartell</button></div>
        <div v-else-if="generantCartell" class="text-center py-16"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7B61FF] mx-auto mb-4"></div><p class="text-[#7B61FF]">Organitzant els artistes...</p></div>
         <div v-else-if="cartellFestival" class="w-full max-w-2xl mx-auto animate-fade-in flex flex-col items-center">
           <!-- Contingut del cartell descarregable -->
           <div ref="cartellRef" class="bg-gradient-to-br from-[#FF0055] via-[#FF5500] to-[#FFCC00] p-8 md:p-14 w-full rounded-3xl relative overflow-hidden shadow-2xl">
               <!-- Fons vibrant festivalero -->
               <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
               <div class="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
               
               <div class="relative z-10 flex flex-col items-center">
                  <!-- Capçalera SONARIS -->
                  <div class="mb-8 w-full flex justify-center items-center gap-2 text-white/90">
                      <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                      <span class="font-black text-2xl tracking-[0.3em] uppercase">SONARIS</span>
                  </div>
                  <div class="text-center mb-12">
                     <p class="text-[10px] text-white font-bold tracking-[0.4em] uppercase mb-2">Presents</p>
                     <h1 class="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase leading-[0.85] drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" style="font-family:'Impact',sans-serif; transform: skewY(-2deg);">{{ cartellFestival.nomFestival }}</h1>
                     <p class="inline-block bg-black text-[#FFCC00] px-4 py-1.5 text-xs md:text-sm font-bold tracking-[0.4em] uppercase shadow-lg skew-x-[-10deg] transform -rotate-2">{{ cartellFestival.tema }}</p>
                  </div>
                  
                  <!-- Dies i Lineup -->
                  <div class="w-full max-w-xl space-y-10">
                     <div v-for="(diaData, index) in cartellFestival.dies" :key="index" class="relative">
                        <div class="text-center bg-black/10 backdrop-blur-sm p-5 md:p-6 rounded-3xl border border-white/20 shadow-xl">
                           <div class="inline-block border-2 border-white text-white text-[10px] md:text-xs px-4 py-1 mb-4 uppercase tracking-[0.3em] font-black rounded-full shadow-md">{{ diaData.dia }}</div>
                           <h2 class="text-3xl md:text-5xl font-black text-white uppercase mb-3 tracking-tight drop-shadow-md">{{ diaData.headliners.join(' • ') }}</h2>
                           <h3 class="text-lg md:text-2xl font-bold text-white/90 mb-3 uppercase drop-shadow-sm">{{ diaData.subHeadliners.join(' | ') }}</h3>
                           <p class="text-[9px] md:text-xs text-white/80 font-medium uppercase tracking-widest leading-relaxed">{{ diaData.undercard.join(' · ') }}</p>
                        </div>
                     </div>
                  </div>
                  
                  <!-- Peu -->
                  <div class="mt-16 flex flex-col items-center bg-black/40 backdrop-blur-sm p-4 rounded-xl w-full">
                     <p class="text-[11px] text-white font-bold uppercase tracking-[0.2em] mb-1 text-center">Your Spotify History</p>
                     <p class="text-[9px] text-white/70 uppercase tracking-widest">sonaris.com/festival</p>
                  </div>
               </div>
           </div>

           <!-- Botons d'acció sota el cartell -->
           <div class="w-full flex flex-col md:flex-row gap-4 mt-6">
               <button @click="generarCartell" class="flex-1 py-4 bg-[#282828] border border-white/10 text-white font-bold text-sm rounded-xl hover:bg-[#383838] transition flex items-center justify-center gap-2">
                   <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                   Regenerar
               </button>
               <button @click="descarregarCartell" class="flex-1 py-4 bg-white text-black font-black text-sm rounded-xl hover:bg-gray-200 transition shadow-lg flex items-center justify-center gap-2">
                   <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   Descarregar Imatge
               </button>
               <button @click="compartirCartell" class="flex-1 md:flex-none md:w-auto px-6 py-4 bg-[#7B61FF] text-white font-bold text-sm rounded-xl hover:bg-[#6a54e8] transition shadow-lg flex items-center justify-center gap-2">
                   <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/></svg>
                   Compartir
               </button>
           </div>
         </div>
      </div>

      <!-- SECCIÓ: PLAYGROUND SOCIAL -->
      <div v-if="seccioActiva === 'social'" class="p-8 bg-[#181818] border border-white/5 rounded-2xl">
        <h2 class="text-2xl font-black text-white mb-2 tracking-tight">Playground Social: Tinder Musical</h2>
        <p class="text-[#B3B3B3] mb-8 font-medium">Crea una sala o uneix-te a la d'un amic per fer Match amb cancons al mateix temps.</p>
        <div v-if="!salaConnectada" class="max-w-md mx-auto bg-[#282828] p-8 rounded-xl border border-white/5 text-center shadow-xl">
          <input type="text" v-model="codiSalaInput" placeholder="Codi de la Sala" class="w-full bg-[#181818] border border-white/10 rounded-xl p-4 text-white text-center font-bold tracking-widest uppercase mb-4 focus:border-[#1ED760] outline-none" />
          <button @click="unirSala" class="w-full py-4 bg-white text-black text-[13px] uppercase tracking-widest font-black rounded-xl hover:bg-gray-200 transition">Unir-se a la Sala</button>
          <div v-if="codiSalaInput.length >= 3" class="mt-8 flex flex-col items-center bg-[#181818] p-6 rounded-xl border border-white/5"><p class="text-xs text-[#B3B3B3] font-bold mb-4 uppercase">O escaneja per entrar</p><img :src="qrUrl" class="w-40 h-40 rounded-lg p-2 bg-white" /></div>
          <p v-else class="text-[13px] text-gray-500 mt-6">Pots inventar-te qualsevol codi.</p>
        </div>
        <div v-else class="flex flex-col md:flex-row gap-8">
           <div class="flex-1 flex flex-col items-center">
              <div :style="'background: linear-gradient(135deg,' + dominantColor + '33, #121212 80%);'" class="rounded-xl p-6 border border-white/10 w-full max-w-sm flex flex-col items-center shadow-2xl relative overflow-hidden">
                 <div v-if="cançoActualTinder" class="w-full flex flex-col items-center">
                    <canvas ref="canvasVisualitzador" class="absolute bottom-16 left-0 w-full h-32 opacity-30 pointer-events-none mix-blend-screen z-0"></canvas>
                    <audio ref="audioPlayer" crossorigin="anonymous" class="hidden"></audio>
                    <img ref="imgCaratula" crossorigin="anonymous" :src="cançoActualTinder.imatge" @load="extreureColor" class="w-64 h-64 object-cover rounded shadow-2xl mb-5 z-10" />
                    <h3 class="text-xl font-black text-white text-center mb-1 z-10">{{ cançoActualTinder.nom }}</h3>
                    <p class="text-[13px] text-[#B3B3B3] mb-8 z-10">{{ cançoActualTinder.artista }}</p>
                    <div class="flex gap-6 w-full justify-center z-10 pb-2">
                       <button @click="swipe('esquerra')" :disabled="tinderBloquejat" class="w-[72px] h-[72px] rounded-full bg-[#181818] text-[#B3B3B3] border-2 border-[#383838] flex items-center justify-center hover:bg-[#ff4d4d]/10 hover:text-[#ff4d4d] hover:scale-105 transition-all disabled:opacity-30"><svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
                       <button @click="swipe('dreta')" :disabled="tinderBloquejat" class="w-[72px] h-[72px] rounded-full bg-[#181818] text-[#1ED760] border-2 border-[#1ED760]/30 flex items-center justify-center hover:bg-[#1ED760]/10 hover:scale-105 transition-all disabled:opacity-30"><svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 21.414l-8.828-8.828a4 4 0 010-5.656z" clip-rule="evenodd" /></svg></button>
                    </div>
                 </div>
                 <div v-else class="text-center py-20 text-[#B3B3B3]"><p class="font-bold">S'han acabat les cancons!</p></div>
              </div>
           </div>
           <div class="w-full md:w-80 flex flex-col bg-[#282828] border border-white/5 rounded-xl overflow-hidden">
              <div class="bg-[#181818] border-b border-white/5 p-4 flex items-center justify-center"><span class="text-white font-black text-[13px] uppercase tracking-widest">Matches Mutus</span></div>
              <div class="flex-1 p-4 flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                 <div v-for="match in llistaMatches" :key="match.uri" class="flex gap-4 p-2.5 rounded-lg items-center hover:bg-[#383838] transition cursor-pointer"><img :src="match.imatge" class="w-12 h-12 rounded shadow" /><div class="min-w-0"><p class="font-bold text-white text-[13px] truncate">{{ match.nom }}</p><p class="text-[11px] text-[#B3B3B3] truncate">{{ match.artista }}</p></div></div>
                 <div v-if="!llistaMatches.length" class="text-sm font-medium text-gray-500 text-center py-10">Esperant coincidencies...</div>
              </div>
           </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Radar, Line, Bar } from 'vue-chartjs';
import { Chart as ChartJS, RadialLinearScale, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Filler, Tooltip, Legend } from 'chart.js';
import { io } from 'socket.io-client';
import html2canvas from 'html2canvas';

ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Filler, Tooltip, Legend);

const magatzemAuth = useAuthStore();
const enrutador = useRouter();
const rutaActual = useRoute();

const seccioActiva = ref('dashboard');
const terminiActual = ref('medium_term');
const estalviEnergia = ref(false);
const carregant = ref(true);
const errorDades = ref(null);

const topArtistes = ref([]);
const topCancions = ref([]);
const dadesGeneres = ref([]);
const dadaDelDia = ref(null);
const carregantDadaIA = ref(false);
const infoUsuari = ref(null);
const obscuritat = ref(0);
const adnMusical = ref(null);
const minutsEscoltats = ref(0);
const diesActiu = ref(1);

// VARIABLES CARTELLS I DESCARREGUES
const cartellRef = ref(null);
const descarregarCartell = async () => {
    if (!cartellRef.value) return;
    try {
        const canvas = await html2canvas(cartellRef.value, { backgroundColor: null, scale: 2 });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'cartell-sonaris.png';
        link.href = dataUrl;
        link.click();
    } catch (e) {
        console.error("Error descarregant imatge", e);
    }
};

const compartirCartell = async () => {
    if (!cartellRef.value) return;
    try {
        const canvas = await html2canvas(cartellRef.value, { backgroundColor: null, scale: 2 });
        canvas.toBlob(async (blob) => {
            if (navigator.share) {
                const fitxer = new File([blob], 'sonaris-festival.png', { type: 'image/png' });
                await navigator.share({
                    title: 'El meu cartell de Festival SONARIS',
                    text: 'He creat el meu cartell de festival somiat amb el meu historial de Spotify a SONARIS! Crea el teu a sonaris.com/festival 🔥',
                    files: [fitxer]
                });
            } else {
                alert("El teu dispositiu no suporta l'opció de compartir directament. Descarrega't la imatge!");
                descarregarCartell();
            }
        });
    } catch (e) {
        console.error("Error al compartir", e);
    }
};

// Dades d'activitat real (recently-played, carregades al onMounted)
const dadesEvolucio = ref({
  labels: ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'],
  datasets: [{
    label: 'Cançons escoltades',
    data: [0,0,0,0,0,0,0],
    borderColor: '#00F5D4',
    backgroundColor: 'rgba(0,245,212,0.15)',
    tension: 0.4,
    fill: true,
    pointBackgroundColor: '#fff',
    pointBorderColor: '#00F5D4',
    borderWidth: 2
  }]
});
const opcionsEvolucio = { responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{mode:'index',intersect:false}},scales:{y:{beginAtZero:true,grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#888',font:{family:'Inter',size:10},stepSize:1}},x:{grid:{display:false},ticks:{color:'#888',font:{family:'Inter',size:10}}}} };
const dadesEnergiaSetmanal = computed(() => ({
  labels: ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'],
  datasets: [{
    label: "Energia (%)",
    data: adnMusical.value ? [
      Math.round(adnMusical.value.energy * 0.8),
      Math.round(adnMusical.value.danceability * 0.9),
      Math.round(adnMusical.value.energy),
      Math.round(adnMusical.value.valence * 1.1),
      Math.round(adnMusical.value.energy * 1.2),
      Math.round(adnMusical.value.danceability),
      Math.round(adnMusical.value.valence * 0.7)
    ].map(v => Math.min(100, Math.max(0, v))) : [60,45,55,75,90,85,40],
    backgroundColor: '#7B61FF',
    borderRadius: 6,
    barThickness: 16
  }]
}));
const opcionsBarres = { responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,max:100,grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#888',font:{family:'Inter',size:10}}},x:{grid:{display:false},ticks:{color:'#888',font:{family:'Inter',size:10}}}} };


// ====== NETEJADOR DE PLAYLISTS (Estil spotify-dedup) ======
const llistaPlaylists = ref([]);
const playlistSeleccionada = ref(null);
const duplicatsTrobats = ref(null);
const carregantPlaylists = ref(false);
const analitzantPlaylists = ref(false);
const netejantPlaylists = ref(false);
const modeSimulacre = ref(false);
const opcionsAvançadesObertes = ref(false);
const modeAnalisi = ref('estricte');
const toleranciaTemps = ref(4);
const estrategiaConservacio = ref('antiga');

// Estat per escaneig massiu (estil spotify-dedup)
const duplicatsPerPlaylist = ref({});   // { playlistId: numDuplicats }
const estatEscaneig = ref({});          // { playlistId: 'escanejant' | 'net' | 'duplicats' }
const escaneigMassiuActiu = ref(false);
const progrésEscaneig = ref({ actual: 0, total: 0, nomActual: '' });

const totalDuplicatsGlobal = computed(() => Object.values(duplicatsPerPlaylist.value).reduce((acc, v) => acc + v, 0));
const playlistsNetes = computed(() => Object.values(estatEscaneig.value).filter(e => e === 'net').length);
const playlistsAmbDuplicats = computed(() => Object.values(duplicatsPerPlaylist.value).filter(v => v > 0).length);

// Escaneig massiu de totes les playlists (com spotify-dedup)
const escanejarTotes = async () => {
  if (llistaPlaylists.value.length === 0) return;
  escaneigMassiuActiu.value = true;
  duplicatsPerPlaylist.value = {};
  estatEscaneig.value = {};
  progrésEscaneig.value = { actual: 0, total: llistaPlaylists.value.length, nomActual: '' };

  for (const playlist of llistaPlaylists.value) {
    progrésEscaneig.value.nomActual = playlist.name;
    estatEscaneig.value[playlist.id] = 'escanejant';
    try {
      const res = await fetch(`http://localhost:3000/api/dashboard/playlists/${playlist.id}/duplicats?mode=${modeAnalisi.value}&tolerancia=${toleranciaTemps.value * 1000}`, {
        headers: { 'Authorization': `Bearer ${magatzemAuth.tokenAcces}` }
      });
      if (res.ok) {
        const dades = await res.json();
        const numDuplicats = dades.totalDuplicats || 0;
        duplicatsPerPlaylist.value[playlist.id] = numDuplicats;
        estatEscaneig.value[playlist.id] = numDuplicats > 0 ? 'duplicats' : 'net';
      }
    } catch(e) {
      estatEscaneig.value[playlist.id] = 'net';
    }
    progrésEscaneig.value.actual++;
  }
  escaneigMassiuActiu.value = false;
};

// Fix ràpid d'una playlist (botó Fix sense entrar al detall)
const fixRapid = async (playlistId) => {
  playlistSeleccionada.value = playlistId;
  analitzantPlaylists.value = true;
  duplicatsTrobats.value = null;
  try {
    const res = await fetch(`http://localhost:3000/api/dashboard/playlists/${playlistId}/duplicats?mode=${modeAnalisi.value}&tolerancia=${toleranciaTemps.value * 1000}`, {
      headers: { 'Authorization': `Bearer ${magatzemAuth.tokenAcces}` }
    });
    if (res.ok) {
      duplicatsTrobats.value = await res.json();
    }
  } catch(e) {
    console.error('Error fixRapid', e);
  } finally {
    analitzantPlaylists.value = false;
  }
  // Auto-netejar si hi ha duplicats i no estem en mode simulacre
  if (duplicatsTrobats.value && duplicatsTrobats.value.duplicats.length > 0 && !modeSimulacre.value) {
    await netejarPlaylist();
    duplicatsPerPlaylist.value[playlistId] = 0;
    estatEscaneig.value[playlistId] = 'net';
    playlistSeleccionada.value = null;
    duplicatsTrobats.value = null;
  }
};
// ====== FI NETEJADOR ======

const textDiari = ref('');
const analitzantDiari = ref(false);
const resultatDiari = ref(null);

const detectantClima = ref(false);
const climaDetectat = ref(null);
const vibeManual = ref(null);
const iconaClima = computed(() => {
   if (!climaDetectat.value) return '';
   const estat = climaDetectat.value.meteo.estat_principal;
   const h = climaDetectat.value.context === 'Nit';
   if (estat === 'Clear') return h ? '' : '';
   if (estat === 'Rain' || estat === 'Drizzle') return '';
   if (estat === 'Clouds') return '';
   return '';
});

const configRadar = ref({ radar_actiu:true, limit_popularitat:30, generes_preferits:[], autoneteja_activa:false, dia_setmana:5 });

const famaEstimada = computed(() => {
   const pop = configRadar.value.limit_popularitat;
   // Escala abstracta aproximada de Oients Mensuals (Spotify Popularity to Monthly Listeners)
   if (pop <= 5) return "< 1K Oients";
   if (pop <= 10) return "5K Oients";
   if (pop <= 15) return "15K Oients";
   if (pop <= 20) return "50K Oients";
   if (pop <= 25) return "100k Oients";
   if (pop <= 30) return "250k Oients";
   if (pop <= 35) return "500k Oients";
   if (pop <= 40) return "1M Oients";
   if (pop <= 45) return "2.5M Oients";
   return "+5M Oients";
});

const guardantRadar = ref(false);
const radarCarregat = ref(false);
const generantRadarManual = ref(false);
const generesDisponibles = ref([]);
const carregantGeneres = ref(false);
const filtreGenere = ref('');

const MAP_TRADUCCIONS = {
  "acoustic": "Acústic", "alt-rock": "Rock Alternatiu", "alternative": "Alternatiu", "ambient": "Ambient", "anime": "Anime",
  "black-metal": "Black Metal", "bluegrass": "Bluegrass", "blues": "Blues", "bossanova": "Bossa Nova", "brazil": "Brasilera",
  "breakbeat": "Breakbeat", "british": "Britànic", "cantopop": "Cantopop", "chicago-house": "Chicago House", "children": "Infantil",
  "chill": "Chill Out", "classical": "Música Clàssica", "club": "Club / Discoteca", "comedy": "Comèdia", "country": "Country",
  "dance": "Dance / Ball", "dancehall": "Dancehall", "death-metal": "Death Metal", "deep-house": "Deep House", "detroit-techno": "Detroit Techno",
  "disco": "Música Disco", "disney": "Disney", "drum-and-bass": "Drum & Bass", "dub": "Dub", "dubstep": "Dubstep",
  "edm": "EDM / Electrònica", "electro": "Electro", "electronic": "Electrònica", "emo": "Emo", "folk": "Folk",
  "forro": "Forró", "french": "Francesa", "funk": "Funk", "garage": "Garage", "german": "Alemanya",
  "gospel": "Gospel", "goth": "Gòtic", "grindcore": "Grindcore", "groove": "Groove", "grunge": "Grunge",
  "guitar": "Guitarra", "happy": "Feliç / Alegre", "hard-rock": "Hard Rock", "hardcore": "Hardcore", "hardstyle": "Hardstyle",
  "heavy-metal": "Heavy Metal", "hip-hop": "Hip-Hop / Rap / Urbà", "holidays": "Festiva / Nadal", "honky-tonk": "Honky Tonk", "house": "House",
  "idm": "IDM", "indian": "Índia", "indie": "Indie", "indie-pop": "Pop Indie", "industrial": "Industrial",
  "iranian": "Iraniana", "j-dance": "J-Dance", "j-idol": "J-Idol", "j-pop": "J-Pop", "j-rock": "J-Rock",
  "jazz": "Jazz", "k-pop": "K-Pop", "kids": "Nens", "latin": "Llatí / Urbana", "latino": "Llatina",
  "malay": "Malaia", "mandopop": "Mandopop", "metal": "Metal", "metal-misc": "Metal Misc", "metalcore": "Metalcore",
  "minimal-techno": "Techno Minimal", "movies": "Pel·lícules", "mpb": "Música Popular Brasilera", "new-age": "New Age", "new-release": "Novetats",
  "opera": "Òpera", "pagode": "Pagode", "party": "Festa / Comercial", "philippines-opm": "OPM Filipines", "piano": "Piano",
  "pop": "Pop", "pop-film": "Pop Pel·lícules", "post-dubstep": "Post-Dubstep", "power-pop": "Power Pop", "progressive-house": "Progressive House",
  "psych-rock": "Rock Psicodèlic", "punk": "Punk", "punk-rock": "Punk Rock", "r-n-b": "R&B / Soul", "rain": "Pluja / Relax",
  "reggae": "Reggae", "reggaeton": "Reggaeton / Urbà / Dembow", "road-trip": "Viatge en Cotxe", "rock": "Rock", "rock-n-roll": "Rock & Roll",
  "rockabilly": "Rockabilly", "romance": "Romàntica", "sad": "Trist / Malenconia", "salsa": "Salsa", "samba": "Samba",
  "sertanejo": "Sertanejo", "show-tunes": "Musicals", "singer-songwriter": "Cantautor", "ska": "Ska",
  "sleep": "Per Dormir", "songwriter": "Compositor", "soul": "Soul", "soundtracks": "Bandes Sonores", "spanish": "Música Espanyola",
  "study": "Per Estudiar", "summer": "Estiu", "swedish": "Sueca", "synth-pop": "Synth-Pop", "tango": "Tango",
  "techno": "Techno", "trance": "Trance", "trip-hop": "Trip-Hop", "turkish": "Turca", "work-out": "Gimnàs / Entrenament",
  "world-music": "Música del Món"
};

const traduirGenere = (g) => MAP_TRADUCCIONS[g] || (g.charAt(0).toUpperCase() + g.slice(1));

const generesFiltrats = computed(() => {
   if (!filtreGenere.value) return generesDisponibles.value;
   const search = filtreGenere.value.toLowerCase();
   return generesDisponibles.value.filter(g => {
       const traduccio = traduirGenere(g).toLowerCase();
       return g.toLowerCase().includes(search) || traduccio.includes(search);
   });
});

const toggleGenere = (genere) => {
   const idx = configRadar.value.generes_preferits.indexOf(genere);
   if (idx > -1) configRadar.value.generes_preferits.splice(idx, 1);
   else configRadar.value.generes_preferits.push(genere);
};

const cercantConcerts = ref(false);
const concertsCarregats = ref(false);
const concertsTrobats = ref([]);
const errorConcertsApiKey = ref(false);
const generantCartell = ref(false);
const cartellFestival = ref(null);

let socket = null;
const salaConnectada = ref(false);
const codiSalaInput = ref('');
const qrUrl = computed(() => `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('http://localhost:5173/dashboard?sala='+codiSalaInput.value)}`);
const cançonsTinder = ref([
   { uri:'spotify:track:demo1', nom:'Blinding Lights', artista:'The Weeknd', imatge:'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36' },
   { uri:'spotify:track:demo2', nom:'As It Was', artista:'Harry Styles', imatge:'https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14' },
   { uri:'spotify:track:demo3', nom:'Bohemian Rhapsody', artista:'Queen', imatge:'https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b' },
   { uri:'spotify:track:demo4', nom:'Levitating', artista:'Dua Lipa', imatge:'https://i.scdn.co/image/ab67616d0000b273bd22dea6e1fd5fc4f2fc12b4' }
]);
const cançoActualTinder = computed(() => cançonsTinder.value[0] || null);
const llistaMatches = ref([]);
const tinderBloquejat = ref(false);
const amicDubtantEstat = ref(null);
const tempsRestantSync = ref(0);
let timerSync = null;
const audioPlayer = ref(null);
const canvasVisualitzador = ref(null);
const imgCaratula = ref(null);
const dominantColor = ref('#00f5d4');
let audioCtx = null, analyser = null, dataArray = null, animFrameId = null;

const initAudioVisualizer = () => {
    if (!audioCtx && audioPlayer.value) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        const source = audioCtx.createMediaElementSource(audioPlayer.value);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }
};
const dibuixarVisualitzador = () => {
    if (!canvasVisualitzador.value || !analyser || estalviEnergia.value) return;
    animFrameId = requestAnimationFrame(dibuixarVisualitzador);
    analyser.getByteFrequencyData(dataArray);
    const canvas = canvasVisualitzador.value;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / dataArray.length) * 1.5;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = dominantColor.value;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
    }
};
const extreureColor = () => {
    if (!imgCaratula.value) return;
    try {
        const canvas = document.createElement('canvas');
        canvas.width = imgCaratula.value.width;
        canvas.height = imgCaratula.value.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgCaratula.value, 0, 0, canvas.width, canvas.height);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r=0, g=0, b=0, count=0;
        for(let i=0; i < data.length; i+=400) { r+=data[i]; g+=data[i+1]; b+=data[i+2]; count++; }
        dominantColor.value = `rgb(${Math.floor(r/count)},${Math.floor(g/count)},${Math.floor(b/count)})`;
    } catch(e) { console.warn("CORS color extract", e); }
};
const aturarAudio = () => {
    if (audioPlayer.value) { audioPlayer.value.pause(); audioPlayer.value.currentTime = 0; }
    if (animFrameId) cancelAnimationFrame(animFrameId);
};

const dadesRadar = computed(() => {
  if (!dadesGeneres.value.length) return null;
  return { labels:dadesGeneres.value.map(g=>g.genere.toUpperCase()), datasets:[{label:'Gèneres',data:dadesGeneres.value.map(g=>g.compte),backgroundColor:'rgba(0,245,212,0.2)',borderColor:'#00F5D4',pointBackgroundColor:'#00F5D4',pointBorderColor:'#fff',pointHoverBackgroundColor:'#fff',pointHoverBorderColor:'#00F5D4',borderWidth:2}] };
});
const opcionsRadar = { responsive:true,maintainAspectRatio:false,scales:{r:{angleLines:{color:'rgba(234,234,234,0.1)'},grid:{color:'rgba(234,234,234,0.1)'},pointLabels:{color:'#EAEAEA',font:{family:'Inter',size:10}},ticks:{display:false,maxTicksLimit:5}}},plugins:{legend:{display:false}} };
const colorsGeneres = ['#00F5D4','#7B61FF','#FF6B6B','#00C4AA','#5D47FF','#FF4D4D','#00E5C4','#4D2EFF'];

const seccionsNav = [
  { id:'dashboard', icona:'<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>', etiqueta:'Centre de Comandament', descripcio:"Les teves estadístiques d'escolta de Spotify" },
  { id:'playlists', icona:'<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>', etiqueta:'Netejador Quirúrgic', descripcio:'Detecta i elimina cançons duplicades' },
  { id:'radar_concerts', icona:'<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>', etiqueta:'Radar de Concerts', descripcio:'Gires en directe dels teus artistes' },
  { id:'festival', icona:'<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>', etiqueta:'Creador de Festivals', descripcio:'El teu cartell de festival genIAteitzat' },
  { id:'radar_underground', icona:'<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>', etiqueta:'Radar Underground', descripcio:'El teu motor de descobriments' },
  { id:'social', icona:'<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>', etiqueta:'Playground Social', descripcio:'Tinder Musical i Trivial en temps real' },
];

const terminis = [
  { valor:'short_term', etiqueta:'Últimes 4 setm.' },
  { valor:'medium_term', etiqueta:'Últims 6 mesos' },
  { valor:'long_term', etiqueta:'Tots els temps' },
];

const regenerarDada = async (modeRoast = false) => {
   carregantDadaIA.value = true;
   try {
      const res = await fetch(`http://localhost:3000/api/dashboard/dada-del-dia?roast=${modeRoast}`, { headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`} });
      if (res.ok) { const d = await res.json(); dadaDelDia.value = d.dadaDelDia; }
   } catch(e) { console.error(e); } finally { carregantDadaIA.value = false; }
};

const carregarDadesDashboard = async () => {
  carregant.value = true; errorDades.value = null;
  try {
    const res = await fetch(`http://localhost:3000/api/dashboard/dades?termini=${terminiActual.value}`, { headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`} });
    const dades = await res.json();
    if (res.ok) {
      topArtistes.value = dades.topArtistes; topCancions.value = dades.topCancions;
      dadesGeneres.value = dades.generesRadar; dadaDelDia.value = dades.dadaDelDia;
      obscuritat.value = dades.obscuritat; adnMusical.value = dades.adnMusical;
      minutsEscoltats.value = dades.minutsEscoltats; diesActiu.value = dades.diesActiu;
    } else { errorDades.value = dades.error || 'Error desconegut'; }
  } catch(e) { errorDades.value = 'Has de re-autoritzar Spotify. Token expirat.'; } finally { carregant.value = false; }
};

const carregarConfigRadar = async () => {
   radarCarregat.value = false;
   try {
      const res = await fetch('http://localhost:3000/api/dashboard/radar/config', { headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`} });
      if (res.ok) {
         const data = await res.json();
         if(typeof data.generes_preferits === 'string') { try { data.generes_preferits = JSON.parse(data.generes_preferits) } catch(e) { data.generes_preferits = [] } }
         if (!Array.isArray(data.generes_preferits)) data.generes_preferits = [];
         
         if (!data.dia_setmana) data.dia_setmana = 5;
         
         configRadar.value = data;
      }
   } catch(e) { console.error(e); } finally { radarCarregat.value = true; }
};

const carregarGeneresDisponibles = async () => {
   carregantGeneres.value = true;
   try {
      const res = await fetch('http://localhost:3000/api/dashboard/radar/generes', { headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`} });
      if (res.ok) { const data = await res.json(); generesDisponibles.value = data.generes || []; }
   } catch(e) { console.error(e); } finally { carregantGeneres.value = false; }
};

const guardarConfigRadar = async () => {
   guardantRadar.value = true;
   try {
      if(!configRadar.value.generes_preferits.length) configRadar.value.generes_preferits = ['indie'];
      const res = await fetch('http://localhost:3000/api/dashboard/radar/config', { method:'PUT', headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`,'Content-Type':'application/json'}, body:JSON.stringify(configRadar.value) });
      if(res.ok) alert("Configuració del Radar Actualitzada!"); else alert("Error guardant la configuració.");
   } catch(e) { alert("No s'ha pogut guardar."); } finally { guardantRadar.value = false; }
};

const generarRadarAra = async () => {
   generantRadarManual.value = true;
   try {
      const res = await fetch('http://localhost:3000/api/dashboard/radar/executar', { method:'POST', headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`} });
      const data = await res.json();
      if (res.ok) { alert(`Èxit! ${data.missatge} S'han afegit ${data.cancons} cançons.\n${data.url}`); if(data.url) window.open(data.url,'_blank'); }
      else alert(`Error IA: ${data.error}`);
   } catch(e) { alert("No s'ha pogut forçar la generació."); } finally { generantRadarManual.value = false; }
};

const carregarPerfilUsuari = async () => {
  try {
    const res = await fetch('https://api.spotify.com/v1/me', { headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`} });
    if (res.ok) infoUsuari.value = await res.json();
  } catch(e) { console.error(e); }
};

const canviarTermini = (nouTermini) => { terminiActual.value = nouTermini; carregarDadesDashboard(); };

const enviarDiari = async () => {
   if (!textDiari.value) return;
   analitzantDiari.value = true; resultatDiari.value = null;
   try {
     const res = await fetch('http://localhost:3000/api/dashboard/diari', { method:'POST', headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`,'Content-Type':'application/json'}, body:JSON.stringify({textUsuari:textDiari.value,spotifyUserId:infoUsuari.value?.id}) });
     if (res.ok) resultatDiari.value = await res.json();
   } catch(e) { console.error(e); } finally { analitzantDiari.value = false; }
};

const generarSoundtrack = () => {
   detectantClima.value = true; climaDetectat.value = null;
   if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
         try {
            const res = await fetch('http://localhost:3000/api/dashboard/soundtrack', { method:'POST', headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`,'Content-Type':'application/json'}, body:JSON.stringify({lat:pos.coords.latitude,lon:pos.coords.longitude,vibe_manual:vibeManual.value}) });
            if(res.ok) climaDetectat.value = await res.json();
         } catch(e) { console.error(e); } finally { detectantClima.value = false; }
      }, (err) => { alert("Cal permetre la geolocalització."); detectantClima.value = false; });
   } else { alert("Geolocalització no disponible."); detectantClima.value = false; }
};

const executarCercaConcerts = async (latitud=null, longitud=null, modeGlobal=false) => {
   cercantConcerts.value = true; concertsCarregats.value = false; concertsTrobats.value = []; errorConcertsApiKey.value = false;
   try {
      const res = await fetch('http://localhost:3000/api/dashboard/concerts', { method:'POST', headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`,'Content-Type':'application/json'}, body:JSON.stringify({latitud,longitud,modeGlobal}) });
      if (res.ok) {
         const data = await res.json();
         data.concerts.forEach(c => { if(c.dataString) c.dataObj = new Date(c.dataString); });
         concertsTrobats.value = data.concerts;
         concertsCarregats.value = true;
      } else {
         // 401 = clau Ticketmaster invàlida
         errorConcertsApiKey.value = true;
         concertsCarregats.value = true; // Per mostrar l'estat buit + banner
      }
   } catch(e) {
      console.error('Error concerts:', e);
      errorConcertsApiKey.value = true;
      concertsCarregats.value = true;
   } finally { cercantConcerts.value = false; }
};


const generarCartell = async () => {
   generantCartell.value = true;
   try {
      const res = await fetch('http://localhost:3000/api/dashboard/festival', { headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`} });
      if (res.ok) { const data = await res.json(); cartellFestival.value = data.cartell; }
      else alert("Hi ha hagut un problema generant el cartell.");
   } catch(e) { console.error(e); } finally { generantCartell.value = false; }
};

const buscarConcertsAProp = () => {
   if ("geolocation" in navigator) {
      cercantConcerts.value = true;
      navigator.geolocation.getCurrentPosition(
         (pos) => { executarCercaConcerts(pos.coords.latitude,pos.coords.longitude,false); }, 
         (err) => { executarCercaConcerts(null,null,false); }, // Fallback al país en lloc de global si no dona permís
         {timeout:10000}
      );
   } else executarCercaConcerts(null,null,false);
};
const cercarConcertsGlobal = () => executarCercaConcerts(null,null,true);

const carregarCanconsTinder = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/dashboard/tinder-tracks', { headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`} });
        if (res.ok) { const d = await res.json(); if(d.cancons?.length) cançonsTinder.value = d.cancons; }
    } catch(e) { console.error(e); }
};

const unirSala = async () => {
   if (!codiSalaInput.value) return;
   await carregarCanconsTinder();
   if (!socket) {
      socket = io('http://localhost:3000');
      socket.on('tinderMatch', (data) => {
         const t = llistaMatches.value.find(c=>c.uri===data.uriCanco) || cançonsTinder.value.find(c=>c.uri===data.uriCanco) || {uri:data.uriCanco,nom:"Match Desconegut",artista:"?",imatge:""};
         if (!llistaMatches.value.find(c=>c.uri===data.uriCanco)) llistaMatches.value.push(t);
      });
      socket.on('amicDubtant', (data) => { if(data.usuari !== (magatzemAuth.usuari?.id||'usuari_demo')) amicDubtantEstat.value = data.estat; });
      socket.on('tinderBloqueigUI', () => { tinderBloquejat.value = true; amicDubtantEstat.value = null; });
      socket.on('tinderResolucio', () => { aturarAudio(); cançonsTinder.value.shift(); tinderBloquejat.value = false; if(cançonsTinder.value.length) socket.emit('tinderIniciSincronitzat',{codiSala:codiSalaInput.value.toLowerCase(),cancoId:cançonsTinder.value[0].uri}); });
      socket.on('playAudioSync', (data) => {
          if(timerSync) clearInterval(timerSync);
          tempsRestantSync.value = Math.max(0, data.playTimestamp - Date.now());
          const dadesCanco = cançonsTinder.value.find(c=>c.uri===data.cancoId);
          timerSync = setInterval(() => {
             tempsRestantSync.value -= 100;
             if (tempsRestantSync.value <= 0) {
                 clearInterval(timerSync); tempsRestantSync.value = 0;
                 if (dadesCanco?.preview_url && audioPlayer.value) {
                     audioPlayer.value.src = dadesCanco.preview_url;
                     initAudioVisualizer();
                     if(audioCtx?.state==='suspended') audioCtx.resume();
                     audioPlayer.value.play().then(()=>dibuixarVisualitzador()).catch(e=>console.log(e));
                 }
             }
          }, 100);
      });
   }
   socket.emit('unirSala', {codiSala:codiSalaInput.value.toLowerCase(),usuari:magatzemAuth.usuari?.id||`usuari_${Math.floor(Math.random()*1000)}`,tipus:'tinder'});
   salaConnectada.value = true;
   setTimeout(() => { if(cançonsTinder.value.length) socket.emit('tinderIniciSincronitzat',{codiSala:codiSalaInput.value.toLowerCase(),cancoId:cançonsTinder.value[0].uri}); }, 1000);
};

const swipe = (direccio) => {
   if (!cançoActualTinder.value || !salaConnectada.value || tinderBloquejat.value) return;
   socket.emit('tinderSwipe', {codiSala:codiSalaInput.value.toLowerCase(),usuari:magatzemAuth.usuari?.id||'usuari_demo',uriCanco:cançoActualTinder.value.uri,direccio});
};
const dubtar = (direccio) => {
   if (!salaConnectada.value || tinderBloquejat.value) return;
   socket.emit('tinderDubta', {codiSala:codiSalaInput.value.toLowerCase(),usuari:magatzemAuth.usuari?.id||'usuari_demo',estat:direccio});
};

onUnmounted(() => { if(socket) socket.disconnect(); });

const tancarSessioApp = () => { magatzemAuth.tancarSessio(); enrutador.push('/login'); };
const formatarDurada = (ms) => { const min=Math.floor(ms/60000); const sec=Math.floor((ms%60000)/1000).toString().padStart(2,'0'); return `${min}:${sec}`; };

const carregarPlaylistsUsuari = async () => {
  if (llistaPlaylists.value.length > 0) return;
  carregantPlaylists.value = true;
  try {
    const res = await fetch('http://localhost:3000/api/dashboard/playlists', { headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`} });
    if (res.ok) { const d = await res.json(); llistaPlaylists.value = d.playlists || []; }
  } catch(e) { console.error(e); } finally { carregantPlaylists.value = false; }
};

const analitzarPlaylist = async (id) => {
  playlistSeleccionada.value = id; analitzantPlaylists.value = true; duplicatsTrobats.value = null;
  try {
     const res = await fetch(`http://localhost:3000/api/dashboard/playlists/${id}/duplicats?mode=${modeAnalisi.value}&tolerancia=${toleranciaTemps.value*1000}`, { headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`} });
     if (res.ok) { duplicatsTrobats.value = await res.json(); duplicatsPerPlaylist.value[id] = duplicatsTrobats.value.totalDuplicats||0; estatEscaneig.value[id] = duplicatsTrobats.value.totalDuplicats > 0 ? 'duplicats' : 'net'; }
  } catch(e) { console.error(e); } finally { analitzantPlaylists.value = false; }
};

const netejarPlaylist = async () => {
   if (!duplicatsTrobats.value || !duplicatsTrobats.value.duplicats.length) return;
   netejantPlaylists.value = true;
   const urisAEliminar = [];
   duplicatsTrobats.value.duplicats.forEach(grup => {
      const ordenats = [...grup.copies, grup.original].sort((a,b)=>a.posicio_original-b.posicio_original);
      if (estrategiaConservacio.value === 'nova') { for(let i=1;i<ordenats.length;i++) urisAEliminar.push(ordenats[i].uri); }
      else { for(let i=0;i<ordenats.length-1;i++) urisAEliminar.push(ordenats[i].uri); }
   });
   if (modeSimulacre.value) {
      setTimeout(() => { alert(`[SIMULACRE] S'haurien eliminat ${urisAEliminar.length} duplicats. Res modificat a Spotify.`); netejantPlaylists.value = false; }, 1000);
      return;
   }
   try {
     const res = await fetch(`http://localhost:3000/api/dashboard/playlists/${playlistSeleccionada.value}/netejar`, { method:'POST', headers:{'Authorization':`Bearer ${magatzemAuth.tokenAcces}`,'Content-Type':'application/json'}, body:JSON.stringify({urisAEliminar}) });
     if (res.ok) {
        alert(`Neteja completada! S'han eliminat ${urisAEliminar.length} duplicats.`);
        duplicatsPerPlaylist.value[playlistSeleccionada.value] = 0;
        estatEscaneig.value[playlistSeleccionada.value] = 'net';
        duplicatsTrobats.value = null; playlistSeleccionada.value = null;
     }
   } catch(e) { console.error(e); } finally { netejantPlaylists.value = false; }
};

watch(seccioActiva, (novaSeccio) => {
  if (novaSeccio === 'playlists') carregarPlaylistsUsuari();
  if (novaSeccio === 'radar_underground' && !generesDisponibles.value.length) carregarGeneresDisponibles();
  if (novaSeccio !== 'social') aturarAudio();
});

const carregarActivitat = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/dashboard/activitat', {
      headers: { 'Authorization': `Bearer ${magatzemAuth.tokenAcces}` }
    });
    if (res.ok) {
      const dades = await res.json();
      dadesEvolucio.value = {
        labels: dades.etiquetes,
        datasets: [{
          label: 'Cançons escoltades',
          data: dades.canconsDia,
          borderColor: '#00F5D4',
          backgroundColor: 'rgba(0,245,212,0.15)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#00F5D4',
          borderWidth: 2
        }]
      };
      minutsEscoltats.value = dades.totalMinuts;
    }
  } catch(e) { console.warn('activitat no disponible', e); }
};

onMounted(() => {
  if (magatzemAuth.estaAutenticat) {
    carregarPerfilUsuari();
    carregarDadesDashboard();
    carregarPlaylistsUsuari();
    carregarConfigRadar();
    carregarGeneresDisponibles();
    carregarActivitat();
    if (rutaActual.query.sala) { seccioActiva.value='social'; codiSalaInput.value=rutaActual.query.sala; setTimeout(()=>unirSala(),600); }
  } else { enrutador.push('/'); }
});

</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
.estalvi-energia * { animation: none !important; transition: none !important; }
</style>
