import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  AlertCircle,
  Trophy,
  Mail,
  Phone
} from 'lucide-react'

export default function ParentChild() {
  const { t } = useTranslation()
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
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0">{t('student.present')}</Badge>
      case 'absent':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-0">{t('student.absent')}</Badge>
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-0">{t('student.late')}</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0">{t('student.completed')}</Badge>
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-0">{t('student.pending')}</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-0">{status}</Badge>
    }
  }

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'text-green-600 dark:text-green-400'
    if (grade.includes('B')) return 'text-blue-600 dark:text-blue-400'
    if (grade.includes('C')) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('student.childInformation')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('student.detailedViewOfChildAcademicProgress', { name: childData.name })}
          </p>
        </div>

        {/* Enhanced Child Profile */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span>{t('student.studentProfile')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{childData.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">{childData.grade}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID: {childData.studentId}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{childData.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{childData.phone}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0 text-lg px-6 py-3">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('student.active')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              {t('student.overview')}
            </TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
              {t('student.attendance')}
            </TabsTrigger>
            <TabsTrigger value="homework" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              {t('student.homework')}
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-600 data-[state=active]:text-white">
              {t('student.achievements')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Enhanced Attendance Summary */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <span>{t('student.attendanceSummary')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{childData.attendance.present}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('student.present')}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-800">
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">{childData.attendance.absent}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('student.absent')}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{childData.attendance.late}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('student.late')}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{childData.attendance.rate}%</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('student.rate')}</p>
                  </div>
                </div>
                <Progress value={childData.attendance.rate} className="mt-6 h-3" />
              </CardContent>
            </Card>

            {/* Enhanced Academic Performance */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span>{t('student.academicPerformance')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {childData.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{subject.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {subject.completed}/{subject.assignments} {t('student.assignmentsCompleted')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getGradeColor(subject.grade)}`}>
                          {subject.grade} ({subject.score}%)
                        </div>
                        <Progress value={subject.score} className="w-32 mt-2 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-8">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <span>{t('student.recentAttendance')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                        <TableHead className="font-semibold">{t('student.date')}</TableHead>
                        <TableHead className="font-semibold">{t('student.status')}</TableHead>
                        <TableHead className="font-semibold">{t('student.subject')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {childData.recentAttendance.map((record, index) => (
                        <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell className="font-medium">{record.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(record.status)}
                              {getStatusBadge(record.status)}
                            </div>
                          </TableCell>
                          <TableCell>{record.subject}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="homework" className="space-y-8">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span>{t('student.homeworkAssignments')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {childData.homework.map((assignment, index) => (
                    <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{assignment.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{assignment.subject}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t('student.due')}: {assignment.dueDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(assignment.status)}
                        {assignment.score && (
                          <div className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                            {t('student.score')}: {assignment.score}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-8">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <span>{t('student.achievementsAwards')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {childData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{achievement.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.date}</p>
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-0 mt-2">
                            {achievement.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{achievement.points} {t('student.pts')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 