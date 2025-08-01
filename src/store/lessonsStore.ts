import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Lesson {
  id: string
  groupId: string
  teacherId: string
  topic: string
  date: string
  homework: string
  description?: string
  createdAt: string
}

interface LessonsState {
  lessons: Lesson[]
  addLesson: (lesson: Omit<Lesson, 'id' | 'createdAt'>) => void
  updateLesson: (id: string, lesson: Partial<Lesson>) => void
  deleteLesson: (id: string) => void
  getLessonsByGroup: (groupId: string) => Lesson[]
  getLessonsByTeacher: (teacherId: string) => Lesson[]
  getLesson: (id: string) => Lesson | undefined
}

// Mock initial lessons data
const initialLessons: Lesson[] = [
  {
    id: '1',
    groupId: '1',
    teacherId: '2',
    topic: 'Introduction to Algebra',
    date: '2024-01-15',
    homework: 'Complete exercises 1-10 in Chapter 2',
    description: 'Basic algebraic concepts and operations',
    createdAt: '2024-01-14'
  },
  {
    id: '2',
    groupId: '1',
    teacherId: '2',
    topic: 'Linear Equations',
    date: '2024-01-17',
    homework: 'Solve problems 1-15 in workbook',
    description: 'Solving linear equations with one variable',
    createdAt: '2024-01-16'
  },
  {
    id: '3',
    groupId: '2',
    teacherId: '2',
    topic: 'Quadratic Functions',
    date: '2024-01-16',
    homework: 'Practice quadratic formula problems',
    description: 'Understanding quadratic functions and graphs',
    createdAt: '2024-01-15'
  },
  {
    id: '4',
    groupId: '3',
    teacherId: '2',
    topic: 'Newton\'s Laws of Motion',
    date: '2024-01-15',
    homework: 'Read Chapter 4 and complete lab report',
    description: 'Introduction to classical mechanics',
    createdAt: '2024-01-14'
  },
  {
    id: '5',
    groupId: '4',
    teacherId: '2',
    topic: 'Chemical Bonding',
    date: '2024-01-16',
    homework: 'Complete molecular structure worksheet',
    description: 'Ionic and covalent bonding concepts',
    createdAt: '2024-01-15'
  }
]

export const useLessonsStore = create<LessonsState>()(
  persist(
    (set, get) => ({
      lessons: initialLessons,
      
      addLesson: (lesson) => {
        const newLesson: Lesson = {
          ...lesson,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0]
        }
        set((state) => ({
          lessons: [...state.lessons, newLesson]
        }))
      },
      
      updateLesson: (id, lesson) => {
        set((state) => ({
          lessons: state.lessons.map(l => 
            l.id === id ? { ...l, ...lesson } : l
          )
        }))
      },
      
      deleteLesson: (id) => {
        set((state) => ({
          lessons: state.lessons.filter(l => l.id !== id)
        }))
      },
      
      getLessonsByGroup: (groupId) => {
        return get().lessons.filter(l => l.groupId === groupId)
      },
      
      getLessonsByTeacher: (teacherId) => {
        return get().lessons.filter(l => l.teacherId === teacherId)
      },
      
      getLesson: (id) => {
        return get().lessons.find(l => l.id === id)
      }
    }),
    {
      name: 'lessons-storage'
    }
  )
) 