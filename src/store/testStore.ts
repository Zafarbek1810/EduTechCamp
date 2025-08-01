import { create } from 'zustand'

export interface Test {
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

export interface TestResult {
  id: string
  testId: string
  studentId: string
  studentName: string
  selectedAnswer: string
  isCorrect: boolean
  points: number
  completedAt: Date
}

interface TestStore {
  tests: Test[]
  testResults: TestResult[]
  addTest: (test: Test) => void
  submitTestResult: (result: TestResult) => void
  getTestsByTeacher: (teacherId: string) => Test[]
  getTestsForStudent: (studentId: string) => Test[]
  getTestResults: (testId: string) => TestResult[]
  getStudentTestResults: (studentId: string) => TestResult[]
}

// Mock data
const mockTests: Test[] = [
  {
    id: '1',
    title: 'Algebra Basics Assessment',
    topic: 'Algebra Basics',
    difficulty: 'easy',
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
  },
  {
    id: '2',
    title: 'World War II Assessment',
    topic: 'World War II',
    difficulty: 'medium',
    question: 'How does World War II work in practice?',
    options: [
      'The practical application and methodology of World War II',
      'A related but different concept to World War II',
      'An alternative method for World War II',
      'A complex variation of World War II'
    ],
    correctAnswer: 'The practical application and methodology of World War II',
    explanation: 'This question tests understanding of World War II at medium level.',
    timeLimit: 5,
    totalPoints: 10,
    createdAt: new Date('2024-01-16'),
    teacherId: '2',
    groupId: 'group2'
  }
]

const mockTestResults: TestResult[] = [
  {
    id: '1',
    testId: '1',
    studentId: '3',
    studentName: 'Alice Johnson',
    selectedAnswer: 'The fundamental concept and basic understanding of Algebra Basics',
    isCorrect: true,
    points: 10,
    completedAt: new Date('2024-01-15T10:30:00')
  },
  {
    id: '2',
    testId: '1',
    studentId: '4',
    studentName: 'Bob Smith',
    selectedAnswer: 'A related but different concept to Algebra Basics',
    isCorrect: false,
    points: 0,
    completedAt: new Date('2024-01-15T11:15:00')
  },
  {
    id: '3',
    testId: '2',
    studentId: '3',
    studentName: 'Alice Johnson',
    selectedAnswer: 'The practical application and methodology of World War II',
    isCorrect: true,
    points: 10,
    completedAt: new Date('2024-01-16T09:45:00')
  }
]

export const useTestStore = create<TestStore>((set, get) => ({
  tests: mockTests,
  testResults: mockTestResults,

  addTest: (test: Test) => {
    set((state) => ({
      tests: [...state.tests, test]
    }))
  },

  submitTestResult: (result: TestResult) => {
    set((state) => ({
      testResults: [...state.testResults, result]
    }))
  },

  getTestsByTeacher: (teacherId: string) => {
    const { tests } = get()
    return tests.filter(test => test.teacherId === teacherId)
  },

  getTestsForStudent: (studentId: string) => {
    const { tests } = get()
    // For now, return all tests. In a real app, you'd filter by student's group
    return tests
  },

  getTestResults: (testId: string) => {
    const { testResults } = get()
    return testResults.filter(result => result.testId === testId)
  },

  getStudentTestResults: (studentId: string) => {
    const { testResults } = get()
    return testResults.filter(result => result.studentId === studentId)
  }
})) 