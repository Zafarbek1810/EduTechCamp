import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Keyboard, 
  Clock, 
  Trophy, 
  RotateCcw, 
  Play, 
  Pause,
  Target,
  Star,
  Zap
} from 'lucide-react'

const wordLists = {
  easy: [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'
  ],
  medium: [
    'computer', 'technology', 'education', 'knowledge', 'experience', 'development', 'information', 'communication', 'application', 'understanding'
  ],
  hard: [
    'sophisticated', 'extraordinary', 'revolutionary', 'comprehensive', 'technological', 'philosophical', 'mathematical', 'psychological', 'environmental', 'international'
  ]
}

export function TypingSpeedGame() {
  const { t } = useTranslation()
  const [currentWord, setCurrentWord] = useState('')
  const [userInput, setUserInput] = useState('')
  const [wordList, setWordList] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [isGameActive, setIsGameActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [totalWords, setTotalWords] = useState(0)
  const [correctWords, setCorrectWords] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [startTime, setStartTime] = useState<number | null>(null)
  
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize game
  const initializeGame = () => {
    const words = [...wordLists[difficulty]]
    const shuffledWords = words.sort(() => Math.random() - 0.5).slice(0, 50)
    setWordList(shuffledWords)
    setCurrentWordIndex(0)
    setCurrentWord(shuffledWords[0])
    setUserInput('')
    setTimeLeft(300)
    setIsGameActive(true)
    setIsPaused(false)
    setScore(0)
    setWpm(0)
    setAccuracy(100)
    setTotalWords(0)
    setCorrectWords(0)
    setGameCompleted(false)
    setStartTime(null)
    
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Handle input change
  const handleInputChange = (value: string) => {
    if (!isGameActive || isPaused) return

    setUserInput(value)
    
    if (!startTime) {
      setStartTime(Date.now())
    }

    if (value.endsWith(' ')) {
      const typedWord = value.trim()
      const expectedWord = currentWord
      
      setTotalWords(prev => prev + 1)
      
      if (typedWord === expectedWord) {
        setCorrectWords(prev => prev + 1)
        setScore(prev => prev + 10)
      }
      
      const nextIndex = currentWordIndex + 1
      if (nextIndex < wordList.length) {
        setCurrentWordIndex(nextIndex)
        setCurrentWord(wordList[nextIndex])
        setUserInput('')
      } else {
        // Game completed
        setIsGameActive(false)
        setGameCompleted(true)
        calculateFinalStats()
      }
    }
  }

  // Calculate final statistics
  const calculateFinalStats = () => {
    if (!startTime) return
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60 // in minutes
    const calculatedWpm = Math.round(correctWords / timeElapsed)
    const calculatedAccuracy = Math.round((correctWords / totalWords) * 100)
    
    setWpm(calculatedWpm)
    setAccuracy(calculatedAccuracy)
    
    const finalScore = calculatedWpm * calculatedAccuracy / 10
    setScore(finalScore)
    
    if (finalScore > highScore) {
      setHighScore(finalScore)
    }
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isGameActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsGameActive(false)
            calculateFinalStats()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isGameActive, isPaused, timeLeft])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress
  const progress = wordList.length > 0 ? (currentWordIndex / wordList.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Keyboard className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-bold">{t('games.typingSpeedGame')}</h3>
          </div>
          <Badge variant={isGameActive ? "default" : "secondary"}>
            {isGameActive ? t('games.playing') : t('games.ready')}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <span>{wpm} {t('games.wpm')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-green-500" />
            <span>{accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>{t('games.progress')}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Game Controls */}
      <div className="flex items-center gap-2">
        {!isGameActive ? (
          <div className="flex items-center gap-2">
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="px-3 py-2 border rounded-md"
            >
              <option value="easy">{t('games.easy')}</option>
              <option value="medium">{t('games.medium')}</option>
              <option value="hard">{t('games.hard')}</option>
            </select>
            <Button onClick={initializeGame} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              {t('games.startGame')}
            </Button>
          </div>
        ) : (
          <>
            <Button 
              onClick={() => setIsPaused(!isPaused)} 
              variant="outline"
              className="flex items-center gap-2"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? t('games.resume') : t('games.pause')}
            </Button>
            <Button 
              onClick={initializeGame} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {t('games.restart')}
            </Button>
          </>
        )}
      </div>

      {/* Game Area */}
      {isGameActive && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Current Word Display */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{t('games.typeThisWord')}</p>
                <div className="text-3xl font-bold text-blue-600 bg-blue-50 p-4 rounded-lg">
                  {currentWord}
                </div>
              </div>

              {/* Input Field */}
              <div className="text-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={t('games.startTyping')}
                  className="w-full max-w-md px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isGameActive || isPaused}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t('games.wordsTyped')}</p>
                  <p className="text-xl font-bold">{totalWords}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('games.correct')}</p>
                  <p className="text-xl font-bold text-green-600">{correctWords}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('games.score')}</p>
                  <p className="text-xl font-bold text-yellow-600">{score}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Results */}
      {gameCompleted && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Star className="h-6 w-6" />
              {t('games.greatJob')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t('games.wpm')}</p>
                  <p className="text-2xl font-bold text-blue-600">{wpm}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('games.accuracy')}</p>
                  <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t('games.finalScore')}</p>
                  <p className="text-2xl font-bold text-yellow-600">{Math.round(score)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('games.highScore')}</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.round(highScore)}</p>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={initializeGame} className="flex items-center gap-2 mx-auto">
                  <RotateCcw className="h-4 w-4" />
                  {t('games.playAgain')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Over */}
      {!isGameActive && timeLeft === 0 && !gameCompleted && (
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Clock className="h-6 w-6" />
              {t('games.timesUp')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                {t('games.youRanOutOfTimeTyping')}
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{t('games.wpm')}</p>
                  <p className="text-xl font-bold">{wpm}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{t('games.accuracy')}</p>
                  <p className="text-xl font-bold">{accuracy}%</p>
                </div>
              </div>
              <Button onClick={initializeGame} className="flex items-center gap-2 mx-auto">
                <RotateCcw className="h-4 w-4" />
                {t('games.tryAgain')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {!isGameActive && wordList.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('games.howToPlay')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {t('games.typingGameInstructions', { returnObjects: true }).map((instruction: string, index: number) => (
                <p key={index}>{instruction}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 