import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export type Language = 'en' | 'ru' | 'uz'

export const useLanguage = () => {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['en', 'ru', 'uz'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage)
      i18n.changeLanguage(savedLanguage)
    } else {
      // Default to English if no language is saved
      setCurrentLanguage('en')
      i18n.changeLanguage('en')
    }
  }, [i18n])

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language)
    i18n.changeLanguage(language)
    localStorage.setItem('language', language)
  }

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'uz', name: 'Uzbek', nativeName: 'O\'zbekcha' }
  ]

  return {
    currentLanguage,
    changeLanguage,
    languages
  }
} 