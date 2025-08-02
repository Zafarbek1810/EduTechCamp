import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RotateCcw, Timer, Coffee } from 'lucide-react'

interface PomodoroTimerProps {
  className?: string
  showStats?: boolean
}

export function PomodoroTimer({ className = '', showStats = true }: PomodoroTimerProps) {
  const { t } = useTranslation()
  const {
    isRunning,
    isPaused,
    currentTime,
    sessionType,
    currentCycle,
    focusDuration,
    breakDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    completeSession,
    updateTime,
    getDailyCompletedCycles,
  } = usePomodoroStore()

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio for notifications (optional)
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const createBeepSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }

    audioRef.current = { play: createBeepSound } as any
  }, [])

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        updateTime(currentTime - 1)
        
        if (currentTime <= 1) {
          // Session completed
          completeSession()
          
          // Play notification sound
          if (audioRef.current) {
            try {
              audioRef.current.play()
            } catch (error) {
              console.log('Audio notification failed:', error)
            }
          }
          
          // Browser notification (if permission granted)
          if (Notification.permission === 'granted') {
            new Notification(`${sessionType === 'focus' ? t('student.focus') : t('student.break')} ${t('student.sessionCompleted')}!`, {
              body: sessionType === 'focus' 
                ? t('student.timeForBreak') 
                : t('student.readyForAnotherFocusSession'),
              icon: '/favicon.ico'
            })
          }
        }
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isPaused, currentTime, sessionType, completeSession, updateTime])

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress percentage
  const totalDuration = sessionType === 'focus' ? focusDuration * 60 : breakDuration * 60
  const progress = ((totalDuration - currentTime) / totalDuration) * 100

  const handleStartPause = () => {
    if (isRunning) {
      pauseTimer()
    } else {
      startTimer()
    }
  }

  const todayCompletedCycles = getDailyCompletedCycles(new Date())

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {sessionType === 'focus' ? (
            <>
              <Timer className="h-5 w-5 text-blue-500" />
              {t('student.focusSession')}
            </>
          ) : (
            <>
              <Coffee className="h-5 w-5 text-green-500" />
              {t('student.breakTime')}
            </>
          )}
        </CardTitle>
        <div className="flex justify-center gap-2">
          <Badge variant={sessionType === 'focus' ? 'default' : 'secondary'}>
            {t('student.cycle')} {currentCycle}
          </Badge>
          {showStats && (
            <Badge variant="outline">
              {t('student.today')}: {todayCompletedCycles} {t('student.completed')}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-primary mb-2">
            {formatTime(currentTime)}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={handleStartPause}
            size="lg"
            className="flex items-center gap-2"
            variant={isRunning ? "secondary" : "default"}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                {t('student.pause')}
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {isPaused ? t('student.resume') : t('student.start')}
              </>
            )}
          </Button>
          
          <Button
            onClick={resetTimer}
            size="lg"
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {t('student.reset')}
          </Button>
        </div>

        {/* Session Info */}
        <div className="text-center text-sm text-muted-foreground">
          {sessionType === 'focus' ? (
            <p>{t('student.stayFocused')}! {t('student.next')}: {breakDuration}-{t('student.minute')} {t('student.break')}</p>
          ) : (
            <p>{t('student.takeBreak')}! {t('student.next')}: {focusDuration}-{t('student.minute')} {t('student.focusSession')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
