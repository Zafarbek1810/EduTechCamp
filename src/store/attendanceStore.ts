import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AttendanceRecord {
  id: string
  groupId: string
  lessonId: string
  date: string
  records: StudentAttendance[]
  createdAt: string
}

export interface StudentAttendance {
  studentId: string
  studentName: string
  isPresent: boolean
  homeworkDone: boolean
  points: number
  notes?: string
}

interface AttendanceState {
  attendanceRecords: AttendanceRecord[]
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id' | 'createdAt'>) => void
  updateAttendanceRecord: (id: string, record: Partial<AttendanceRecord>) => void
  deleteAttendanceRecord: (id: string) => void
  getAttendanceByGroup: (groupId: string) => AttendanceRecord[]
  getAttendanceByDate: (groupId: string, date: string) => AttendanceRecord | undefined
  getAttendanceByLesson: (lessonId: string) => AttendanceRecord | undefined
  getStudentAttendanceStats: (studentId: string) => {
    totalSessions: number
    presentCount: number
    homeworkDoneCount: number
    averagePoints: number
  }
}

// Mock initial attendance data
const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    groupId: '1',
    lessonId: '1',
    date: '2024-01-15',
    records: [
      { studentId: '1', studentName: 'Alice Johnson', isPresent: true, homeworkDone: true, points: 8 },
      { studentId: '2', studentName: 'Bob Smith', isPresent: true, homeworkDone: false, points: 6 },
      { studentId: '3', studentName: 'Carol Davis', isPresent: false, homeworkDone: false, points: 0 },
      { studentId: '4', studentName: 'David Wilson', isPresent: true, homeworkDone: true, points: 9 },
      { studentId: '5', studentName: 'Eva Brown', isPresent: true, homeworkDone: true, points: 10 }
    ],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    groupId: '1',
    lessonId: '2',
    date: '2024-01-17',
    records: [
      { studentId: '1', studentName: 'Alice Johnson', isPresent: true, homeworkDone: true, points: 9 },
      { studentId: '2', studentName: 'Bob Smith', isPresent: true, homeworkDone: true, points: 7 },
      { studentId: '3', studentName: 'Carol Davis', isPresent: true, homeworkDone: false, points: 5 },
      { studentId: '4', studentName: 'David Wilson', isPresent: false, homeworkDone: false, points: 0 },
      { studentId: '5', studentName: 'Eva Brown', isPresent: true, homeworkDone: true, points: 10 }
    ],
    createdAt: '2024-01-17'
  },
  {
    id: '3',
    groupId: '2',
    lessonId: '3',
    date: '2024-01-16',
    records: [
      { studentId: '6', studentName: 'Frank Miller', isPresent: true, homeworkDone: true, points: 8 },
      { studentId: '7', studentName: 'Grace Lee', isPresent: true, homeworkDone: false, points: 6 },
      { studentId: '8', studentName: 'Henry Taylor', isPresent: true, homeworkDone: true, points: 9 },
      { studentId: '9', studentName: 'Ivy Chen', isPresent: false, homeworkDone: false, points: 0 },
      { studentId: '10', studentName: 'Jack Anderson', isPresent: true, homeworkDone: true, points: 10 }
    ],
    createdAt: '2024-01-16'
  }
]

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      attendanceRecords: initialAttendanceRecords,
      
      addAttendanceRecord: (record) => {
        const newRecord: AttendanceRecord = {
          ...record,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0]
        }
        set((state) => ({
          attendanceRecords: [...state.attendanceRecords, newRecord]
        }))
      },
      
      updateAttendanceRecord: (id, record) => {
        set((state) => ({
          attendanceRecords: state.attendanceRecords.map(r => 
            r.id === id ? { ...r, ...record } : r
          )
        }))
      },
      
      deleteAttendanceRecord: (id) => {
        set((state) => ({
          attendanceRecords: state.attendanceRecords.filter(r => r.id !== id)
        }))
      },
      
      getAttendanceByGroup: (groupId) => {
        return get().attendanceRecords.filter(r => r.groupId === groupId)
      },
      
      getAttendanceByDate: (groupId, date) => {
        return get().attendanceRecords.find(r => r.groupId === groupId && r.date === date)
      },
      
      getAttendanceByLesson: (lessonId) => {
        return get().attendanceRecords.find(r => r.lessonId === lessonId)
      },
      
      getStudentAttendanceStats: (studentId) => {
        const records = get().attendanceRecords
        const studentRecords = records.flatMap(r => 
          r.records.filter(sr => sr.studentId === studentId)
        )
        
        const totalSessions = studentRecords.length
        const presentCount = studentRecords.filter(r => r.isPresent).length
        const homeworkDoneCount = studentRecords.filter(r => r.homeworkDone).length
        const totalPoints = studentRecords.reduce((sum, r) => sum + r.points, 0)
        const averagePoints = totalSessions > 0 ? totalPoints / totalSessions : 0
        
        return {
          totalSessions,
          presentCount,
          homeworkDoneCount,
          averagePoints
        }
      }
    }),
    {
      name: 'attendance-storage'
    }
  )
) 