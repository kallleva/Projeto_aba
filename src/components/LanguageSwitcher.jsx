import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const languages = [
    { code: 'pt_BR', label: '🇧🇷 Português' },
    { code: 'es_ES', label: '🇪🇸 Español' },
    { code: 'en_US', label: '🇺🇸 English' }
  ]

  return (
    <div className="flex items-center gap-2">
      <Globe size={18} className="text-gray-600" />
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="px-2 py-1 text-sm border border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:outline-none bg-white cursor-pointer"
        title={t('nav.idioma')}
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  )
}
