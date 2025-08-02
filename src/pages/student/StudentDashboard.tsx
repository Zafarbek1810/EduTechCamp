import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Award, Users, BookOpen, ShoppingCart, Star } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useShopStore } from '@/store/shopStore'

// Mock data for student dashboard
const monthlyProgress = [
  { month: 'Jan', points: 120, attendance: 95 },
  { month: 'Feb', points: 150, attendance: 88 },
  { month: 'Mar', points: 180, attendance: 92 },
  { month: 'Apr', points: 200, attendance: 90 },
  { month: 'May', points: 250, attendance: 93 },
  { month: 'Jun', points: 300, attendance: 96 },
]

const subjectScores = [
  { subject: 'Math', score: 85, target: 90 },
  { subject: 'Physics', score: 88, target: 85 },
  { subject: 'Chemistry', score: 82, target: 88 },
  { subject: 'English', score: 90, target: 85 },
]

export default function StudentDashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { getStudentPoints } = useShopStore()
  
  const currentPoints = getStudentPoints(user?.id || '')

  const recentActivities = [
    { type: t('student.pointsEarned'), description: t('student.completedMathHomework'), points: 10, time: t('student.twoHoursAgo') },
    { type: t('student.pointsSpent'), description: t('student.boughtPremiumNotebook'), points: -50, time: t('student.oneDayAgo') },
    { type: t('student.pointsEarned'), description: t('student.perfectAttendanceThisWeek'), points: 15, time: t('student.threeDaysAgo') },
    { type: t('student.pointsEarned'), description: t('student.excellentParticipation'), points: 5, time: t('student.oneWeekAgo') },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome and Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-blue-900 dark:text-blue-100">{t('student.welcomeBack')} {user?.name}!</CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  {t('student.progressOverview')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{currentPoints}</div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t('student.totalPoints')}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">{t('student.myGroup')}</CardTitle>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">Math A</div>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              12 {t('student.students')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">{t('student.attendance')}</CardTitle>
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">96%</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              {t('student.thisMonth')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-lg">📈</span>
              </div>
              <div>
                <CardTitle className="text-blue-900 dark:text-blue-100">{t('student.monthlyProgress')}</CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  {t('student.pointsEarnedAndAttendanceOverTime')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="points" stroke="#3B82F6" strokeWidth={3} name={t('student.points')} />
                <Line yAxisId="right" type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={3} name={t('student.attendancePercent')} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-lg">📊</span>
              </div>
              <div>
                <CardTitle className="text-green-900 dark:text-green-100">{t('student.subjectPerformance')}</CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  {t('student.scoresVsTargetsBySubject')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3B82F6" name={t('student.currentScore')} />
                <Bar dataKey="target" fill="#10B981" name={t('student.targetScore')} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-lg">⚡</span>
            </div>
            <div>
              <CardTitle className="text-orange-900 dark:text-orange-100">{t('student.recentActivities')}</CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                {t('student.latestPointsActivities')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                <div className={`w-3 h-3 rounded-full shadow-sm ${
                  activity.points > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{activity.type}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{activity.description}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${
                    activity.points > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {activity.points > 0 ? '+' : ''}{activity.points} {t('student.pts')}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-lg">🚀</span>
            </div>
            <div>
              <CardTitle className="text-purple-900 dark:text-purple-100">{t('student.quickActions')}</CardTitle>
              <CardDescription className="text-purple-700 dark:text-purple-300">
                {t('student.commonActionsForStudents')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-6 border border-blue-200 dark:border-blue-700 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-3 shadow-md">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">{t('student.visitShop')}</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">{t('student.spendYourPoints')}</p>
            </button>
            
            <button className="p-6 border border-green-200 dark:border-green-700 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3 shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-green-900 dark:text-green-100 mb-2">{t('student.viewSchedule')}</h3>
              <p className="text-sm text-green-700 dark:text-green-300">{t('student.checkYourClasses')}</p>
            </button>
            
            <button className="p-6 border border-purple-200 dark:border-purple-700 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-3 shadow-md">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-2">{t('student.myAchievements')}</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">{t('student.viewYourBadges')}</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Group Information */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-lg">👥</span>
            </div>
            <div>
              <CardTitle className="text-indigo-900 dark:text-indigo-100">{t('student.myGroupInformation')}</CardTitle>
              <CardDescription className="text-indigo-700 dark:text-indigo-300">
                {t('student.detailsAboutYourCurrentGroup')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-3">{t('student.groupDetails')}</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{t('student.group')}:</span>
                  <span className="bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded-md font-medium">Math A</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{t('student.teacher')}:</span>
                  <span className="bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded-md font-medium">John Smith</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{t('student.schedule')}:</span>
                  <span className="bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded-md font-medium">Mon, Wed, Fri 2:00 PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{t('student.room')}:</span>
                  <span className="bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded-md font-medium">101</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-3">{t('student.groupStatistics')}</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{t('student.totalStudents')}:</span>
                  <span className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-md font-medium">12</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{t('student.averageScore')}:</span>
                  <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-md font-medium">85%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{t('student.groupRank')}:</span>
                  <span className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded-md font-medium">2nd</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{t('student.nextLesson')}:</span>
                  <span className="bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded-md font-medium">Tomorrow 2:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 