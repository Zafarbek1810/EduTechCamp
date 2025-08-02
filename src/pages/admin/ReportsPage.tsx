import { useTranslation } from 'react-i18next'
import { useTeachersStore } from '@/store/teachersStore'
import { useStudentsStore } from '@/store/studentsStore'
import { usePaymentsStore } from '@/store/paymentsStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, DollarSign, Award } from 'lucide-react'

export default function ReportsPage() {
  const { t } = useTranslation()
  const { teachers } = useTeachersStore()
  const { students } = useStudentsStore()
  const { payments } = usePaymentsStore()

  // Calculate total revenue
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0)

  // Calculate teacher performance metrics
  const teacherReports = teachers.map(teacher => {
    const teacherStudents = students.filter(student => student.teacherId === teacher.id)
    const teacherPayments = payments.filter(payment => 
      teacherStudents.some(student => student.id === payment.studentId)
    )
    
    const totalFeesContributed = teacherPayments.reduce((sum, payment) => sum + payment.amount, 0)
    const percentageOfTotal = totalRevenue > 0 ? (totalFeesContributed / totalRevenue) * 100 : 0
    
    // Mock KPI calculation (based on students, attendance, and performance)
    const kpi = Math.min(100, Math.max(0, 
      (teacherStudents.length * 10) + 
      (percentageOfTotal * 2) + 
      (Math.random() * 20) // Mock performance factor
    ))
    
    // Salary calculation (base + performance bonus)
    const baseSalary = 2000
    const performanceBonus = (kpi / 100) * 1000
    const calculatedSalary = baseSalary + performanceBonus

    return {
      ...teacher,
      studentsCount: teacherStudents.length,
      totalFeesContributed,
      percentageOfTotal,
      kpi: Math.round(kpi),
      calculatedSalary: Math.round(calculatedSalary)
    }
  })

  // Chart data for revenue distribution
  const revenueData = teacherReports.map(teacher => ({
    name: teacher.fullName,
    revenue: teacher.totalFeesContributed,
    students: teacher.studentsCount
  }))

  // Chart data for KPI distribution
  const kpiData = teacherReports.map(teacher => ({
    name: teacher.fullName,
    kpi: teacher.kpi
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('admin.reportsAndAnalytics')}</h1>
        <p className="text-muted-foreground">{t('admin.comprehensiveReports')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {t('admin.allTimePayments')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.totalTeachers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('admin.activeTeachers')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.totalStudents')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('admin.enrolledStudents')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.avgKpi')}</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(teacherReports.reduce((sum, t) => sum + t.kpi, 0) / teacherReports.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {t('admin.averagePerformance')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.teacherPerformanceReport')}</CardTitle>
          <CardDescription>{t('admin.detailedMetricsAndSalary')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.teacherName')}</TableHead>
                <TableHead>{t('admin.subject')}</TableHead>
                <TableHead>{t('admin.students')}</TableHead>
                <TableHead>{t('admin.revenueGenerated')}</TableHead>
                <TableHead>{t('admin.percentOfTotal')}</TableHead>
                <TableHead>{t('admin.kpi')}</TableHead>
                <TableHead>{t('admin.calculatedSalary')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teacherReports.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.fullName}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.studentsCount}</TableCell>
                  <TableCell>${teacher.totalFeesContributed.toLocaleString()}</TableCell>
                  <TableCell>{teacher.percentageOfTotal.toFixed(1)}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${teacher.kpi}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{teacher.kpi}%</span>
                    </div>
                  </TableCell>
                  <TableCell>${teacher.calculatedSalary.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

              {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.revenueDistributionByTeacher')}</CardTitle>
              <CardDescription>{t('admin.totalFeesContributedByTeacher')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, t('admin.revenue')]} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* KPI Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.kpiDistribution')}</CardTitle>
              <CardDescription>{t('admin.performanceMetricsByTeacher')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={kpiData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, kpi }) => `${name}: ${kpi}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="kpi"
                  >
                    {kpiData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, t('admin.kpi')]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

              {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.performanceInsights')}</CardTitle>
            <CardDescription>{t('admin.keyMetricsAndRecommendations')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">{t('admin.topPerformers')}</h3>
                <div className="space-y-2">
                  {teacherReports
                    .sort((a, b) => b.kpi - a.kpi)
                    .slice(0, 3)
                    .map((teacher) => (
                      <div key={teacher.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="font-medium">{teacher.fullName}</span>
                        <span className="text-green-600 font-bold">{teacher.kpi}% {t('admin.kpi')}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">{t('admin.revenueLeaders')}</h3>
                <div className="space-y-2">
                  {teacherReports
                    .sort((a, b) => b.totalFeesContributed - a.totalFeesContributed)
                    .slice(0, 3)
                    .map((teacher) => (
                      <div key={teacher.id} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="font-medium">{teacher.fullName}</span>
                        <span className="text-blue-600 font-bold">${teacher.totalFeesContributed.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  )
} 