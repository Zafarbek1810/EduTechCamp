import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  type: 'lesson' | 'homework' | 'quiz' | 'exam'
  description?: string
  groupId?: string
  teacherId?: string
  studentId?: string
  color?: string
}

interface CalendarState {
  events: CalendarEvent[]
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
  getEventsByUser: (userId: string, userRole: string) => CalendarEvent[]
  getEventsByDateRange: (start: Date, end: Date) => CalendarEvent[]
}

// Mock data
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Mathematics Lesson',
    start: new Date(2024, 0, 15, 9, 0),
    end: new Date(2024, 0, 15, 10, 30),
    type: 'lesson',
    description: 'Advanced algebra concepts',
    groupId: 'group1',
    teacherId: 'teacher1',
    color: '#3B82F6'
  },
  {
    id: '2',
    title: 'English Homework Due',
    start: new Date(2024, 0, 16, 23, 59),
    end: new Date(2024, 0, 16, 23, 59),
    type: 'homework',
    description: 'Essay on Shakespeare',
    groupId: 'group1',
    teacherId: 'teacher2',
    color: '#EF4444'
  },
  {
    id: '3',
    title: 'Science Quiz',
    start: new Date(2024, 0, 17, 14, 0),
    end: new Date(2024, 0, 17, 15, 0),
    type: 'quiz',
    description: 'Chemistry chapter 5',
    groupId: 'group1',
    teacherId: 'teacher3',
    color: '#10B981'
  },
  {
    id: '4',
    title: 'History Lesson',
    start: new Date(2024, 0, 18, 11, 0),
    end: new Date(2024, 0, 18, 12, 30),
    type: 'lesson',
    description: 'World War II',
    groupId: 'group1',
    teacherId: 'teacher4',
    color: '#F59E0B'
  }
]

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: mockEvents,
      
      addEvent: (event) => {
        const newEvent: CalendarEvent = {
          ...event,
          id: Date.now().toString()
        }
        set((state) => ({
          events: [...state.events, newEvent]
        }))
      },
      
      updateEvent: (id, updatedEvent) => {
        set((state) => ({
          events: state.events.map(event => 
            event.id === id ? { ...event, ...updatedEvent } : event
          )
        }))
      },
      
      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter(event => event.id !== id)
        }))
      },
      
      getEventsByUser: (userId, userRole) => {
        const { events } = get()
        if (userRole === 'teacher') {
          return events.filter(event => event.teacherId === userId)
        } else if (userRole === 'student') {
          // For students, show events from their groups
          return events.filter(event => event.groupId === 'group1') // Mock group assignment
        }
        return []
      },
      
      getEventsByDateRange: (start, end) => {
        const { events } = get()
        return events.filter(event => 
          event.start >= start && event.end <= end
        )
      }
    }),
    {
      name: 'calendar-storage'
    }
  )
) 