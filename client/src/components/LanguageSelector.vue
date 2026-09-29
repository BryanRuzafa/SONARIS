<template>
  <div class="relative inline-block text-left">
    <div class="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-1 text-xs font-semibold backdrop-blur-md">
      <button 
        v-for="lang in availableLanguages" 
        :key="lang.code"
        @click="changeLanguage(lang.code)"
        :class="[
          'px-2.5 py-1 rounded-full transition-all duration-200 uppercase tracking-wider',
          currentLocale === lang.code 
            ? 'bg-[#1ED760] text-black shadow-[0_0_12px_rgba(30,215,96,0.4)] font-bold' 
            : 'text-white/60 hover:text-white hover:bg-white/5'
        ]"
      >
        {{ lang.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const availableLanguages = [
  { code: 'ca', label: 'CA' },
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' }
]

const currentLocale = computed(() => locale.value)

const changeLanguage = (code) => {
  locale.value = code
  localStorage.setItem('sonaris_lang', code)
}
</script>
