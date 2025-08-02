import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { useQuizStore, type QuizQuestion } from '@/store/quizStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Trash2, Eye, Users, Clock, Target } from 'lucide-react'
import { format } from 'date-fns'

export default function TeacherQuizzes() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { addQuiz, deleteQuiz, getQuizzesByTeacher, getSubmissionsByQuiz } = useQuizStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [showResults, setShowResults] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    dueDate: '',
    questions: [] as QuizQuestion[]
  })

  const teacherQuizzes = getQuizzesByTeacher(user?.id || '')

  const handleCreateQuiz = () => {
    if (formData.title && formData.questions.length > 0) {
      addQuiz({
        title: formData.title,
        description: formData.description,
        questions: formData.questions,
        groupId: 'group1', // Mock group assignment
        teacherId: user?.id || '',
        timeLimit: formData.timeLimit,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        isActive: true
      })
      resetForm()
      setIsDialogOpen(false)
    }
  }

  const handleDeleteQuiz = (quizId: string) => {
    deleteQuiz(quizId)
  }

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctOption: 0,
      points: 10
    }
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
  }

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }))
  }

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      timeLimit: 30,
      dueDate: '',
      questions: []
    })
    setIsEditMode(false)
  }

  const getQuizStats = (quizId: string) => {
    const quizSubmissions = getSubmissionsByQuiz(quizId)
    if (quizSubmissions.length === 0) return { submissions: 0, avgScore: 0 }
    
    const avgScore = quizSubmissions.reduce((sum, sub) => sum + sub.score, 0) / quizSubmissions.length
    return {
      submissions: quizSubmissions.length,
      avgScore: Math.round(avgScore)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('teacher.quizzes')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('teacher.createAndManageQuizzesForStudents')}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex-0 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium" onClick={() => {
              setIsEditMode(false)
              resetForm()
            }}>
              <Plus className="w-4 h-4 mr-2" />
              {t('teacher.createQuiz')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? t('teacher.editQuiz') : t('teacher.createNewQuiz')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">{t('teacher.quizTitle')}</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={t('teacher.enterQuizTitle')}
                  />
                </div>
                <div>
                  <Label htmlFor="timeLimit">{t('teacher.timeLimitMinutes')}</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 30 }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">{t('teacher.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('teacher.enterQuizDescription')}
                />
              </div>
              
              <div>
                <Label htmlFor="dueDate">{t('teacher.dueDate')}</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>

              {/* Questions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>{t('teacher.questions')}</Label>
                  <Button type="button" variant="outline" onClick={addQuestion}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('teacher.addQuestion')}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {formData.questions.map((question, index) => (
                    <Card key={question.id}>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>{t('teacher.question')} {index + 1}</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Input
                            value={question.question}
                            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                            placeholder={t('teacher.enterQuestion')}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>{t('teacher.options')}</Label>
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2 mt-2">
                                  <input
                                    type="radio"
                                    name={`correct-${index}`}
                                    checked={question.correctOption === optionIndex}
                                    onChange={() => updateQuestion(index, 'correctOption', optionIndex)}
                                  />
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...question.options]
                                      newOptions[optionIndex] = e.target.value
                                      updateQuestion(index, 'options', newOptions)
                                    }}
                                    placeholder={`${t('teacher.option')} ${optionIndex + 1}`}
                                  />
                                </div>
                              ))}
                            </div>
                            
                            <div>
                              <Label>{t('teacher.points')}</Label>
                              <Input
                                type="number"
                                value={question.points}
                                onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value) || 0)}
                                min="1"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateQuiz} className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
                  {isEditMode ? t('teacher.updateQuiz') : t('teacher.createQuiz')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quiz Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.totalQuizzes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherQuizzes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.activeQuizzes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {teacherQuizzes.filter(q => q.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.totalSubmissions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {teacherQuizzes.reduce((sum, quiz) => sum + getQuizStats(quiz.id).submissions, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.avgScore')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {teacherQuizzes.length > 0 
                ? Math.round(teacherQuizzes.reduce((sum, quiz) => sum + getQuizStats(quiz.id).avgScore, 0) / teacherQuizzes.length)
                : 0
              }%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quizzes List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('teacher.myQuizzes')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teacherQuizzes.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                {t('teacher.noQuizzesCreatedYet')}
              </p>
            ) : (
              teacherQuizzes.map((quiz) => {
                const stats = getQuizStats(quiz.id)
                return (
                  <div
                    key={quiz.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{quiz.title}</h3>
                          <Badge variant={quiz.isActive ? "default" : "secondary"}>
                            {quiz.isActive ? t('teacher.active') : t('teacher.inactive')}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{quiz.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span>{quiz.questions.length} {t('teacher.questions')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{quiz.timeLimit} {t('teacher.min')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{stats.submissions} {t('teacher.submissions')}</span>
                          </div>
                          {quiz.dueDate && (
                            <span>{t('teacher.due')}: {format(quiz.dueDate, 'MMM dd, yyyy')}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowResults(showResults === quiz.id ? null : quiz.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {t('teacher.results')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Results Table */}
                    {showResults === quiz.id && (
                      <div className="mt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t('teacher.student')}</TableHead>
                              <TableHead>{t('teacher.score')}</TableHead>
                              <TableHead>{t('teacher.timeTaken')}</TableHead>
                              <TableHead>{t('teacher.submitted')}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getSubmissionsByQuiz(quiz.id).map((submission) => (
                              <TableRow key={submission.id}>
                                <TableCell>Student {submission.studentId}</TableCell>
                                <TableCell>{submission.score}/{submission.totalPoints}</TableCell>
                                <TableCell>{submission.timeTaken} min</TableCell>
                                <TableCell>{format(submission.submittedAt, 'MMM dd, yyyy HH:mm')}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 