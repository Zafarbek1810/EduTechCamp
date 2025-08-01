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

const recentActivities = [
  { type: 'Points Earned', description: 'Completed Math homework', points: 10, time: '2 hours ago' },
  { type: 'Points Spent', description: 'Bought Premium Notebook', points: -50, time: '1 day ago' },
  { type: 'Points Earned', description: 'Perfect attendance this week', points: 15, time: '3 days ago' },
  { type: 'Points Earned', description: 'Excellent participation', points: 5, time: '1 week ago' },
]

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const { getStudentPoints } = useShopStore()
  
  const currentPoints = getStudentPoints(user?.id || '')

  return (
    <div className="space-y-6">
      {/* Welcome and Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Welcome back, {user?.name}!</CardTitle>
            <CardDescription>
              Here's your progress overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="text-3xl font-bold text-blue-600">{currentPoints}</div>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
              <Award className="w-12 h-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Group</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Math A</div>
            <p className="text-xs text-muted-foreground">
              12 students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
            <CardDescription>
              Points earned and attendance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="points" stroke="#3B82F6" strokeWidth={2} name="Points" />
                <Line yAxisId="right" type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={2} name="Attendance %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>
              Your scores vs targets by subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3B82F6" name="Current Score" />
                <Bar dataKey="target" fill="#10B981" name="Target Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Your latest points activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.points > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.type}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${
                    activity.points > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {activity.points > 0 ? '+' : ''}{activity.points} pts
                  </span>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common actions for students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingCart className="w-6 h-6 mb-2 text-blue-600" />
              <h3 className="font-medium">Visit Shop</h3>
              <p className="text-sm text-muted-foreground">Spend your points</p>
            </button>
            
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <BookOpen className="w-6 h-6 mb-2 text-green-600" />
              <h3 className="font-medium">View Schedule</h3>
              <p className="text-sm text-muted-foreground">Check your classes</p>
            </button>
            
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <Star className="w-6 h-6 mb-2 text-purple-600" />
              <h3 className="font-medium">My Achievements</h3>
              <p className="text-sm text-muted-foreground">View your badges</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Group Information */}
      <Card>
        <CardHeader>
          <CardTitle>My Group Information</CardTitle>
          <CardDescription>
            Details about your current group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Group Details</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Group:</span> Math A</div>
                <div><span className="font-medium">Teacher:</span> John Smith</div>
                <div><span className="font-medium">Schedule:</span> Mon, Wed, Fri 2:00 PM</div>
                <div><span className="font-medium">Room:</span> 101</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Group Statistics</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Total Students:</span> 12</div>
                <div><span className="font-medium">Average Score:</span> 85%</div>
                <div><span className="font-medium">Group Rank:</span> 2nd</div>
                <div><span className="font-medium">Next Lesson:</span> Tomorrow 2:00 PM</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 