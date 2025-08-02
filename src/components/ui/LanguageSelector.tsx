import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe } from 'lucide-react'
import { useLanguage } from '@/lib/useLanguage'

export default function LanguageSelector() {
  const { t } = useTranslation()
  const { currentLanguage, changeLanguage, languages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (value: string) => {
    changeLanguage(value as 'en' | 'ru' | 'uz')
  }

  return (
    <div className="relative">
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <SelectValue className="text-sm font-medium" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code} className="hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{language.nativeName}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">({language.name})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 