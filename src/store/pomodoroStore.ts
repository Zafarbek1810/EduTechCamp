import { create } from 'zustand'

export interface PomodoroSession {
  id: string
  type: 'focus' | 'break'
  duration: number // in minutes
  completedAt: Date
}

interface PomodoroState {
  // Timer state
  isRunning: boolean
  isPaused: boolean
  currentTime: number // in seconds
  sessionType: 'focus' | 'break'
  currentCycle: number
  
  // Settings
  focusDuration: number // in minutes
  breakDuration: number // in minutes
  
  // Progress tracking
  completedSessions: PomodoroSession[]
  dailyCompletedCycles: number
  totalCompletedCycles: number
  
  // Actions
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  completeSession: () => void
  switchSession: () => void
  updateTime: (time: number) => void
  getDailyCompletedCycles: (date: Date) => number
  getWeeklyStats: () => { focus: number; break: number }
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  // Initial state
  isRunning: false,
  isPaused: false,
  currentTime: 25 * 60, // 25 minutes in seconds
  sessionType: 'focus',
  currentCycle: 1,
  
  focusDuration: 25,
  breakDuration: 5,
  
  completedSessions: [],
  dailyCompletedCycles: 0,
  totalCompletedCycles: 0,
  
  // Actions
  startTimer: () => {
    set({ isRunning: true, isPaused: false })
  },
  
  pauseTimer: () => {
    set({ isPaused: true, isRunning: false })
  },
  
  resetTimer: () => {
    const { sessionType, focusDuration, breakDuration } = get()
    const duration = sessionType === 'focus' ? focusDuration : breakDuration
    set({
      isRunning: false,
      isPaused: false,
      currentTime: duration * 60,
    })
  },
  
  completeSession: () => {
    const { sessionType, focusDuration, breakDuration, completedSessions, currentCycle } = get()
    
    // Create new session record
    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      type: sessionType,
      duration: sessionType === 'focus' ? focusDuration : breakDuration,
      completedAt: new Date(),
    }
    
    const updatedSessions = [...completedSessions, newSession]
    
    // Update daily and total cycles if focus session completed
    let newDailyCount = get().dailyCompletedCycles
    let newTotalCount = get().totalCompletedCycles
    let newCycle = currentCycle
    
    if (sessionType === 'focus') {
      newDailyCount += 1
      newTotalCount += 1
      newCycle += 1
    }
    
    set({
      completedSessions: updatedSessions,
      dailyCompletedCycles: newDailyCount,
      totalCompletedCycles: newTotalCount,
      currentCycle: newCycle,
      isRunning: false,
      isPaused: false,
    })
    
    // Auto-switch to next session
    get().switchSession()
  },
  
  switchSession: () => {
    const { sessionType, focusDuration, breakDuration } = get()
    const newSessionType = sessionType === 'focus' ? 'break' : 'focus'
    const newDuration = newSessionType === 'focus' ? focusDuration : breakDuration
    
    set({
      sessionType: newSessionType,
      currentTime: newDuration * 60,
      isRunning: false,
      isPaused: false,
    })
  },
  
  updateTime: (time: number) => {
    set({ currentTime: time })
  },
  
  getDailyCompletedCycles: (date: Date) => {
    const { completedSessions } = get()
    const targetDate = date.toDateString()
    
    return completedSessions.filter(
      session => 
        session.type === 'focus' && 
        session.completedAt.toDateString() === targetDate
    ).length
  },
  
  getWeeklyStats: () => {
    const { completedSessions } = get()
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const weekSessions = completedSessions.filter(
      session => session.completedAt >= oneWeekAgo
    )
    
    return {
      focus: weekSessions.filter(s => s.type === 'focus').length,
      break: weekSessions.filter(s => s.type === 'break').length,
    }
  },
}))
