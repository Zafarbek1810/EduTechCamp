import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctOption: number
  points: number
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
  groupId: string
  teacherId: string
  timeLimit?: number // in minutes
  totalPoints: number
  createdAt: Date
  dueDate?: Date
  isActive: boolean
}

export interface QuizSubmission {
  id: string
  quizId: string
  studentId: string
  answers: { questionId: string; selectedOption: number }[]
  score: number
  totalPoints: number
  submittedAt: Date
  timeTaken: number // in minutes
}

interface QuizState {
  quizzes: Quiz[]
  submissions: QuizSubmission[]
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'totalPoints'>) => void
  updateQuiz: (id: string, quiz: Partial<Quiz>) => void
  deleteQuiz: (id: string) => void
  submitQuiz: (submission: Omit<QuizSubmission, 'id' | 'score' | 'totalPoints' | 'submittedAt'>) => QuizSubmission
  getQuizzesByTeacher: (teacherId: string) => Quiz[]
  getQuizzesByGroup: (groupId: string) => Quiz[]
  getSubmissionsByStudent: (studentId: string) => QuizSubmission[]
  getSubmissionsByQuiz: (quizId: string) => QuizSubmission[]
  calculateScore: (quiz: Quiz, answers: { questionId: string; selectedOption: number }[]) => { score: number; totalPoints: number }
}

// Mock data
const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Mathematics Quiz - Algebra',
    description: 'Test your knowledge of basic algebra concepts',
    questions: [
      {
        id: 'q1',
        question: 'What is the value of x in the equation 2x + 5 = 13?',
        options: ['3', '4', '5', '6'],
        correctOption: 1,
        points: 10
      },
      {
        id: 'q2',
        question: 'Simplify: (x + 2)(x - 3)',
        options: ['x² - x - 6', 'x² + x - 6', 'x² - x + 6', 'x² + x + 6'],
        correctOption: 0,
        points: 15
      },
      {
        id: 'q3',
        question: 'Solve for y: 3y - 7 = 8',
        options: ['3', '4', '5', '6'],
        correctOption: 2,
        points: 10
      }
    ],
    groupId: 'group1',
    teacherId: 'teacher1',
    timeLimit: 30,
    totalPoints: 35,
    createdAt: new Date('2024-01-10'),
    dueDate: new Date('2024-01-20'),
    isActive: true
  },
  {
    id: '2',
    title: 'English Grammar Quiz',
    description: 'Test your understanding of English grammar rules',
    questions: [
      {
        id: 'q4',
        question: 'Which sentence is grammatically correct?',
        options: [
          'Me and him went to the store',
          'He and I went to the store',
          'Him and me went to the store',
          'I and he went to the store'
        ],
        correctOption: 1,
        points: 10
      },
      {
        id: 'q5',
        question: 'Choose the correct form: "Neither the teacher nor the students _____ present."',
        options: ['was', 'were', 'is', 'are'],
        correctOption: 1,
        points: 15
      }
    ],
    groupId: 'group1',
    teacherId: 'teacher2',
    timeLimit: 20,
    totalPoints: 25,
    createdAt: new Date('2024-01-12'),
    dueDate: new Date('2024-01-18'),
    isActive: true
  }
]

const mockSubmissions: QuizSubmission[] = [
  {
    id: 'sub1',
    quizId: '1',
    studentId: 'student1',
    answers: [
      { questionId: 'q1', selectedOption: 1 },
      { questionId: 'q2', selectedOption: 0 },
      { questionId: 'q3', selectedOption: 2 }
    ],
    score: 35,
    totalPoints: 35,
    submittedAt: new Date('2024-01-15'),
    timeTaken: 25
  }
]

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      quizzes: mockQuizzes,
      submissions: mockSubmissions,
      
      addQuiz: (quizData) => {
        const totalPoints = quizData.questions.reduce((sum, q) => sum + q.points, 0)
        const newQuiz: Quiz = {
          ...quizData,
          id: Date.now().toString(),
          createdAt: new Date(),
          totalPoints
        }
        set((state) => ({
          quizzes: [...state.quizzes, newQuiz]
        }))
      },
      
      updateQuiz: (id, updatedQuiz) => {
        set((state) => ({
          quizzes: state.quizzes.map(quiz => {
            if (quiz.id === id) {
              const updated = { ...quiz, ...updatedQuiz }
              if (updated.questions) {
                updated.totalPoints = updated.questions.reduce((sum, q) => sum + q.points, 0)
              }
              return updated
            }
            return quiz
          })
        }))
      },
      
      deleteQuiz: (id) => {
        set((state) => ({
          quizzes: state.quizzes.filter(quiz => quiz.id !== id),
          submissions: state.submissions.filter(sub => sub.quizId !== id)
        }))
      },
      
      submitQuiz: (submissionData) => {
        const quiz = get().quizzes.find(q => q.id === submissionData.quizId)
        if (!quiz) {
          throw new Error('Quiz not found')
        }
        
        const { score, totalPoints } = get().calculateScore(quiz, submissionData.answers)
        
        const submission: QuizSubmission = {
          ...submissionData,
          id: Date.now().toString(),
          score,
          totalPoints,
          submittedAt: new Date()
        }
        
        set((state) => ({
          submissions: [...state.submissions, submission]
        }))
        
        return submission
      },
      
      getQuizzesByTeacher: (teacherId) => {
        const { quizzes } = get()
        return quizzes.filter(quiz => quiz.teacherId === teacherId)
      },
      
      getQuizzesByGroup: (groupId) => {
        const { quizzes } = get()
        return quizzes.filter(quiz => quiz.groupId === groupId && quiz.isActive)
      },
      
      getSubmissionsByStudent: (studentId) => {
        const { submissions } = get()
        return submissions.filter(sub => sub.studentId === studentId)
      },
      
      getSubmissionsByQuiz: (quizId) => {
        const { submissions } = get()
        return submissions.filter(sub => sub.quizId === quizId)
      },
      
      calculateScore: (quiz, answers) => {
        let score = 0
        const totalPoints = quiz.totalPoints
        
        answers.forEach(answer => {
          const question = quiz.questions.find(q => q.id === answer.questionId)
          if (question && answer.selectedOption === question.correctOption) {
            score += question.points
          }
        })
        
        return { score, totalPoints }
      }
    }),
    {
      name: 'quiz-storage'
    }
  )
) 