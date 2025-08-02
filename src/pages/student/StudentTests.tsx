import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Clock, 
  Target, 
  BookOpen, 
  CheckCircle,
  XCircle,
  Play,
  Award,
  BarChart3
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useTestStore } from '@/store/testStore'
import type { Test, TestResult } from '@/store/testStore'

export default function StudentTests() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { getTestsForStudent, submitTestResult, getStudentTestResults } = useTestStore()
  
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available')
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)

  const availableTests = getTestsForStudent(user?.id || '')
  const completedTests = getStudentTestResults(user?.id || '')

  const startTest = (test: Test) => {
    setSelectedTest(test)
    setSelectedAnswer('')
    setShowResult(false)
    setTestResult(null)
  }

  const submitTest = () => {
    if (!selectedTest || !selectedAnswer) return

    setIsSubmitting(true)

    // Simulate test submission
    setTimeout(() => {
      const isCorrect = selectedAnswer === selectedTest.correctAnswer
      const points = isCorrect ? selectedTest.totalPoints : 0

      const result: TestResult = {
        id: Date.now().toString(),
        testId: selectedTest.id,
        studentId: user?.id || '',
        studentName: user?.name || '',
        selectedAnswer,
        isCorrect,
        points,
        completedAt: new Date()
      }

      submitTestResult(result)
      setTestResult(result)
      setShowResult(true)
      setIsSubmitting(false)
    }, 1000)
  }

  const resetTest = () => {
    setSelectedTest(null)
    setSelectedAnswer('')
    setShowResult(false)
    setTestResult(null)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t('student.myTests')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('student.takeAIGeneratedTests')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Stats Card */}
        <Card className="w-full md:w-96 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-green-700">{t('student.performance')}</span>
                <p className="text-sm text-green-600">
                  {completedTests.length} {t('student.testsCompleted')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedTest ? (
        /* Enhanced Test Taking Interface */
        <div className="space-y-8">
          {/* Enhanced Test Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-6">
              <Button
                variant="outline"
                onClick={resetTest}
                className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 transition-colors"
              >
                ← {t('student.backToTests')}
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Play className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-blue-800">{selectedTest.title}</h2>
              </div>
            </div>
            <Badge variant="outline" className="bg-white border-blue-200 text-blue-700 px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              {t('student.testTakingInterface')}
            </Badge>
          </div>

          {/* Enhanced Test Content */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-8">
              {!showResult ? (
                /* Enhanced Test Question */
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-4 mb-4 text-sm text-blue-700">
                      <span className="font-medium">{t('student.topic')}: {selectedTest.topic}</span>
                      <Badge variant="outline" className="capitalize bg-blue-100 text-blue-700 border-blue-200">
                        {selectedTest.difficulty}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedTest.timeLimit} {t('student.timeLimit')}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {selectedTest.totalPoints} {t('student.pts')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-purple-800">{t('student.question')}:</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <p className="text-lg leading-relaxed">{selectedTest.question}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                        <h4 className="font-semibold text-green-700">{t('student.selectYourAnswer')}</h4>
                      </div>
                      <div className="space-y-3">
                        {selectedTest.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-3 group">
                            <input
                              type="radio"
                              id={`option-${index}`}
                              name="answer"
                              value={option}
                              checked={selectedAnswer === option}
                              onChange={(e) => setSelectedAnswer(e.target.value)}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`option-${index}`} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group-hover:shadow-sm">
                              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span className="text-sm font-medium">{option}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={submitTest}
                      disabled={!selectedAnswer || isSubmitting}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {t('student.submitting')}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          {t('student.submitAnswer')}
                        </>
                      )}
                    </Button>
                    <Button onClick={resetTest} variant="outline" className="border-gray-300 hover:bg-gray-50">
                      {t('student.cancel')}
                    </Button>
                  </div>
                </div>
              ) : (
                /* Enhanced Test Result */
                <div className="space-y-8">
                  <div className={`p-6 rounded-xl border-2 ${testResult?.isCorrect ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      {testResult?.isCorrect ? (
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                          <XCircle className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className={`text-2xl font-bold ${testResult?.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                          {testResult?.isCorrect ? t('student.correct') : t('student.incorrect')}
                        </h3>
                        <p className={`text-lg ${testResult?.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          {t('student.youEarned')} {testResult?.points} {t('student.points')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Target className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="font-semibold text-blue-800">{t('student.yourAnswer')}</h4>
                      </div>
                      <p className="text-sm text-blue-700 font-medium">{testResult?.selectedAnswer}</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="font-semibold text-green-800">{t('student.correctAnswer')}</h4>
                      </div>
                      <p className="text-sm text-green-700 font-medium">{selectedTest.correctAnswer}</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <Brain className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="font-semibold text-purple-800">{t('student.explanation')}</h4>
                      </div>
                      <p className="text-sm text-purple-700">{selectedTest.explanation}</p>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <Button onClick={resetTest} className="flex items-center gap-2 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                      <BookOpen className="h-4 w-4" />
                      {t('student.backToTests')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Enhanced Test List */
        <div className="space-y-8">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'available' | 'completed')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-1 rounded-xl">
              <TabsTrigger 
                value="available" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  {t('student.availableTests')}
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md rounded-lg transition-all"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t('student.completedTests')}
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-6 mt-6">
              {availableTests.length === 0 ? (
                <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200">
                  <CardContent className="pt-8">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('student.noTestsAvailableAtMoment')}</h3>
                      <p className="text-gray-500">Check back later for new tests!</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableTests.map((test) => (
                    <Card 
                      key={test.id} 
                      className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-blue-50 border-blue-200 group cursor-pointer"
                      onClick={() => startTest(test)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg text-blue-800 group-hover:text-blue-900 transition-colors">
                            {test.title}
                          </CardTitle>
                          <Badge variant="outline" className="capitalize bg-blue-100 text-blue-700 border-blue-200">
                            {test.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Target className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm text-purple-700 font-medium">{test.topic}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-orange-500" />
                            {test.timeLimit} {t('student.timeLimit')}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {test.totalPoints} {t('student.pts')}
                          </span>
                        </div>
                        
                        <Button 
                          className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg group-hover:shadow-xl transition-all"
                        >
                          <Play className="h-4 w-4" />
                          {t('student.startTest')}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-6 mt-6">
              {completedTests.length === 0 ? (
                <Card className="bg-gradient-to-br from-gray-50 to-green-50 border-gray-200">
                  <CardContent className="pt-8">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BarChart3 className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('student.noCompletedTestsYet')}</h3>
                      <p className="text-gray-500">Complete your first test to see results here!</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {completedTests.map((result) => {
                    const test = availableTests.find(t => t.id === result.testId)
                    return (
                      <Card key={result.id} className="bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-lg transition-all">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-white" />
                              </div>
                              <h3 className="font-semibold text-lg">{test?.title || 'Test'}</h3>
                            </div>
                            <Badge variant={result.isCorrect ? "default" : "destructive"} className="px-3 py-1">
                              {result.isCorrect ? t('student.correct') : t('student.incorrect')}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3 text-purple-500" />
                              {test?.topic}
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {result.points} {t('student.pts')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-orange-500" />
                              {result.completedAt.toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                            <p className="text-sm">
                              <span className="font-medium text-blue-800">{t('student.yourAnswer')}:</span> 
                              <span className="text-blue-700 ml-2">{result.selectedAnswer}</span>
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
} 