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
    { name: 'Present & Homework Done', value: totalHomeworkDone, color: '#10b981' },
    { name: 'Present & No Homework', value: totalPresent - totalHomeworkDone, color: '#f59e0b' },
    { name: 'Absent', value: totalAbsent, color: '#ef4444' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Statistics</h1>
        <p className="text-muted-foreground">Overview of your teaching performance and student progress</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across {totalGroups} groups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(attendanceRate)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalPresent} present / {totalPresent + totalAbsent} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Homework Completion</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(homeworkCompletionRate)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalHomeworkDone} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averagePoints * 10) / 10}</div>
            <p className="text-xs text-muted-foreground">
              Out of 10 points
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Group Performance</CardTitle>
            <CardDescription>
              Attendance rates and average points by group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendanceRate" fill="#3b82f6" name="Attendance %" />
                <Bar dataKey="avgPoints" fill="#10b981" name="Avg Points" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance vs Homework */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance & Homework Overview</CardTitle>
            <CardDescription>
              Distribution of student attendance and homework completion
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
            <CardTitle>Monthly Attendance Trend</CardTitle>
            <CardDescription>
              Attendance rate and lessons conducted over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#3b82f6" name="Attendance %" />
                <Line type="monotone" dataKey="lessons" stroke="#10b981" name="Lessons" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Students */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Students</CardTitle>
            <CardDescription>
              Students with highest average points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentPerformanceData.slice(0, 8)} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="avgPoints" fill="#8b5cf6" name="Avg Points" />
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
              <span>Goals & Targets</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Target Attendance</span>
              <span className="text-sm font-medium">95%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(attendanceRate, 95)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Target Homework</span>
              <span className="text-sm font-medium">90%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${Math.min(homeworkCompletionRate, 90)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Target Points</span>
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
              <span>Highlights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Best performing group: Math A</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Most consistent student: Alice Johnson</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Highest attendance: Chemistry A</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Most lessons this month: Physics A</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <div className="font-medium">Today</div>
              <div className="text-muted-foreground">Marked attendance for Math A</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Yesterday</div>
              <div className="text-muted-foreground">Created lesson for Physics A</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">2 days ago</div>
              <div className="text-muted-foreground">Updated homework for Chemistry A</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">3 days ago</div>
              <div className="text-muted-foreground">Assigned points to Math B students</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 