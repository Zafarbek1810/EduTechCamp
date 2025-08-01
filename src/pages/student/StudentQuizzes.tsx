import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useQuizStore, type Quiz } from '@/store/quizStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, Target, Play, Eye } from 'lucide-react'
import { format } from 'date-fns'

export default function StudentQuizzes() {
  const { user } = useAuthStore()
  const { getQuizzesByGroup, getSubmissionsByStudent, submitQuiz } = useQuizStore()
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ questionId: string; selectedOption: number }[]>([])
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [showResults, setShowResults] = useState<string | null>(null)

  const availableQuizzes = getQuizzesByGroup('group1') // Mock group assignment
  const studentSubmissions = getSubmissionsByStudent(user?.id || '')

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setAnswers([])
    setCurrentQuestionIndex(0)
    setStartTime(new Date())
    setIsQuizOpen(true)
  }

  const handleAnswerQuestion = (questionId: string, selectedOption: number) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId)
      if (existing) {
        return prev.map(a => a.questionId === questionId ? { ...a, selectedOption } : a)
      }
      return [...prev, { questionId, selectedOption }]
    })
  }

  const handleSubmitQuiz = () => {
    if (selectedQuiz && startTime) {
      const endTime = new Date()
      const timeTaken = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))
      
      submitQuiz({
        quizId: selectedQuiz.id,
        studentId: user?.id || '',
        answers,
        timeTaken
      })
      
      setIsQuizOpen(false)
      setSelectedQuiz(null)
      setAnswers([])
      setCurrentQuestionIndex(0)
      setStartTime(null)
    }
  }

  const getSubmissionForQuiz = (quizId: string) => {
    return studentSubmissions.find(sub => sub.quizId === quizId)
  }

  const getProgressPercentage = () => {
    if (!selectedQuiz) return 0
    return Math.round((answers.length / selectedQuiz.questions.length) * 100)
  }

  const getTimeRemaining = () => {
    if (!selectedQuiz?.timeLimit || !startTime) return null
    
    const elapsed = Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60))
    const remaining = selectedQuiz.timeLimit - elapsed
    
    if (remaining <= 0) {
      handleSubmitQuiz()
      return 0
    }
    
    return remaining
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quizzes</h1>
        <p className="text-gray-600 dark:text-gray-400">Take quizzes and view your results</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableQuizzes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{studentSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {studentSubmissions.length > 0 
                ? Math.round(studentSubmissions.reduce((sum, sub) => sum + (sub.score / sub.totalPoints * 100), 0) / studentSubmissions.length)
                : 0
              }%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {studentSubmissions.reduce((sum, sub) => sum + sub.score, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Quizzes */}
      <Card>
        <CardHeader>
          <CardTitle>Available Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableQuizzes.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No quizzes available at the moment
              </p>
            ) : (
              availableQuizzes.map((quiz) => {
                const submission = getSubmissionForQuiz(quiz.id)
                const isCompleted = !!submission
                
                return (
                  <div
                    key={quiz.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{quiz.title}</h3>
                          <Badge variant={isCompleted ? "default" : "secondary"}>
                            {isCompleted ? 'Completed' : 'Available'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{quiz.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span>{quiz.questions.length} questions</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{quiz.timeLimit} min</span>
                          </div>
                          {quiz.dueDate && (
                            <span>Due: {format(quiz.dueDate, 'MMM dd, yyyy')}</span>
                          )}
                        </div>
                        
                        {isCompleted && submission && (
                          <div className="mt-2 flex items-center space-x-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Score: {submission.score}/{submission.totalPoints} 
                              ({Math.round(submission.score / submission.totalPoints * 100)}%)
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Time: {submission.timeTaken} min
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {isCompleted ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowResults(showResults === quiz.id ? null : quiz.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Results
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleStartQuiz(quiz)}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Start Quiz
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Results Details */}
                    {showResults === quiz.id && submission && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-medium mb-2">Quiz Results</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Score:</span>
                            <span className="ml-2 font-medium">{submission.score}/{submission.totalPoints}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Percentage:</span>
                            <span className="ml-2 font-medium">{Math.round(submission.score / submission.totalPoints * 100)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Submitted:</span>
                            <span className="ml-2 font-medium">{format(submission.submittedAt, 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quiz Taking Dialog */}
      <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>
              {selectedQuiz?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedQuiz && (
            <div className="space-y-6">
              {/* Quiz Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                  </span>
                  <Progress value={getProgressPercentage()} className="w-32" />
                </div>
                {getTimeRemaining() !== null && (
                  <div className="flex items-center space-x-1 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeRemaining()} min remaining</span>
                  </div>
                )}
              </div>

              {/* Current Question */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {selectedQuiz.questions[currentQuestionIndex]?.question}
                </h3>
                
                <div className="space-y-2">
                  {selectedQuiz.questions[currentQuestionIndex]?.options.map((option, optionIndex) => {
                    const questionId = selectedQuiz.questions[currentQuestionIndex].id
                    const isSelected = answers.find(a => a.questionId === questionId)?.selectedOption === optionIndex
                    
                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerQuestion(questionId, optionIndex)}
                        className={`w-full p-3 text-left border rounded-lg transition-colors ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <span>{option}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-2">
                  {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
                    <Button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitQuiz}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Submit Quiz
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 