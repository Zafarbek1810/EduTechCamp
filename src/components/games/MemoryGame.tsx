import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Clock, 
  Trophy, 
  RotateCcw, 
  Play, 
  Pause,
  Target,
  Star
} from 'lucide-react'

interface CardItem {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

const emojis = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎯', '🎲', '🎮', '🎨', '🎭']

export function MemoryGame() {
  console.log('MemoryGame component rendering...')
  
  try {
    const [cards, setCards] = useState<CardItem[]>([])
    const [flippedCards, setFlippedCards] = useState<number[]>([])
    const [moves, setMoves] = useState(0)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
    const [isGameActive, setIsGameActive] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [highScore, setHighScore] = useState(0)
    const [gameCompleted, setGameCompleted] = useState(false)

    // Initialize game
    const initializeGame = () => {
      console.log('Initializing Memory Game...')
      const shuffledEmojis = [...emojis].sort(() => Math.random() - 0.5)
      const newCards: CardItem[] = shuffledEmojis.map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      
      setCards(newCards)
      setFlippedCards([])
      setMoves(0)
      setScore(0)
      setTimeLeft(300)
      setIsGameActive(true)
      setIsPaused(false)
      setGameCompleted(false)
    }

    // Handle card click
    const handleCardClick = (cardId: number) => {
      if (!isGameActive || isPaused) return
      
      const card = cards.find(c => c.id === cardId)
      if (!card || card.isFlipped || card.isMatched) return

      const newCards = [...cards]
      newCards[cardId].isFlipped = true
      setCards(newCards)

      const newFlippedCards = [...flippedCards, cardId]
      setFlippedCards(newFlippedCards)

      if (newFlippedCards.length === 2) {
        setMoves(prev => prev + 1)
        
        const [firstId, secondId] = newFlippedCards
        const firstCard = newCards[firstId]
        const secondCard = newCards[secondId]

        if (firstCard.emoji === secondCard.emoji) {
          // Match found
          newCards[firstId].isMatched = true
          newCards[secondId].isMatched = true
          setCards(newCards)
          setScore(prev => prev + 10)
          setFlippedCards([])

          // Check if game is completed
          const allMatched = newCards.every(card => card.isMatched)
          if (allMatched) {
            setIsGameActive(false)
            setGameCompleted(true)
            const finalScore = score + 10 + Math.floor(timeLeft / 10)
            setScore(finalScore)
            if (finalScore > highScore) {
              setHighScore(finalScore)
            }
          }
        } else {
          // No match, flip cards back after delay
          setTimeout(() => {
            newCards[firstId].isFlipped = false
            newCards[secondId].isFlipped = false
            setCards(newCards)
            setFlippedCards([])
          }, 1000)
        }
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
    const progress = cards.length > 0 ? (cards.filter(card => card.isMatched).length / cards.length) * 100 : 0

    return (
      <div className="space-y-6">
        {/* Game Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-500" />
              <h3 className="text-xl font-bold">Memory Game</h3>
            </div>
            <Badge variant={isGameActive ? "default" : "secondary"}>
              {isGameActive ? "Playing" : "Ready"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <span>{moves} moves</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>{score} pts</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Game Controls */}
        <div className="flex items-center gap-2">
          {!isGameActive ? (
            <Button onClick={initializeGame} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start Game
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => setIsPaused(!isPaused)} 
                variant="outline"
                className="flex items-center gap-2"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button 
                onClick={initializeGame} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Restart
              </Button>
            </>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-lg border-2 cursor-pointer transition-all duration-300 flex items-center justify-center text-2xl font-bold
                ${card.isMatched 
                  ? 'bg-green-100 border-green-300 text-green-600' 
                  : card.isFlipped 
                    ? 'bg-blue-100 border-blue-300 text-blue-600' 
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }
                ${!isGameActive || isPaused ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {(card.isFlipped || card.isMatched) ? card.emoji : '❓'}
            </div>
          ))}
        </div>

        {/* Game Results */}
        {gameCompleted && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Star className="h-6 w-6" />
                Congratulations!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Final Score</p>
                    <p className="text-2xl font-bold text-green-600">{score}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">High Score</p>
                    <p className="text-2xl font-bold text-yellow-600">{highScore}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Time Remaining: {formatTime(timeLeft)}</p>
                  <Button onClick={initializeGame} className="flex items-center gap-2 mx-auto">
                    <RotateCcw className="h-4 w-4" />
                    Play Again
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
                Time's Up!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You ran out of time! Try again to improve your score.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="text-xl font-bold">{score}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Moves</p>
                    <p className="text-xl font-bold">{moves}</p>
                  </div>
                </div>
                <Button onClick={initializeGame} className="flex items-center gap-2 mx-auto">
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!isGameActive && cards.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• Click cards to flip them and find matching pairs</p>
                <p>• You have 5 minutes to complete the game</p>
                <p>• Score points for each match and time remaining</p>
                <p>• Try to complete the game with fewer moves for a higher score</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error in MemoryGame component:', error)
    return (
      <div className="p-6">
        <h3 className="text-lg font-bold text-red-600">Error Loading Memory Game</h3>
        <p className="text-muted-foreground">There was an error loading the memory game.</p>
        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs">{error?.toString()}</pre>
      </div>
    )
  }
} 