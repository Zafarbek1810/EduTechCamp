import { useLanguage } from '@/lib/useLanguage'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Check } from 'lucide-react'

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage, languages } = useLanguage()

  const handleLanguageChange = (value: string) => {
    changeLanguage(value as 'en' | 'ru' | 'uz')
  }

  const getLanguageFlag = (code: string) => {
    switch (code) {
      case 'en':
        return '🇺🇸'
      case 'ru':
        return '🇷🇺'
      case 'uz':
        return '🇺🇿'
      default:
        return '🌐'
    }
  }

  const getCurrentLanguageName = () => {
    const currentLang = languages.find(lang => lang.code === currentLanguage)
    return currentLang?.nativeName || 'English'
  }

  return (
    <div className="relative">
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[180px] h-10 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getLanguageFlag(currentLanguage)}</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {getCurrentLanguageName()}
              </span>
            </div>
            {/* <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" /> */}
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-blue-200 dark:border-blue-700 shadow-2xl rounded-xl overflow-hidden">
          {languages.map((language) => (
            <SelectItem 
              key={language.code} 
              value={language.code} 
              className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 focus:bg-gradient-to-r focus:from-blue-50 focus:to-purple-50 dark:focus:from-blue-900/20 dark:focus:to-purple-900/20 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between w-full py-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getLanguageFlag(language.code)}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {language.nativeName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {language.name}
                    </span>
                  </div>
                </div>
                {currentLanguage === language.code && (
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 