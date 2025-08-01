import { useState } from 'react'
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-500" />
            My Homework
          </h1>
          <p className="text-muted-foreground">
            Stay focused and manage your assignments effectively
          </p>
        </div>
        
        {/* Progress Overview */}
        <Card className="w-full md:w-80">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedTasksData.length}/{totalTasks}
              </span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(completionRate)}% completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pomodoro Stats */}
      <PomodoroStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Homework List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">
                Pending ({pendingTasks.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedTasksData.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="space-y-4">
              {pendingTasks.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                    <p className="text-muted-foreground">
                      You've completed all your homework assignments.
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
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedHomework === task.id ? 'ring-2 ring-blue-500' : ''
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
                          <div className="flex flex-col items-end gap-2">
                            <Badge 
                              className={`${getPriorityColor(task.priority)} text-white text-xs`}
                            >
                              {task.priority}
                            </Badge>
                            {isOverdue ? (
                              <Badge variant="destructive" className="text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Overdue
                              </Badge>
                            ) : isDueSoon ? (
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Due soon
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                {daysUntilDue} days
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
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              ~{task.estimatedTime} min
                            </span>
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCompletion(task.id)
                            }}
                          >
                            Mark Complete
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
                <Card key={task.id} className="opacity-75">
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
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCompletion(task.id)
                          }}
                        >
                          Mark Pending
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        ~{task.estimatedTime} min
                      </span>
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span>Completed: {task.updatedAt.toLocaleDateString()}</span>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Study Session</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ready to focus on your selected homework? Start a Pomodoro session to stay productive!
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Selected: {studentHomework.find(h => h.id === selectedHomework)?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Estimated time: {studentHomework.find(h => h.id === selectedHomework)?.estimatedTime} minutes
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
