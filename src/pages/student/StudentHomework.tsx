import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer'
import { PomodoroStats } from '@/components/pomodoro/PomodoroStats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useHomeworkStore } from '@/store/homeworkStore'

export default function StudentHomework() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { 
    getHomeworkByStudent, 
    getPendingHomework, 
    getCompletedHomework,
    toggleCompletion 
  } = useHomeworkStore()
  const [selectedHomework, setSelectedHomework] = useState<string | null>(null)

  // Get homework for the current student
  const studentHomework = getHomeworkByStudent(user?.id || '')
  const pendingTasks = getPendingHomework(user?.id || '')
  const completedTasksData = getCompletedHomework(user?.id || '')
  const totalTasks = studentHomework.length
  const completionRate = totalTasks > 0 ? (completedTasksData.length / totalTasks) * 100 : 0

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {t('student.myHomework')}
              </h1>
              <p className="text-purple-700 dark:text-purple-300">
                {t('student.stayFocusedAndManageAssignments')}
              </p>
            </div>
          </div>
          
          {/* Progress Overview */}
          <Card className="w-full md:w-80 bg-white dark:bg-gray-800 shadow-lg border-purple-200 dark:border-purple-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">{t('student.overallProgress')}</span>
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  {completedTasksData.length}/{totalTasks}
                </span>
              </div>
              <Progress value={completionRate} className="h-3 bg-purple-100 dark:bg-purple-900" />
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-medium">
                {Math.round(completionRate)}% {t('student.completed')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pomodoro Stats */}
      <PomodoroStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Homework List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="pending" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-1 rounded-xl shadow-inner">
            <TabsTrigger 
              value="pending"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-medium transition-all duration-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full shadow-sm"></div>
                {t('student.pending')} ({pendingTasks.length})
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-medium transition-all duration-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                {t('student.completed')} ({completedTasksData.length})
              </div>
            </TabsTrigger>
          </TabsList>
            
            <TabsContent value="pending" className="space-y-4">
              {pendingTasks.length === 0 ? (
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-3">{t('student.allCaughtUp')}</h3>
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      {t('student.completedAllHomeworkAssignments')}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pendingTasks.map((task) => {
                  const daysUntilDue = getDaysUntilDue(task.dueDate)
                  const isOverdue = daysUntilDue < 0
                  const isDueSoon = daysUntilDue <= 1 && daysUntilDue >= 0
                  
                  return (
                    <Card 
                      key={task.id} 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] border-l-4 border-l-orange-400 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 ${
                        selectedHomework === task.id ? 'ring-2 ring-purple-500 shadow-xl scale-[1.02]' : ''
                      }`}
                      onClick={() => setSelectedHomework(task.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <CardTitle className="text-lg">{task.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {task.subject}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <Badge 
                              className={`${getPriorityColor(task.priority)} text-white text-xs font-medium shadow-md px-3 py-1`}
                            >
                              {task.priority}
                            </Badge>
                            {isOverdue ? (
                              <Badge variant="destructive" className="text-xs font-medium shadow-md px-3 py-1 bg-gradient-to-r from-red-500 to-red-600">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {t('student.overdue')}
                              </Badge>
                            ) : isDueSoon ? (
                              <Badge variant="secondary" className="text-xs font-medium shadow-md px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                <Clock className="h-3 w-3 mr-1" />
                                {t('student.dueSoon')}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs font-medium shadow-md px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                <Calendar className="h-3 w-3 mr-1" />
                                {daysUntilDue} {t('student.days')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          {task.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <span className="font-medium">~{task.estimatedTime} {t('student.min')}</span>
                            </span>
                            <span className="bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg font-medium">
                              {t('student.due')}: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCompletion(task.id)
                            }}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {t('student.markComplete')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              {completedTasksData.map((task) => (
                <Card key={task.id} className="opacity-90 border-l-4 border-l-green-400 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg line-through">
                          {task.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {task.subject}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md px-3 py-1 font-medium">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t('student.completed')}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCompletion(task.id)
                          }}
                          className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-400 transition-all duration-200 transform hover:scale-105"
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {t('student.markPending')}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                        <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="font-medium">~{task.estimatedTime} {t('student.min')}</span>
                      </span>
                      <span className="bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg font-medium">
                        {t('student.due')}: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <span className="bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg font-medium text-emerald-700 dark:text-emerald-300">
                        {t('student.completed')}: {task.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Pomodoro Timer Sidebar */}
        <div className="space-y-6">
          <PomodoroTimer />
          
          {selectedHomework && (
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                  <CardTitle className="text-indigo-700 dark:text-indigo-300">{t('student.studySession')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-4 font-medium">
                  {t('student.readyToFocusOnSelectedHomework')}
                </p>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {t('student.selected')}: {studentHomework.find(h => h.id === selectedHomework)?.title}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      {t('student.estimatedTime')}: {studentHomework.find(h => h.id === selectedHomework)?.estimatedTime} {t('student.minutes')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
