import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { useGroupsStore } from '@/store/groupsStore'
import { useStudentsStore } from '@/store/studentsStore'
import { useAttendanceStore } from '@/store/attendanceStore'
import { useLessonsStore } from '@/store/lessonsStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Award, 
  Calendar,
  Target,
  Star
} from 'lucide-react'

export default function TeacherStatistics() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { getGroupsByTeacher } = useGroupsStore()
  const { getStudentsByTeacher } = useStudentsStore()
  const { getAttendanceByGroup, getStudentAttendanceStats } = useAttendanceStore()
  const { getLessonsByTeacher } = useLessonsStore()

  const teacherGroups = getGroupsByTeacher(user?.id || '')
  const students = getStudentsByTeacher(user?.id || '')
  const lessons = getLessonsByTeacher(user?.id || '')

  // Calculate statistics
  const totalStudents = students.length
  const totalGroups = teacherGroups.length


  // Calculate attendance rate
  const allAttendanceRecords = teacherGroups.flatMap(group => 
    getAttendanceByGroup(group.id)
  )
  const totalSessions = allAttendanceRecords.length
  const totalPresent = allAttendanceRecords.flatMap(record => 
    record.records.filter(r => r.isPresent)
  ).length
  const totalAbsent = allAttendanceRecords.flatMap(record => 
    record.records.filter(r => !r.isPresent)
  ).length
  const attendanceRate = totalSessions > 0 ? (totalPresent / (totalPresent + totalAbsent)) * 100 : 0

  // Calculate homework completion rate
  const totalHomeworkDone = allAttendanceRecords.flatMap(record => 
    record.records.filter(r => r.homeworkDone)
  ).length
  const homeworkCompletionRate = totalPresent > 0 ? (totalHomeworkDone / totalPresent) * 100 : 0

  // Calculate average points
  const allPoints = allAttendanceRecords.flatMap(record => 
    record.records.map(r => r.points)
  )
  const averagePoints = allPoints.length > 0 ? 
    allPoints.reduce((sum, points) => sum + points, 0) / allPoints.length : 0

  // Group performance data
  const groupPerformanceData = teacherGroups.map(group => {
    const groupAttendance = getAttendanceByGroup(group.id)
    const groupStudents = students.filter(s => s.group === group.id)
    const groupLessons = lessons.filter(l => l.groupId === group.id)
    
    const groupPresent = groupAttendance.flatMap(record => 
      record.records.filter(r => r.isPresent)
    ).length
    const groupTotal = groupAttendance.flatMap(record => 
      record.records
    ).length
    const groupAttendanceRate = groupTotal > 0 ? (groupPresent / groupTotal) * 100 : 0
    
    const groupPoints = groupAttendance.flatMap(record => 
      record.records.map(r => r.points)
    )
    const groupAvgPoints = groupPoints.length > 0 ? 
      groupPoints.reduce((sum, points) => sum + points, 0) / groupPoints.length : 0

    return {
      name: group.name,
      students: groupStudents.length,
      lessons: groupLessons.length,
      attendanceRate: Math.round(groupAttendanceRate),
      avgPoints: Math.round(groupAvgPoints * 10) / 10
    }
  })

  // Monthly attendance trend
  const monthlyAttendanceData = [
    { month: 'Jan', attendance: 92, lessons: 15 },
    { month: 'Feb', attendance: 88, lessons: 12 },
    { month: 'Mar', attendance: 95, lessons: 18 },
    { month: 'Apr', attendance: 90, lessons: 14 },
    { month: 'May', attendance: 93, lessons: 16 },
    { month: 'Jun', attendance: 96, lessons: 20 }
  ]

  // Student performance data
  const studentPerformanceData = students.slice(0, 10).map(student => {
    const stats = getStudentAttendanceStats(student.id)
    return {
      name: student.fullName,
      attendance: stats.totalSessions > 0 ? (stats.presentCount / stats.totalSessions) * 100 : 0,
      avgPoints: stats.averagePoints,
      homeworkRate: stats.totalSessions > 0 ? (stats.homeworkDoneCount / stats.totalSessions) * 100 : 0
    }
  }).sort((a, b) => b.avgPoints - a.avgPoints)

  // Attendance vs Homework pie chart data
  const attendanceVsHomeworkData = [
    { name: t('teacher.presentAndHomeworkDone'), value: totalHomeworkDone, color: '#10b981' },
    { name: t('teacher.presentAndNoHomework'), value: totalPresent - totalHomeworkDone, color: '#f59e0b' },
    { name: t('teacher.absent'), value: totalAbsent, color: '#ef4444' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('teacher.statistics')}</h1>
        <p className="text-muted-foreground">{t('teacher.overviewOfTeachingPerformance')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.totalStudents')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {t('teacher.across')} {totalGroups} {t('teacher.groups')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.attendanceRate')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(attendanceRate)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalPresent} {t('teacher.present')} / {totalPresent + totalAbsent} {t('teacher.total')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.homeworkCompletion')}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(homeworkCompletionRate)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalHomeworkDone} {t('teacher.completed')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.averagePoints')}</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averagePoints * 10) / 10}</div>
            <p className="text-xs text-muted-foreground">
              {t('teacher.outOf')} 10 {t('teacher.points')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group Performance */}
        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.groupPerformance')}</CardTitle>
            <CardDescription>
              {t('teacher.attendanceRatesAndAveragePointsByGroup')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendanceRate" fill="#3b82f6" name={t('teacher.attendancePercent')} />
                <Bar dataKey="avgPoints" fill="#10b981" name={t('teacher.avgPoints')} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance vs Homework */}
        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.attendanceAndHomeworkOverview')}</CardTitle>
            <CardDescription>
              {t('teacher.distributionOfStudentAttendanceAndHomework')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceVsHomeworkData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceVsHomeworkData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.monthlyAttendanceTrend')}</CardTitle>
            <CardDescription>
              {t('teacher.attendanceRateAndLessonsConductedOverTime')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#3b82f6" name={t('teacher.attendancePercent')} />
                <Line type="monotone" dataKey="lessons" stroke="#10b981" name={t('teacher.lessons')} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Students */}
        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.topPerformingStudents')}</CardTitle>
            <CardDescription>
              {t('teacher.studentsWithHighestAveragePoints')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentPerformanceData.slice(0, 8)} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="avgPoints" fill="#8b5cf6" name={t('teacher.avgPoints')} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>{t('teacher.goalsAndTargets')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('teacher.targetAttendance')}</span>
              <span className="text-sm font-medium">95%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(attendanceRate, 95)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('teacher.targetHomework')}</span>
              <span className="text-sm font-medium">90%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${Math.min(homeworkCompletionRate, 90)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('teacher.targetPoints')}</span>
              <span className="text-sm font-medium">8.0</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${Math.min((averagePoints / 8) * 100, 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>{t('teacher.highlights')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">{t('teacher.bestPerformingGroup')}: Math A</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">{t('teacher.mostConsistentStudent')}: Alice Johnson</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">{t('teacher.highestAttendance')}: Chemistry A</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">{t('teacher.mostLessonsThisMonth')}: Physics A</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{t('teacher.recentActivity')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <div className="font-medium">{t('teacher.today')}</div>
              <div className="text-muted-foreground">{t('teacher.markedAttendanceForMathA')}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">{t('teacher.yesterday')}</div>
              <div className="text-muted-foreground">{t('teacher.createdLessonForPhysicsA')}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">{t('teacher.twoDaysAgo')}</div>
              <div className="text-muted-foreground">{t('teacher.updatedHomeworkForChemistryA')}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">{t('teacher.threeDaysAgo')}</div>
              <div className="text-muted-foreground">{t('teacher.assignedPointsToMathBStudents')}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 