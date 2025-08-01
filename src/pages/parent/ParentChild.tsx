import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Award,
  User,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

export default function ParentChild() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock child data
  const childData = {
    name: 'Alice Student',
    grade: '10th Grade',
    studentId: 'STU001',
    email: 'alice.student@school.com',
    phone: '+1 (555) 123-4567',
    attendance: {
      total: 180,
      present: 165,
      absent: 10,
      late: 5,
      rate: 92
    },
    subjects: [
      { name: 'Mathematics', grade: 'A', score: 92, assignments: 8, completed: 7 },
      { name: 'English', grade: 'A-', score: 88, assignments: 6, completed: 6 },
      { name: 'Science', grade: 'B+', score: 85, assignments: 5, completed: 4 },
      { name: 'History', grade: 'A', score: 90, assignments: 4, completed: 4 },
      { name: 'Physical Education', grade: 'A+', score: 95, assignments: 3, completed: 3 }
    ],
    recentAttendance: [
      { date: '2024-01-15', status: 'present', subject: 'All Classes' },
      { date: '2024-01-14', status: 'present', subject: 'All Classes' },
      { date: '2024-01-13', status: 'late', subject: 'Mathematics' },
      { date: '2024-01-12', status: 'present', subject: 'All Classes' },
      { date: '2024-01-11', status: 'absent', subject: 'Science' },
      { date: '2024-01-10', status: 'present', subject: 'All Classes' }
    ],
    homework: [
      { subject: 'Mathematics', title: 'Algebra Chapter 5', dueDate: '2024-01-20', status: 'completed', score: 95 },
      { subject: 'English', title: 'Essay on Shakespeare', dueDate: '2024-01-18', status: 'completed', score: 88 },
      { subject: 'Science', title: 'Chemistry Lab Report', dueDate: '2024-01-22', status: 'pending' },
      { subject: 'History', title: 'World War II Research', dueDate: '2024-01-25', status: 'pending' }
    ],
    achievements: [
      { title: 'Perfect Attendance - December', date: '2024-01-01', type: 'attendance', points: 50 },
      { title: 'Top Scorer - Math Quiz', date: '2024-01-12', type: 'academic', points: 100 },
      { title: 'Homework Completion Streak', date: '2024-01-10', type: 'homework', points: 75 },
      { title: 'Science Fair Winner', date: '2024-01-05', type: 'competition', points: 200 }
    ]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'late':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default" className="bg-green-100 text-green-800">Present</Badge>
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>
      case 'late':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Late</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case 'pending':
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'text-green-600'
    if (grade.includes('B')) return 'text-blue-600'
    if (grade.includes('C')) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Child Information</h1>
        <p className="text-gray-600 dark:text-gray-400">Detailed view of {childData.name}'s academic progress</p>
      </div>

      {/* Child Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" />
            <span>Student Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{childData.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{childData.grade}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID: {childData.studentId}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="font-medium">{childData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="font-medium">{childData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="homework">Homework</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Attendance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Attendance Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{childData.attendance.present}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{childData.attendance.absent}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{childData.attendance.late}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Late</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{childData.attendance.rate}%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rate</p>
                </div>
              </div>
              <Progress value={childData.attendance.rate} className="mt-4" />
            </CardContent>
          </Card>

          {/* Academic Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Academic Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {childData.subjects.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{subject.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {subject.completed}/{subject.assignments} assignments completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${getGradeColor(subject.grade)}`}>
                        {subject.grade} ({subject.score}%)
                      </div>
                      <Progress value={subject.score} className="w-24 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subject</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {childData.recentAttendance.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(record.status)}
                          {getStatusBadge(record.status)}
                        </div>
                      </TableCell>
                      <TableCell>{record.subject}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homework" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Homework Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {childData.homework.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{assignment.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{assignment.subject}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Due: {assignment.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(assignment.status)}
                      {assignment.score && (
                        <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                          Score: {assignment.score}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Achievements & Awards</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {childData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.date}</p>
                        <Badge variant="outline" className="text-xs mt-1">{achievement.type}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-600">{achievement.points} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 