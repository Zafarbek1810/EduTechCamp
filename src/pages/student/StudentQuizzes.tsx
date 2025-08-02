import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('student.quizzes')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('student.takeQuizzesAndViewResults')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('student.availableQuizzes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableQuizzes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('student.completed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{studentSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('student.averageScore')}</CardTitle>
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
            <CardTitle className="text-sm font-medium">{t('student.totalPoints')}</CardTitle>
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
          <CardTitle>{t('student.availableQuizzes')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableQuizzes.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                {t('student.noQuizzesAvailableAtMoment')}
              </p>
            ) : (
              availableQuizzes.map((quiz) => {
                const submission = getSubmissionForQuiz(quiz.id)
                const isCompleted = !!submission
                
                return (
                  <div
                    key={quiz.id}
                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-3">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{quiz.title}</h3>
                          <Badge 
                            variant={isCompleted ? "default" : "secondary"}
                            className={`font-medium px-3 py-1 ${
                              isCompleted 
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm' 
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                            }`}
                          >
                            {isCompleted ? t('student.completed') : t('student.available')}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">{quiz.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium">{quiz.questions.length} {t('student.questions')}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg">
                            <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            <span className="font-medium">{quiz.timeLimit} {t('student.min')}</span>
                          </div>
                          {quiz.dueDate && (
                            <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                              <span className="text-red-600 dark:text-red-400 font-medium">{t('student.due')}: {format(quiz.dueDate, 'MMM dd, yyyy')}</span>
                            </div>
                          )}
                        </div>
                        
                        {isCompleted && submission && (
                          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                    {t('student.score')}: {submission.score}/{submission.totalPoints} 
                                    ({Math.round(submission.score / submission.totalPoints * 100)}%)
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                    {t('student.time')}: {submission.timeTaken} {t('student.min')}
                                  </span>
                                </div>
                              </div>
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {isCompleted ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowResults(showResults === quiz.id ? null : quiz.id)}
                            className="border-green-300 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-400 transition-all duration-200"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {t('student.viewResults')}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleStartQuiz(quiz)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {t('student.startQuiz')}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Results Details */}
                    {showResults === quiz.id && submission && (
                      <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">📊</span>
                          </div>
                          <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100">{t('student.quizResults')}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('student.score')}</div>
                            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{submission.score}/{submission.totalPoints}</div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('student.percentage')}</div>
                            <div className="text-xl font-bold text-green-600 dark:text-green-400">{Math.round(submission.score / submission.totalPoints * 100)}%</div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('student.submitted')}</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{format(submission.submittedAt, 'MMM dd, yyyy HH:mm')}</div>
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
                    {t('student.question')} {currentQuestionIndex + 1} {t('student.of')} {selectedQuiz.questions.length}
                  </span>
                  <Progress value={getProgressPercentage()} className="w-32" />
                </div>
                {getTimeRemaining() !== null && (
                  <div className="flex items-center space-x-1 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeRemaining()} {t('student.minRemaining')}</span>
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
                  {t('student.previous')}
                </Button>
                
                <div className="flex items-center space-x-2">
                  {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
                    <Button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    >
                      {t('student.next')}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitQuiz}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {t('student.submitQuiz')}
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