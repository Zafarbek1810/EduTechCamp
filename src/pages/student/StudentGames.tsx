import { useState, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gamepad2, Brain, Keyboard, Trophy, Clock, Target, BookOpen, Sparkles, Star } from 'lucide-react'

// Lazy load game components to prevent loading issues
const MemoryGame = lazy(() => import('@/components/games/MemoryGame').then(module => ({ default: module.MemoryGame })))
const TypingSpeedGame = lazy(() => import('@/components/games/TypingSpeedGame').then(module => ({ default: module.TypingSpeedGame })))
const EnglishLearningGame = lazy(() => import('@/components/games/EnglishLearningGame').then(module => ({ default: module.EnglishLearningGame })))

export default function StudentGames() {
  const { t } = useTranslation()
  console.log('StudentGames component rendering...')
  
  const [activeGame, setActiveGame] = useState<'memory' | 'typing' | 'english' | null>(null)

  console.log('Active game state:', activeGame)

  const renderGameComponent = () => {
    if (!activeGame) return null

    return (
      <Suspense fallback={
        <div className="text-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg">{t('student.loadingGame')}</p>
        </div>
      }>
        {activeGame === 'memory' && <MemoryGame />}
        {activeGame === 'typing' && <TypingSpeedGame />}
        {activeGame === 'english' && <EnglishLearningGame />}
      </Suspense>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('student.breakTimeGames')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('student.takeBreakAndHaveFun')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Break Timer Info */}
        <Card className="w-full md:w-96 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-orange-700">{t('student.breakTime')}</span>
                <p className="text-sm text-orange-600">
                  {t('student.perfectForPomodoroBreaks')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Game Selection */}
      {!activeGame ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Memory Game Card */}
          <Card 
            className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 group"
            onClick={() => setActiveGame('memory')}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-blue-800">{t('student.memoryGame')}</CardTitle>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  {t('student.brainTraining')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t('student.testMemoryMatchingPairs')}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-green-700">{t('student.improveConcentration')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                  </div>
                  <span className="font-medium text-yellow-700">{t('student.beatHighScore')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-blue-700">{t('student.quick5MinuteSessions')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typing Speed Game Card */}
          <Card 
            className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 group"
            onClick={() => setActiveGame('typing')}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Keyboard className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-green-800">{t('student.typingSpeedGame')}</CardTitle>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  {t('student.skillBuilding')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t('student.improveTypingSpeedAccuracy')}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-green-700">{t('student.enhanceTypingSkills')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                  </div>
                  <span className="font-medium text-yellow-700">{t('student.trackProgress')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-blue-700">{t('student.quick5MinuteSessions')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* English Learning Game Card */}
          <Card 
            className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 group"
            onClick={() => setActiveGame('english')}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-purple-800">{t('student.englishLearningGame')}</CardTitle>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                  {t('student.languageLearning')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t('student.improveEnglishSkills')}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-green-700">{t('student.learnVocabularyGrammar')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                  </div>
                  <span className="font-medium text-yellow-700">{t('student.practiceEnglishSkills')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-blue-700">{t('student.perfectForEnglishGroups')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Enhanced Active Game View */
        <div className="space-y-8">
          {/* Enhanced Game Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center gap-6">
              <Button
                variant="outline"
                onClick={() => setActiveGame(null)}
                className="flex items-center gap-2 bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800 transition-colors"
              >
                ← {t('student.backToGames')}
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  {activeGame === 'memory' ? <Brain className="h-5 w-5 text-white" /> :
                   activeGame === 'typing' ? <Keyboard className="h-5 w-5 text-white" /> :
                   <BookOpen className="h-5 w-5 text-white" />}
                </div>
                <h2 className="text-2xl font-bold text-purple-800">
                  {activeGame === 'memory' ? t('student.memoryGame') : 
                   activeGame === 'typing' ? t('student.typingSpeedGame') : 
                   t('student.englishLearningGame')}
                </h2>
              </div>
            </div>
            <Badge variant="outline" className="bg-white border-purple-200 text-purple-700 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              {t('student.breakTimeActivity')}
            </Badge>
          </div>

          {/* Enhanced Game Component */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-8">
              {renderGameComponent()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Game Benefits Info */}
      {!activeGame && (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="h-8 w-8 text-yellow-500" />
              <CardTitle className="text-2xl font-bold text-indigo-800">{t('student.whyPlayDuringBreaks')}</CardTitle>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-blue-800">{t('student.mentalRefresh')}</h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {t('student.giveBrainDifferentWorkout')}
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-green-800">{t('student.skillBuilding')}</h3>
                <p className="text-sm text-green-700 leading-relaxed">
                  {t('student.improveMemoryTypingConcentration')}
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-yellow-800">{t('student.funChallenge')}</h3>
                <p className="text-sm text-yellow-700 leading-relaxed">
                  {t('student.enjoyableWayToSpendBreak')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 