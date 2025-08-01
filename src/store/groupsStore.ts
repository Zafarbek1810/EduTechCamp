import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Group {
  id: string
  name: string
  teacherId: string
  subject: string
  studentCount: number
  lessonDays: string[]
  lessonTime: string
  description?: string
  createdAt: string
}

interface GroupsState {
  groups: Group[]
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => void
  updateGroup: (id: string, group: Partial<Group>) => void
  deleteGroup: (id: string) => void
  getGroupsByTeacher: (teacherId: string) => Group[]
  getGroup: (id: string) => Group | undefined
}

// Mock initial groups data
const initialGroups: Group[] = [
  {
    id: '1',
    name: 'Math A',
    teacherId: '2', // teacher1
    subject: 'Mathematics',
    studentCount: 12,
    lessonDays: ['Monday', 'Wednesday', 'Friday'],
    lessonTime: '09:00 - 10:30',
    description: 'Advanced mathematics for high school students',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Math B',
    teacherId: '2',
    subject: 'Mathematics',
    studentCount: 10,
    lessonDays: ['Tuesday', 'Thursday'],
    lessonTime: '14:00 - 15:30',
    description: 'Intermediate mathematics course',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Physics A',
    teacherId: '2',
    subject: 'Physics',
    studentCount: 8,
    lessonDays: ['Monday', 'Wednesday'],
    lessonTime: '11:00 - 12:30',
    description: 'Introduction to physics concepts',
    createdAt: '2024-02-01'
  },
  {
    id: '4',
    name: 'Chemistry A',
    teacherId: '2',
    subject: 'Chemistry',
    studentCount: 15,
    lessonDays: ['Tuesday', 'Thursday', 'Saturday'],
    lessonTime: '16:00 - 17:30',
    description: 'Basic chemistry principles',
    createdAt: '2024-02-10'
  }
]

export const useGroupsStore = create<GroupsState>()(
  persist(
    (set, get) => ({
      groups: initialGroups,
      
      addGroup: (group) => {
        const newGroup: Group = {
          ...group,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0]
        }
        set((state) => ({
          groups: [...state.groups, newGroup]
        }))
      },
      
      updateGroup: (id, group) => {
        set((state) => ({
          groups: state.groups.map(g => 
            g.id === id ? { ...g, ...group } : g
          )
        }))
      },
      
      deleteGroup: (id) => {
        set((state) => ({
          groups: state.groups.filter(g => g.id !== id)
        }))
      },
      
      getGroupsByTeacher: (teacherId) => {
        return get().groups.filter(g => g.teacherId === teacherId)
      },
      
      getGroup: (id) => {
        return get().groups.find(g => g.id === id)
      }
    }),
    {
      name: 'groups-storage'
    }
  )
) 