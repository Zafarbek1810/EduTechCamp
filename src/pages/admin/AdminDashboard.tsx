import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, GraduationCap, DollarSign, TrendingUp } from "lucide-react";

// Mock data for charts
const monthlyRevenue = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 18000 },
  { month: "Apr", revenue: 14000 },
  { month: "May", revenue: 22000 },
  { month: "Jun", revenue: 25000 },
];

const userStats = [
  { name: "students", value: 45, color: "#3B82F6" },
  { name: "teachers", value: 8, color: "#10B981" },
  { name: "admins", value: 2, color: "#F59E0B" },
];

const teacherPerformance = [
  { name: "John Smith", students: 12, salary: 2500 },
  { name: "Sarah Johnson", students: 15, salary: 3000 },
  { name: "Mike Wilson", students: 8, salary: 1800 },
  { name: "Lisa Brown", students: 10, salary: 2200 },
];

export default function AdminDashboard() {
  const { t } = useTranslation()
  console.log('AdminDashboard - rendering')
  
  return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.totalStudents')}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.fromLastMonth', { percent: '+2' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.totalTeachers')}
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.fromLastMonth', { percent: '+1' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.monthlyRevenue')}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$25,000</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.fromLastMonth', { percent: '+12%' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.growthRate')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+15%</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.fromLastMonth', { percent: '+2%' })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.monthlyRevenue')}</CardTitle>
              <CardDescription>
                {t('dashboard.revenueTrend')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.userDistribution')}</CardTitle>
              <CardDescription>{t('dashboard.userBreakdown')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${t(`dashboard.${name}`)} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Teacher Performance */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.teacherPerformance')}</CardTitle>
            <CardDescription>
              {t('dashboard.teacherPerformanceDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teacherPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar
                  yAxisId="left"
                  dataKey="students"
                  fill="#3B82F6"
                  name={t('dashboard.students')}
                />
                <Bar
                  yAxisId="right"
                  dataKey="salary"
                  fill="#10B981"
                  name={t('dashboard.salary')}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
            <CardDescription>{t('dashboard.latestActivities')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {t('dashboard.newStudentRegistration')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('dashboard.aliceJohnsonRegistered')}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t('dashboard.twoHoursAgo')}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('dashboard.paymentReceived')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('dashboard.monthlyFeePayment')}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t('dashboard.fourHoursAgo')}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t('dashboard.newProductAdded')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('dashboard.premiumNotebookAdded')}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t('dashboard.sixHoursAgo')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
