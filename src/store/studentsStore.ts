import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Student {
  id: string
  fullName: string
  phoneNumber: string
  email: string
  group: string
  teacherId: string
  monthlyFee: number
  points: number
}

interface StudentsState {
  students: Student[]
  addStudent: (student: Omit<Student, 'id'>) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  deleteStudent: (id: string) => void
  getStudent: (id: string) => Student | undefined
  getStudentsByTeacher: (teacherId: string) => Student[]
}

// Mock initial students data
const initialStudents: Student[] = [
  {
    id: '1',
    fullName: 'Alice Johnson',
    phoneNumber: '+1 555-0201',
    email: 'alice.johnson@student.com',
    group: 'Math Group A',
    teacherId: '1',
    monthlyFee: 500,
    points: 150
  },
  {
    id: '2',
    fullName: 'Bob Wilson',
    phoneNumber: '+1 555-0202',
    email: 'bob.wilson@student.com',
    group: 'Math Group A',
    teacherId: '1',
    monthlyFee: 500,
    points: 200
  },
  {
    id: '3',
    fullName: 'Carol Davis',
    phoneNumber: '+1 555-0203',
    email: 'carol.davis@student.com',
    group: 'English Group B',
    teacherId: '2',
    monthlyFee: 450,
    points: 120
  },
  {
    id: '4',
    fullName: 'David Miller',
    phoneNumber: '+1 555-0204',
    email: 'david.miller@student.com',
    group: 'Science Group C',
    teacherId: '3',
    monthlyFee: 550,
    points: 180
  },
  {
    id: '5',
    fullName: 'Emma Brown',
    phoneNumber: '+1 555-0205',
    email: 'emma.brown@student.com',
    group: 'Science Group C',
    teacherId: '3',
    monthlyFee: 550,
    points: 220
  }
]

export const useStudentsStore = create<StudentsState>()(
  persist(
    (set, get) => ({
      students: initialStudents,
      
      addStudent: (student) => {
        const newStudent = {
          ...student,
          id: Date.now().toString(),
          points: 0
        }
        set(state => ({
          students: [...state.students, newStudent]
        }))
      },
      
      updateStudent: (id, student) => {
        set(state => ({
          students: state.students.map(s => 
            s.id === id ? { ...s, ...student } : s
          )
        }))
      },
      
      deleteStudent: (id) => {
        set(state => ({
          students: state.students.filter(s => s.id !== id)
        }))
      },
      
      getStudent: (id) => {
        const state = get()
        return state.students.find(s => s.id === id)
      },
      
      getStudentsByTeacher: (teacherId) => {
        const state = get()
        return state.students.filter(s => s.teacherId === teacherId)
      }
    }),
    {
      name: 'students-storage'
    }
  )
) 