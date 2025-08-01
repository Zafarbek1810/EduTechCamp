import { create } from 'zustand'

export interface Homework {
  id: string
  title: string
  subject: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
  estimatedTime: number
  completed: boolean
  description: string
  studentId?: string
  teacherId?: string
  groupId?: string
  createdAt: Date
  updatedAt: Date
}

interface HomeworkStore {
  homework: Homework[]
  completedTasks: string[]
  
  // Actions
  addHomework: (homework: Omit<Homework, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateHomework: (id: string, updates: Partial<Homework>) => void
  deleteHomework: (id: string) => void
  toggleCompletion: (taskId: string) => void
  markAsCompleted: (taskId: string) => void
  markAsPending: (taskId: string) => void
  getHomeworkByStudent: (studentId: string) => Homework[]
  getHomeworkByTeacher: (teacherId: string) => Homework[]
  getHomeworkByGroup: (groupId: string) => Homework[]
  getPendingHomework: (studentId: string) => Homework[]
  getCompletedHomework: (studentId: string) => Homework[]
}

// Mock homework data
const mockHomework: Homework[] = [
  {
    id: '1',
    title: 'Math: Algebra Problems',
    subject: 'Mathematics',
    dueDate: '2025-08-02',
    priority: 'high',
    estimatedTime: 45,
    completed: false,
    description: 'Complete exercises 1-15 from Chapter 4',
    studentId: '3', // student1
    teacherId: '2', // teacher1
    groupId: 'Math Group A',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'English: Essay Draft',
    subject: 'English Literature',
    dueDate: '2025-08-05',
    priority: 'medium',
    estimatedTime: 90,
    completed: false,
    description: 'Write a 500-word essay on "The Impact of Technology"',
    studentId: '3', // student1
    teacherId: '2', // teacher1
    groupId: 'English Group B',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    title: 'Science: Lab Report',
    subject: 'Chemistry',
    dueDate: '2025-08-01',
    priority: 'high',
    estimatedTime: 60,
    completed: true,
    description: 'Complete lab report for the acid-base experiment',
    studentId: '3', // student1
    teacherId: '2', // teacher1
    groupId: 'Science Group C',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '4',
    title: 'History: Research Paper',
    subject: 'World History',
    dueDate: '2025-08-10',
    priority: 'medium',
    estimatedTime: 120,
    completed: false,
    description: 'Research and write a paper on the Industrial Revolution',
    studentId: '6', // student2
    teacherId: '5', // teacher2
    groupId: 'History Group D',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '5',
    title: 'Physics: Problem Set',
    subject: 'Physics',
    dueDate: '2025-08-03',
    priority: 'high',
    estimatedTime: 75,
    completed: false,
    description: 'Solve problems 1-20 from Chapter 3 on mechanics',
    studentId: '6', // student2
    teacherId: '5', // teacher2
    groupId: 'Physics Group E',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
]

export const useHomeworkStore = create<HomeworkStore>((set, get) => ({
  homework: mockHomework,
  completedTasks: mockHomework.filter(h => h.completed).map(h => h.id),

  addHomework: (homeworkData) => {
    const newHomework: Homework = {
      ...homeworkData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    set(state => ({
      homework: [...state.homework, newHomework],
      completedTasks: newHomework.completed 
        ? [...state.completedTasks, newHomework.id]
        : state.completedTasks
    }))
  },

  updateHomework: (id, updates) => {
    set(state => ({
      homework: state.homework.map(h => 
        h.id === id 
          ? { ...h, ...updates, updatedAt: new Date() }
          : h
      ),
      completedTasks: updates.completed !== undefined
        ? updates.completed
          ? [...state.completedTasks, id]
          : state.completedTasks.filter(taskId => taskId !== id)
        : state.completedTasks
    }))
  },

  deleteHomework: (id) => {
    set(state => ({
      homework: state.homework.filter(h => h.id !== id),
      completedTasks: state.completedTasks.filter(taskId => taskId !== id)
    }))
  },

  toggleCompletion: (taskId) => {
    set(state => {
      const homework = state.homework.find(h => h.id === taskId)
      if (!homework) return state

      const isCompleted = state.completedTasks.includes(taskId)
      
      return {
        homework: state.homework.map(h => 
          h.id === taskId 
            ? { ...h, completed: !isCompleted, updatedAt: new Date() }
            : h
        ),
        completedTasks: isCompleted
          ? state.completedTasks.filter(id => id !== taskId)
          : [...state.completedTasks, taskId]
      }
    })
  },

  markAsCompleted: (taskId) => {
    set(state => ({
      homework: state.homework.map(h => 
        h.id === taskId 
          ? { ...h, completed: true, updatedAt: new Date() }
          : h
      ),
      completedTasks: state.completedTasks.includes(taskId)
        ? state.completedTasks
        : [...state.completedTasks, taskId]
    }))
  },

  markAsPending: (taskId) => {
    set(state => ({
      homework: state.homework.map(h => 
        h.id === taskId 
          ? { ...h, completed: false, updatedAt: new Date() }
          : h
      ),
      completedTasks: state.completedTasks.filter(id => id !== taskId)
    }))
  },

  getHomeworkByStudent: (studentId) => {
    return get().homework.filter(h => h.studentId === studentId)
  },

  getHomeworkByTeacher: (teacherId) => {
    return get().homework.filter(h => h.teacherId === teacherId)
  },

  getHomeworkByGroup: (groupId) => {
    return get().homework.filter(h => h.groupId === groupId)
  },

  getPendingHomework: (studentId) => {
    return get().homework.filter(h => h.studentId === studentId && !h.completed)
  },

  getCompletedHomework: (studentId) => {
    return get().homework.filter(h => h.studentId === studentId && h.completed)
  },
})) 