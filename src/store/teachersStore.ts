import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Teacher {
  id: string
  fullName: string
  phoneNumber: string
  email: string
  subject: string
  salary: number
  studentsCount: number
  totalFeesContributed: number
  kpi: number
}

interface TeachersState {
  teachers: Teacher[]
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void
  deleteTeacher: (id: string) => void
  getTeacher: (id: string) => Teacher | undefined
}

// Mock initial teachers data
const initialTeachers: Teacher[] = [
  {
    id: '1',
    fullName: 'John Smith',
    phoneNumber: '+1-555-0101',
    email: 'john.smith@edu.com',
    subject: 'Mathematics',
    salary: 5000,
    studentsCount: 25,
    totalFeesContributed: 15000,
    kpi: 85
  },
  {
    id: '2',
    fullName: 'Sarah Johnson',
    phoneNumber: '+1-555-0102',
    email: 'sarah.johnson@edu.com',
    subject: 'Physics',
    salary: 4800,
    studentsCount: 20,
    totalFeesContributed: 12000,
    kpi: 78
  },
  {
    id: '3',
    fullName: 'Michael Brown',
    phoneNumber: '+1-555-0103',
    email: 'michael.brown@edu.com',
    subject: 'Chemistry',
    salary: 5200,
    studentsCount: 30,
    totalFeesContributed: 18000,
    kpi: 92
  },
  {
    id: '4',
    fullName: 'Emily Davis',
    phoneNumber: '+1-555-0104',
    email: 'emily.davis@edu.com',
    subject: 'Biology',
    salary: 4600,
    studentsCount: 18,
    totalFeesContributed: 10800,
    kpi: 75
  }
]

export const useTeachersStore = create<TeachersState>()(
  persist(
    (set, get) => ({
      teachers: initialTeachers,
      
      addTeacher: (teacher) => {
        const newTeacher: Teacher = {
          ...teacher,
          id: Date.now().toString()
        }
        set((state) => ({
          teachers: [...state.teachers, newTeacher]
        }))
      },
      
      updateTeacher: (id, teacher) => {
        set((state) => ({
          teachers: state.teachers.map(t => 
            t.id === id ? { ...t, ...teacher } : t
          )
        }))
      },
      
      deleteTeacher: (id) => {
        set((state) => ({
          teachers: state.teachers.filter(t => t.id !== id)
        }))
      },
      
      getTeacher: (id) => {
        return get().teachers.find(t => t.id === id)
      }
    }),
    {
      name: 'teachers-storage'
    }
  )
) 