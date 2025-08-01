
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
  Mail
} from 'lucide-react'

export default function ParentDashboard() {

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Parent Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor your child's academic progress and activities</p>
      </div>

      {/* Child Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" />
            <span>Child Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{childData.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{childData.grade}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="outline">Active Student</Badge>
                <Badge variant="secondary">On Track</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{childData.attendance}%</div>
            <Progress value={childData.attendance} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{childData.averageScore}%</div>
            <Progress value={childData.averageScore} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {childData.completedAssignments}/{childData.totalAssignments}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {Math.round((childData.completedAssignments / childData.totalAssignments) * 100)}% completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{childData.upcomingTests}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Recent Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {childData.recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    {getAchievementIcon(achievement.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{achievement.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.date}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {achievement.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {childData.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{activity.activity}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">View Attendance</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Check attendance records</p>
                </div>
              </div>
            </button>
            
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">View Homework</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Check assignments</p>
                </div>
              </div>
            </button>
            
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">View Grades</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Check academic progress</p>
                </div>
              </div>
            </button>
            
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Contact Teacher</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Send a message</p>
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 