import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Users, BookOpen, CheckCircle, Award } from 'lucide-react'

// Mock data for teacher dashboard
const groupPerformance = [
  { group: 'Math A', students: 12, attendance: 95, avgScore: 85 },
  { group: 'Math B', students: 10, attendance: 88, avgScore: 78 },
  { group: 'Physics A', students: 8, attendance: 92, avgScore: 82 },
  { group: 'Chemistry A', students: 15, attendance: 90, avgScore: 79 },
]

const monthlyAttendance = [
  { month: 'Jan', attendance: 92 },
  { month: 'Feb', attendance: 88 },
  { month: 'Mar', attendance: 95 },
  { month: 'Apr', attendance: 90 },
  { month: 'May', attendance: 93 },
  { month: 'Jun', attendance: 96 },
]

const studentScores = [
  { name: 'Alice Johnson', math: 85, physics: 90, chemistry: 88 },
  { name: 'Bob Smith', math: 78, physics: 85, chemistry: 82 },
  { name: 'Carol Davis', math: 92, physics: 88, chemistry: 90 },
  { name: 'David Wilson', math: 80, physics: 82, chemistry: 85 },
  { name: 'Eva Brown', math: 88, physics: 90, chemistry: 87 },
]

export default function TeacherDashboard() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalStudents')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.acrossGroups', { count: 4 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.activeGroups')}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Math A, Math B, Physics A, Chemistry A
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.avgAttendance')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91%</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.fromLastMonth', { percent: '+3%' })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.avgScore')}</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">81%</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.fromLastMonth', { percent: '+2%' })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group Performance */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.groupPerformance')}</CardTitle>
            <CardDescription>
              {t('dashboard.performanceMetricsByGroup')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="attendance" fill="#3B82F6" name="Attendance %" />
                <Bar yAxisId="right" dataKey="avgScore" fill="#10B981" name="Avg Score %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.monthlyAttendanceTrend')}</CardTitle>
            <CardDescription>
              {t('teacher.attendanceTrendLast6Months')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Student Performance */}
      <Card>
        <CardHeader>
          <CardTitle>{t('teacher.studentPerformanceBySubject')}</CardTitle>
          <CardDescription>
            {t('teacher.individualStudentScores')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="math" fill="#3B82F6" name="Math" />
              <Bar dataKey="physics" fill="#10B981" name="Physics" />
              <Bar dataKey="chemistry" fill="#F59E0B" name="Chemistry" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>{t('teacher.recentActivities')}</CardTitle>
          <CardDescription>
            {t('teacher.latestActivitiesInGroups')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t('teacher.lessonCompleted')}</p>
                <p className="text-xs text-muted-foreground">{t('teacher.advancedCalculusMathA')}</p>
              </div>
              <span className="text-xs text-muted-foreground">{t('teacher.oneHourAgo')}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t('teacher.homeworkSubmitted')}</p>
                <p className="text-xs text-muted-foreground">{t('teacher.fifteenStudentsPhysicsHomework')}</p>
              </div>
              <span className="text-xs text-muted-foreground">{t('teacher.threeHoursAgo')}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t('teacher.attendanceTaken')}</p>
                <p className="text-xs text-muted-foreground">{t('teacher.chemistryAFourteenFifteenStudents')}</p>
              </div>
              <span className="text-xs text-muted-foreground">{t('teacher.fiveHoursAgo')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('teacher.quickActions')}</CardTitle>
          <CardDescription>
            {t('teacher.commonActionsForGroups')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <BookOpen className="w-6 h-6 mb-2 text-blue-600" />
              <h3 className="font-medium">{t('teacher.createLesson')}</h3>
              <p className="text-sm text-muted-foreground">{t('teacher.planNewLesson')}</p>
            </button>
            
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <CheckCircle className="w-6 h-6 mb-2 text-green-600" />
              <h3 className="font-medium">{t('teacher.takeAttendance')}</h3>
              <p className="text-sm text-muted-foreground">{t('teacher.markStudentAttendance')}</p>
            </button>
            
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <Award className="w-6 h-6 mb-2 text-purple-600" />
              <h3 className="font-medium">{t('teacher.assignPoints')}</h3>
              <p className="text-sm text-muted-foreground">{t('teacher.awardStudentPoints')}</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 