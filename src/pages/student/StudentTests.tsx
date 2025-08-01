import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Play,
  BarChart3,
  Award
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useTestStore, Test, TestResult } from '@/store/testStore'

export default function StudentTests() {
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-500" />
            My Tests
          </h1>
          <p className="text-muted-foreground">
            Take AI-generated tests and track your performance
          </p>
        </div>
        
        {/* Stats */}
        <Card className="w-full md:w-80">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Performance</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {completedTests.length} tests completed
            </p>
          </CardContent>
        </Card>
      </div>

      {selectedTest ? (
        /* Test Taking Interface */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-500" />
              {selectedTest.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showResult ? (
              /* Test Question */
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4 mb-2 text-sm text-blue-700">
                    <span>Topic: {selectedTest.topic}</span>
                    <Badge variant="outline" className="capitalize">{selectedTest.difficulty}</Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedTest.timeLimit} min
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {selectedTest.totalPoints} pts
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Question:</h3>
                  <p className="text-lg">{selectedTest.question}</p>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Select your answer:</h4>
                    {selectedTest.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id={`option-${index}`}
                          name="answer"
                          value={option}
                          checked={selectedAnswer === option}
                          onChange={(e) => setSelectedAnswer(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <label htmlFor={`option-${index}`} className="flex items-center gap-2 cursor-pointer">
                          <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-sm">{option}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={submitTest}
                    disabled={!selectedAnswer || isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Submit Answer
                      </>
                    )}
                  </Button>
                  <Button onClick={resetTest} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* Test Result */
              <div className="space-y-6">
                <div className={`p-4 rounded-lg ${testResult?.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {testResult?.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <h3 className={`font-semibold ${testResult?.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {testResult?.isCorrect ? 'Correct!' : 'Incorrect'}
                    </h3>
                  </div>
                  <p className={`text-sm ${testResult?.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    You earned {testResult?.points} points
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-1">Your Answer:</h4>
                    <p className="text-sm text-blue-700">{testResult?.selectedAnswer}</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-1">Correct Answer:</h4>
                    <p className="text-sm text-green-700">{selectedTest.correctAnswer}</p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-1">Explanation:</h4>
                    <p className="text-sm text-purple-700">{selectedTest.explanation}</p>
                  </div>
                </div>

                <Button onClick={resetTest} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Back to Tests
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Test List */
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'available' | 'completed')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Tests</TabsTrigger>
            <TabsTrigger value="completed">Completed Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {availableTests.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tests available at the moment.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableTests.map((test) => (
                  <Card key={test.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{test.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">{test.difficulty}</Badge>
                        <span className="text-sm text-muted-foreground">{test.topic}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {test.timeLimit} min
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {test.totalPoints} pts
                        </span>
                      </div>
                      
                      <Button 
                        onClick={() => startTest(test)}
                        className="w-full flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Start Test
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedTests.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No completed tests yet.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedTests.map((result) => {
                  const test = availableTests.find(t => t.id === result.testId)
                  return (
                    <Card key={result.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{test?.title || 'Test'}</h3>
                          <Badge variant={result.isCorrect ? "default" : "destructive"}>
                            {result.isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>{test?.topic}</span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {result.points} pts
                          </span>
                          <span>{result.completedAt.toLocaleDateString()}</span>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded">
                          <p className="text-sm">
                            <span className="font-medium">Your Answer:</span> {result.selectedAnswer}
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
      )}
    </div>
  )
} 