import { useTranslation } from 'react-i18next'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Timer, TrendingUp, Calendar, Target } from 'lucide-react'

export function PomodoroStats() {
  const { t } = useTranslation()
  const {
    totalCompletedCycles,
    getDailyCompletedCycles,
    getWeeklyStats,
  } = usePomodoroStore()

  const weeklyStats = getWeeklyStats()
  const todayCompletedCycles = getDailyCompletedCycles(new Date())
  
  // Calculate this week's daily averages
  const weeklyAverage = Math.round(weeklyStats.focus / 7 * 10) / 10

  // Daily goal (can be made configurable later)
  const dailyGoal = 8
  const dailyProgress = (todayCompletedCycles / dailyGoal) * 100

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Today's Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('student.todaysFocus')}</CardTitle>
          <Timer className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayCompletedCycles}</div>
          <p className="text-xs text-muted-foreground mb-2">
            {t('student.of')} {dailyGoal} {t('student.sessionsGoal')}
          </p>
          <Progress value={Math.min(dailyProgress, 100)} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(dailyProgress)}% {t('student.complete')}
          </p>
        </CardContent>
      </Card>

      {/* Weekly Average */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('student.weeklyAverage')}</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weeklyAverage}</div>
          <p className="text-xs text-muted-foreground">
            {t('student.sessionsPerDay')}
          </p>
          <div className="flex gap-1 mt-2">
            <Badge variant="secondary" className="text-xs">
              {weeklyStats.focus} {t('student.focus')}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {weeklyStats.break} {t('student.breaks')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Total Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('student.totalSessions')}</CardTitle>
          <Target className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCompletedCycles}</div>
          <p className="text-xs text-muted-foreground">
            {t('student.focusSessionsCompleted')}
          </p>
          <div className="mt-2">
            <Badge variant="default" className="text-xs">
              {Math.round(totalCompletedCycles * 25 / 60 * 10) / 10}h {t('student.focused')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Streak Info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('student.thisWeek')}</CardTitle>
          <Calendar className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weeklyStats.focus}</div>
          <p className="text-xs text-muted-foreground">
            {t('student.sessionsThisWeek')}
          </p>
          <div className="mt-2">
            {weeklyStats.focus >= 35 ? (
              <Badge className="text-xs bg-green-500">
                🔥 {t('student.greatWeek')}!
              </Badge>
            ) : weeklyStats.focus >= 20 ? (
              <Badge variant="secondary" className="text-xs">
                👍 {t('student.goodProgress')}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                💪 {t('student.keepGoing')}!
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
