import { useState, lazy, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gamepad2, Brain, Keyboard, Trophy, Clock, Target, BookOpen } from 'lucide-react'

// Lazy load game components to prevent loading issues
const MemoryGame = lazy(() => import('@/components/games/MemoryGame').then(module => ({ default: module.MemoryGame })))
const TypingSpeedGame = lazy(() => import('@/components/games/TypingSpeedGame').then(module => ({ default: module.TypingSpeedGame })))
const EnglishLearningGame = lazy(() => import('@/components/games/EnglishLearningGame').then(module => ({ default: module.EnglishLearningGame })))

export default function StudentGames() {
  console.log('StudentGames component rendering...')
  
  const [activeGame, setActiveGame] = useState<'memory' | 'typing' | 'english' | null>(null)

  console.log('Active game state:', activeGame)

  const renderGameComponent = () => {
    if (!activeGame) return null

    return (
      <Suspense fallback={
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading game...</p>
        </div>
      }>
        {activeGame === 'memory' && <MemoryGame />}
        {activeGame === 'typing' && <TypingSpeedGame />}
        {activeGame === 'english' && <EnglishLearningGame />}
      </Suspense>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-purple-500" />
            Break Time Games
          </h1>
          <p className="text-muted-foreground">
            Take a break and have fun with these brain-boosting games!
          </p>
        </div>
        
        {/* Break Timer Info */}
        <Card className="w-full md:w-80">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Break Time</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Perfect for your 5-minute Pomodoro breaks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Game Selection */}
      {!activeGame ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Memory Game Card */}
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
            onClick={() => setActiveGame('memory')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-500" />
                  Memory Game
                </CardTitle>
                <Badge variant="secondary">Brain Training</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Test your memory by matching pairs of cards. Find all matches to win!
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-green-500" />
                  <span>Improve concentration</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span>Beat your high score</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Quick 5-minute sessions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typing Speed Game Card */}
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
            onClick={() => setActiveGame('typing')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="h-6 w-6 text-green-500" />
                  Typing Speed Game
                </CardTitle>
                <Badge variant="secondary">Skill Building</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Improve your typing speed and accuracy with fun word challenges!
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-green-500" />
                  <span>Enhance typing skills</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span>Track your progress</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Quick 5-minute sessions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* English Learning Game Card */}
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
            onClick={() => setActiveGame('english')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-purple-500" />
                  English Learning Game
                </CardTitle>
                <Badge variant="secondary">Language Learning</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Improve your English skills with vocabulary, grammar, and sentence building challenges!
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-green-500" />
                  <span>Learn vocabulary & grammar</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span>Practice English skills</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Perfect for English groups</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Active Game View */
        <div className="space-y-6">
          {/* Game Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setActiveGame(null)}
                className="flex items-center gap-2"
              >
                ← Back to Games
              </Button>
              <h2 className="text-2xl font-bold">
                {activeGame === 'memory' ? 'Memory Game' : 
                 activeGame === 'typing' ? 'Typing Speed Game' : 
                 'English Learning Game'}
              </h2>
            </div>
            <Badge variant="outline">
              Break Time Activity
            </Badge>
          </div>

          {/* Game Component */}
          <Card>
            <CardContent className="p-6">
              {renderGameComponent()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Benefits Info */}
      {!activeGame && (
        <Card>
          <CardHeader>
            <CardTitle>Why Play During Breaks?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Mental Refresh</h3>
                <p className="text-sm text-muted-foreground">
                  Give your brain a different kind of workout
                </p>
              </div>
              <div className="text-center">
                <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Skill Building</h3>
                <p className="text-sm text-muted-foreground">
                  Improve memory, typing, and concentration
                </p>
              </div>
              <div className="text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Fun Challenge</h3>
                <p className="text-sm text-muted-foreground">
                  Enjoyable way to spend your break time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 