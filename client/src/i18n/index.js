import { createI18n } from 'vue-i18n'
import ca from './ca'
import es from './es'
import en from './en'

const savedLocale = localStorage.getItem('sonaris_lang') || 'ca'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'ca',
  messages: { ca, es, en }
})

export default i18n
