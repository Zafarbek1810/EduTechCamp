
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Award,
  User,
  Mail,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function ParentDashboard() {
  const { t } = useTranslation()

  // Mock child data
  const childData = {
    name: 'Alice Student',
    grade: '10th Grade',
    attendance: 92,
    averageScore: 87,
    totalAssignments: 24,
    completedAssignments: 22,
    upcomingTests: 3,
    recentAchievements: [
      { title: 'Perfect Attendance', date: '2024-01-15', type: 'attendance' },
      { title: 'Top Scorer - Math Quiz', date: '2024-01-12', type: 'academic' },
      { title: 'Homework Completion', date: '2024-01-10', type: 'homework' }
    ],
    recentActivities: [
      { activity: 'Submitted Math Homework', time: '2 hours ago', type: 'homework' },
      { activity: 'Attended English Class', time: '1 day ago', type: 'attendance' },
      { activity: 'Completed Science Quiz', time: '2 days ago', type: 'quiz' }
    ]
  }

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return <Calendar className="w-4 h-4" />
      case 'academic':
        return <Award className="w-4 h-4" />
      case 'homework':
        return <BookOpen className="w-4 h-4" />
      default:
        return <Award className="w-4 h-4" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'homework':
        return <BookOpen className="w-4 h-4" />
      case 'attendance':
        return <Clock className="w-4 h-4" />
      case 'quiz':
        return <TrendingUp className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('student.parentDashboard')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('student.monitorChildAcademicProgress')}
          </p>
        </div>

        {/* Enhanced Child Info Card */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <span>{t('student.childInformation')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{childData.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">{childData.grade}</p>
                <div className="flex items-center space-x-3 mt-3">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {t('student.activeStudent')}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-0">
                    <Target className="w-3 h-3 mr-1" />
                    {t('student.onTrack')}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {t('student.attendanceRate')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{childData.attendance}%</div>
              <Progress value={childData.attendance} className="mt-3 h-2" />
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">Excellent attendance!</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                {t('student.averageScore')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{childData.averageScore}%</div>
              <Progress value={childData.averageScore} className="mt-3 h-2" />
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Great performance!</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                {t('student.assignments')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {childData.completedAssignments}/{childData.totalAssignments}
              </div>
              <Progress value={(childData.completedAssignments / childData.totalAssignments) * 100} className="mt-3 h-2" />
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                {Math.round((childData.completedAssignments / childData.totalAssignments) * 100)}% {t('student.completed')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {t('student.upcomingTests')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{childData.upcomingTests}</div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">{t('student.thisWeek')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Recent Achievements */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span>{t('student.recentAchievements')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {childData.recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                      {getAchievementIcon(achievement.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{achievement.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.date}</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-0">
                      {achievement.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Recent Activities */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span>{t('student.recentActivities')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {childData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{activity.activity}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-0">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">{t('student.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <button className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-left">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{t('student.viewAttendance')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('student.checkAttendanceRecords')}</p>
                  </div>
                </div>
              </button>
              
              <button className="group p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-left">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{t('student.viewHomework')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('student.checkAssignments')}</p>
                  </div>
                </div>
              </button>
              
              <button className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-left">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{t('student.viewGrades')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('student.checkAcademicProgress')}</p>
                  </div>
                </div>
              </button>
              
              <button className="group p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-left">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{t('student.contactTeacher')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('student.sendMessage')}</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 