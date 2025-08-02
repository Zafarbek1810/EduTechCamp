import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  RotateCcw, 
  Play, 
  Pause,
  Target,
  Star,
  Brain,
  CheckCircle,
  XCircle,
  Lightbulb
} from 'lucide-react'

interface Question {
  id: number
  type: 'vocabulary' | 'grammar' | 'sentence'
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const vocabularyQuestions: Question[] = [
  {
    id: 1,
    type: 'vocabulary',
    question: 'What is the meaning of "endeavor"?',
    options: ['To try hard', 'To give up', 'To sleep', 'To eat'],
    correctAnswer: 'To try hard',
    explanation: 'Endeavor means to try hard to achieve something.',
    difficulty: 'medium'
  },
  {
    id: 2,
    type: 'vocabulary',
    question: 'Choose the correct synonym for "beautiful":',
    options: ['Ugly', 'Pretty', 'Big', 'Small'],
    correctAnswer: 'Pretty',
    explanation: 'Beautiful and pretty are synonyms meaning attractive.',
    difficulty: 'easy'
  },
  {
    id: 3,
    type: 'vocabulary',
    question: 'What does "perseverance" mean?',
    options: ['Giving up easily', 'Continuing despite difficulties', 'Being lazy', 'Being angry'],
    correctAnswer: 'Continuing despite difficulties',
    explanation: 'Perseverance is the quality of continuing despite difficulties.',
    difficulty: 'hard'
  },
  {
    id: 4,
    type: 'vocabulary',
    question: 'Select the correct meaning of "eloquent":',
    options: ['Fluent and persuasive', 'Quiet and shy', 'Angry and loud', 'Slow and unclear'],
    correctAnswer: 'Fluent and persuasive',
    explanation: 'Eloquent means fluent and persuasive in speech.',
    difficulty: 'medium'
  },
  {
    id: 5,
    type: 'vocabulary',
    question: 'What is the opposite of "generous"?',
    options: ['Kind', 'Stingy', 'Happy', 'Sad'],
    correctAnswer: 'Stingy',
    explanation: 'Generous means giving freely, stingy means unwilling to give.',
    difficulty: 'easy'
  }
]

const grammarQuestions: Question[] = [
  {
    id: 6,
    type: 'grammar',
    question: 'Choose the correct form: "She _____ to the store yesterday."',
    options: ['go', 'goes', 'went', 'going'],
    correctAnswer: 'went',
    explanation: 'Use past tense "went" for actions completed in the past.',
    difficulty: 'easy'
  },
  {
    id: 7,
    type: 'grammar',
    question: 'Which sentence is grammatically correct?',
    options: [
      'I have been working here since 2 years.',
      'I have been working here for 2 years.',
      'I am working here since 2 years.',
      'I work here since 2 years.'
    ],
    correctAnswer: 'I have been working here for 2 years.',
    explanation: 'Use "for" with present perfect continuous, not "since" with duration.',
    difficulty: 'medium'
  },
  {
    id: 8,
    type: 'grammar',
    question: 'Complete: "If I _____ rich, I would travel the world."',
    options: ['am', 'was', 'were', 'will be'],
    correctAnswer: 'were',
    explanation: 'Use "were" in hypothetical situations (second conditional).',
    difficulty: 'hard'
  },
  {
    id: 9,
    type: 'grammar',
    question: 'Choose the correct article: "_____ university is expensive."',
    options: ['A', 'An', 'The', 'No article'],
    correctAnswer: 'The',
    explanation: 'Use "the" when referring to a specific university.',
    difficulty: 'medium'
  },
  {
    id: 10,
    type: 'grammar',
    question: 'Which is the correct passive voice?',
    options: [
      'The book was written by Shakespeare.',
      'The book wrote by Shakespeare.',
      'The book is writing by Shakespeare.',
      'The book writes by Shakespeare.'
    ],
    correctAnswer: 'The book was written by Shakespeare.',
    explanation: 'Passive voice uses "was/were + past participle".',
    difficulty: 'hard'
  }
]

const sentenceQuestions: Question[] = [
  {
    id: 11,
    type: 'sentence',
    question: 'Arrange the words to form a correct sentence:',
    options: [
      'always / she / early / wakes / up',
      'she / always / wakes / up / early',
      'wakes / she / always / up / early',
      'always / wakes / she / up / early'
    ],
    correctAnswer: 'she / always / wakes / up / early',
    explanation: 'Subject + adverb + verb + particle + adverb is the correct order.',
    difficulty: 'medium'
  },
  {
    id: 12,
    type: 'sentence',
    question: 'Choose the sentence with correct punctuation:',
    options: [
      'I love reading, writing, and studying.',
      'I love reading writing and studying.',
      'I love reading, writing and studying.',
      'I love reading writing, and studying.'
    ],
    correctAnswer: 'I love reading, writing, and studying.',
    explanation: 'Use commas to separate items in a series (Oxford comma).',
    difficulty: 'easy'
  },
  {
    id: 13,
    type: 'sentence',
    question: 'Which sentence uses the correct tense?',
    options: [
      'I am studying English for 3 years.',
      'I have been studying English for 3 years.',
      'I study English for 3 years.',
      'I studied English for 3 years.'
    ],
    correctAnswer: 'I have been studying English for 3 years.',
    explanation: 'Use present perfect continuous for actions that started in the past and continue.',
    difficulty: 'hard'
  },
  {
    id: 14,
    type: 'sentence',
    question: 'Complete: "Not only _____ she speak English, _____ she also speaks French."',
    options: ['does / but', 'do / but', 'does / and', 'do / and'],
    correctAnswer: 'does / but',
    explanation: 'Use "does" for third person singular and "but" for contrast.',
    difficulty: 'hard'
  },
  {
    id: 15,
    type: 'sentence',
    question: 'Choose the correct word order:',
    options: [
      'I yesterday went to the store.',
      'I went yesterday to the store.',
      'I went to the store yesterday.',
      'Yesterday I went to the store.'
    ],
    correctAnswer: 'I went to the store yesterday.',
    explanation: 'Place time expressions at the end of the sentence.',
    difficulty: 'medium'
  }
]

const allQuestions = [...vocabularyQuestions, ...grammarQuestions, ...sentenceQuestions]

export function EnglishLearningGame() {
  const { t } = useTranslation()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [isGameActive, setIsGameActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [gameMode, setGameMode] = useState<'vocabulary' | 'grammar' | 'sentence' | 'mixed'>('mixed')
  const [questions, setQuestions] = useState<Question[]>([])
  const [showExplanation, setShowExplanation] = useState(false)

  // Initialize game
  const initializeGame = () => {
    let filteredQuestions = allQuestions
    
    // Filter by game mode
    if (gameMode !== 'mixed') {
      filteredQuestions = allQuestions.filter(q => q.type === gameMode)
    }
    
    // Filter by difficulty
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty)
    
    // Shuffle and take first 10 questions
    const shuffledQuestions = filteredQuestions.sort(() => Math.random() - 0.5).slice(0, 10)
    
    setQuestions(shuffledQuestions)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setCorrectAnswers(0)
    setTimeLeft(300)
    setIsGameActive(true)
    setIsPaused(false)
    setGameCompleted(false)
    setShowExplanation(false)
  }

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (isAnswered || !isGameActive || isPaused) return
    
    setSelectedAnswer(answer)
    setIsAnswered(true)
    setShowExplanation(true)
    
    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = answer === currentQuestion.correctAnswer
    
    if (isCorrect) {
      setScore(prev => prev + 10)
      setCorrectAnswers(prev => prev + 1)
    }
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer(null)
        setIsAnswered(false)
        setShowExplanation(false)
      } else {
        // Game completed
        setIsGameActive(false)
        setGameCompleted(true)
        const finalScore = score + (isCorrect ? 10 : 0) + Math.floor(timeLeft / 10)
        setScore(finalScore)
        if (finalScore > highScore) {
          setHighScore(finalScore)
        }
      }
    }, 3000)
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
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-500" />
            <h3 className="text-xl font-bold">{t('games.englishLearningGame')}</h3>
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
            <Target className="h-4 w-4 text-green-500" />
            <span>{currentQuestionIndex + 1}/{questions.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>{score} {t('games.points')}</span>
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
              value={gameMode} 
              onChange={(e) => setGameMode(e.target.value as any)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="mixed">{t('games.mixed')}</option>
              <option value="vocabulary">{t('games.vocabulary')}</option>
              <option value="grammar">{t('games.grammar')}</option>
              <option value="sentence">{t('games.sentenceBuilding')}</option>
            </select>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value as any)}
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
      {isGameActive && currentQuestion && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize">
                  {currentQuestion.type}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {currentQuestion.difficulty}
                </Badge>
              </div>

              {/* Question */}
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options?.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isAnswered}
                    className={`justify-start text-left h-auto p-4 ${
                      isAnswered
                        ? option === currentQuestion.correctAnswer
                          ? 'bg-green-100 border-green-300 text-green-700'
                          : option === selectedAnswer
                          ? 'bg-red-100 border-red-300 text-red-700'
                          : 'bg-gray-100 border-gray-300'
                        : 'hover:bg-blue-50'
                    }`}
                    variant="outline"
                  >
                    <div className="flex items-center gap-3">
                      {isAnswered && option === currentQuestion.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">{t('games.explanation')}</h4>
                        <p className="text-blue-700">{currentQuestion.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
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
              {t('games.excellentWork')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t('games.score')}</p>
                  <p className="text-2xl font-bold text-green-600">{score}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('games.accuracy')}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0}%
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t('games.correct')} {t('games.answers')}</p>
                  <p className="text-2xl font-bold text-purple-600">{correctAnswers}/{questions.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('games.highScore')}</p>
                  <p className="text-2xl font-bold text-yellow-600">{highScore}</p>
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
                {t('games.youRanOutOfTimeEnglish')}
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{t('games.score')}</p>
                  <p className="text-xl font-bold">{score}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{t('games.correct')}</p>
                  <p className="text-xl font-bold">{correctAnswers}</p>
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
      {!isGameActive && questions.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('games.howToPlay')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2 text-sm">
                {Array.isArray(t('games.englishGameInstructions', { returnObjects: true })) && 
                  (t('games.englishGameInstructions', { returnObjects: true }) as string[]).map((instruction: string, index: number) => (
                  <p key={index}>{instruction}</p>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold">{t('games.vocabulary')}</h4>
                  <p className="text-xs text-muted-foreground">{t('games.learnNewWords')}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold">{t('games.grammar')}</h4>
                  <p className="text-xs text-muted-foreground">{t('games.practiceGrammarRules')}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Target className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold">{t('games.sentenceBuilding')}</h4>
                  <p className="text-xs text-muted-foreground">{t('games.constructProperSentences')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 