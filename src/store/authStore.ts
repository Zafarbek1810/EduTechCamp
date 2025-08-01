import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent'

export interface User {
  id: string
  username: string
  name: string
  role: UserRole
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@edu.com'
  },
  {
    id: '2',
    username: 'teacher1',
    name: 'John Teacher',
    role: 'teacher',
    email: 'teacher1@edu.com'
  },
  {
    id: '3',
    username: 'student1',
    name: 'Alice Student',
    role: 'student',
    email: 'student1@edu.com'
  },
  {
    id: '4',
    username: 'parent1',
    name: 'Sarah Parent',
    role: 'parent',
    email: 'parent1@edu.com'
  }
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        // Mock authentication - in real app this would be an API call
        const user = mockUsers.find(u => u.username === username)
        
        if (user && password === 'password') { // Simple password check for demo
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      }
    }),
    {
      name: 'auth-storage'
    }
  )
) 