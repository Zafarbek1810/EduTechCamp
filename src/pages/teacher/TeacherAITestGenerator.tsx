import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  Sparkles,
  Target,
  FileText,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  BarChart3
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface GeneratedTest {
  id: string
  title: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  timeLimit: number
  totalPoints: number
  createdAt: Date
  teacherId: string
  groupId?: string
}

export default function TeacherAITestGenerator() {
  console.log('TeacherAITestGenerator component rendering...')
  
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [targetGroup, setTargetGroup] = useState<string>('all')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTest, setGeneratedTest] = useState<GeneratedTest | null>(null)
  const [error, setError] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'generate' | 'results'>('generate')

    // Mock data for testing
    const teacherGroups = [
      { id: 'group1', name: 'Math Group A' },
      { id: 'group2', name: 'English Group B' }
    ]
    const teacherTests: GeneratedTest[] = [
      {
        id: '1',
        title: 'Algebra Basics Assessment',
        topic: 'Algebra Basics',
        difficulty: 'easy' as const,
        question: 'What is the basic definition of Algebra Basics?',
        options: [
          'The fundamental concept and basic understanding of Algebra Basics',
          'A related but different concept to Algebra Basics',
          'An outdated approach to Algebra Basics',
          'A simplified version of Algebra Basics'
        ],
        correctAnswer: 'The fundamental concept and basic understanding of Algebra Basics',
        explanation: 'This question tests understanding of Algebra Basics at easy level.',
        timeLimit: 5,
        totalPoints: 10,
        createdAt: new Date('2024-01-15'),
        teacherId: '2',
        groupId: 'group1'
      }
    ]

    // AI Test Generation - Single Question with 4 Options
    const generateTestWithAI = async () => {
      if (!selectedTopic.trim()) {
        setError('Please enter a topic')
        return
      }

      setIsGenerating(true)
      setError('')

      try {
        // Generate a single question with 4 options
        const test = generateSingleQuestionTest(selectedTopic, difficulty)
        setGeneratedTest(test)
        
      } catch (error) {
        console.error('Test generation failed:', error)
        setError('Failed to generate test. Please try again.')
      } finally {
        setIsGenerating(false)
      }
    }

    // Generate single question test
    const generateSingleQuestionTest = (topic: string, difficulty: string): GeneratedTest => {
      const questionTypes = {
        easy: [
          `What is the basic definition of ${topic}?`,
          `Which of the following best describes ${topic}?`,
          `What is the main purpose of ${topic}?`
        ],
        medium: [
          `How does ${topic} work in practice?`,
          `What are the key components of ${topic}?`,
          `Which principle is most important in ${topic}?`
        ],
        hard: [
          `What are the advanced applications of ${topic}?`,
          `How does ${topic} relate to other complex concepts?`,
          `What are the theoretical foundations of ${topic}?`
        ]
      }

      const question = questionTypes[difficulty as keyof typeof questionTypes][Math.floor(Math.random() * questionTypes[difficulty as keyof typeof questionTypes].length)]
      
      // Generate 4 options with 1 correct answer
      const options = generateOptions(topic, difficulty)
      const correctAnswer = options[0] // First option is always correct in our mock system

      return {
        id: Date.now().toString(),
        title: `${topic} Assessment`,
        topic,
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        question,
        options,
        correctAnswer,
        explanation: `This question tests understanding of ${topic} at ${difficulty} level.`,
        timeLimit: 5, // 5 minutes for single question
        totalPoints: 10,
        createdAt: new Date(),
        teacherId: '2',
        groupId: targetGroup === 'all' ? undefined : targetGroup || undefined
      }
    }

    // Generate 4 options with 1 correct answer
    const generateOptions = (topic: string, difficulty: string): string[] => {
      const correctOptions = {
        easy: [
          `The fundamental concept and basic understanding of ${topic}`,
          `The core principle that defines ${topic}`,
          `The essential definition of ${topic}`,
          `The basic framework of ${topic}`
        ],
        medium: [
          `The practical application and methodology of ${topic}`,
          `The systematic approach to ${topic}`,
          `The structured process of ${topic}`,
          `The organized method of ${topic}`
        ],
        hard: [
          `The advanced theoretical framework of ${topic}`,
          `The complex analytical approach to ${topic}`,
          `The sophisticated methodology of ${topic}`,
          `The comprehensive understanding of ${topic}`
        ]
      }

      const correct = correctOptions[difficulty as keyof typeof correctOptions][Math.floor(Math.random() * correctOptions[difficulty as keyof typeof correctOptions].length)]
      
      // Generate 3 incorrect options
      const incorrectOptions = [
        `A related but different concept to ${topic}`,
        `An outdated approach to ${topic}`,
        `A common misconception about ${topic}`,
        `An alternative method for ${topic}`,
        `A simplified version of ${topic}`,
        `A complex variation of ${topic}`
      ]

      // Shuffle and select 3 incorrect options
      const shuffled = incorrectOptions.sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, 3)
      
      // Combine correct and incorrect, then shuffle
      const allOptions = [correct, ...selected].sort(() => 0.5 - Math.random())
      
      return allOptions
    }

    // Save test to store
    const saveTest = () => {
      if (!generatedTest) return
      console.log('Saving test:', generatedTest)
      setGeneratedTest(null)
      setSelectedTopic('')
      setTargetGroup('all')
    }

    // Download test as text file
    const downloadTest = () => {
      if (!generatedTest) return
      
      const testContent = `
${generatedTest.title}
Topic: ${generatedTest.topic}
Difficulty: ${generatedTest.difficulty}
Time Limit: ${generatedTest.timeLimit} minutes
Total Points: ${generatedTest.totalPoints}

Question:
${generatedTest.question}

Options:
A. ${generatedTest.options[0]}
B. ${generatedTest.options[1]}
C. ${generatedTest.options[2]}
D. ${generatedTest.options[3]}

Correct Answer: ${generatedTest.correctAnswer}
Explanation: ${generatedTest.explanation}
      `.trim()

      const blob = new Blob([testContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${generatedTest.topic.replace(/\s+/g, '_')}_Test.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bot className="h-8 w-8 text-purple-500" />
              AI Test Generator
            </h1>
            <p className="text-muted-foreground">
              Generate single-question tests with AI for students
            </p>
          </div>
          
          {/* Stats */}
          <Card className="w-full md:w-80">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium">AI Powered</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Creates 1 question with 4 multiple-choice options
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'generate' | 'results')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Test</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Test Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Test Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Topic Selection */}
                  <div className="space-y-4">
                    <Label>Topic or Lesson</Label>
                    <Input
                      placeholder="Enter a topic (e.g., Algebra Basics, World War II, Photosynthesis)"
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                    />
                    {error && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </div>
                    )}
                  </div>

                  {/* Test Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select value={difficulty} onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="targetGroup">Target Group (Optional)</Label>
                      <Select value={targetGroup} onValueChange={setTargetGroup}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Groups</SelectItem>
                          {teacherGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={generateTestWithAI}
                    disabled={isGenerating || !selectedTopic.trim()}
                    className="w-full flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        AI is generating your test...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Test with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    Generated Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedTest ? (
                    <div className="space-y-4">
                      {/* Test Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800">{generatedTest.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-blue-700">
                          <span>Topic: {generatedTest.topic}</span>
                          <Badge variant="outline" className="capitalize">{generatedTest.difficulty}</Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {generatedTest.timeLimit} min
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {generatedTest.totalPoints} pts
                          </span>
                        </div>
                      </div>

                      {/* Question */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Question:</h4>
                        <p className="text-sm mb-4">{generatedTest.question}</p>
                        
                        <h5 className="font-medium mb-2">Options:</h5>
                        <div className="space-y-2">
                          {generatedTest.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span className="text-sm">{option}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <h6 className="font-medium text-green-800 mb-1">Correct Answer:</h6>
                          <p className="text-sm text-green-700">{generatedTest.correctAnswer}</p>
                        </div>
                        
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <h6 className="font-medium text-blue-800 mb-1">Explanation:</h6>
                          <p className="text-sm text-blue-700">{generatedTest.explanation}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button onClick={saveTest} className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Save & Assign to Students
                        </Button>
                        <Button onClick={downloadTest} variant="outline" className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enter a topic and click "Generate Test with AI" to create a single-question assessment.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  Test Results & Student Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {teacherTests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tests have been created yet. Generate a test to see student results.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {teacherTests.map((test: GeneratedTest) => (
                      <div key={test.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{test.title}</h3>
                          <Badge variant="outline" className="capitalize">{test.difficulty}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{test.topic}</p>
                        
                        <p className="text-sm text-muted-foreground">No students have taken this test yet.</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
} 