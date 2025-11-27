import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

// Importar as traduções
import pt_BR from './locales/pt_BR.json'
import es_ES from './locales/es_ES.json'
import en_US from './locales/en_US.json'

const resources = {
  pt_BR: { translation: pt_BR },
  es_ES: { translation: es_ES },
  en_US: { translation: en_US }
}

i18n
  .use(LanguageDetector)  // Detecta idioma do navegador automaticamente
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt_BR',  // Idioma padrão
    interpolation: {
      escapeValue: false  // React já protege contra XSS
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  })

export default i18n
