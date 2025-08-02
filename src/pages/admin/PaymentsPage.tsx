import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePaymentsStore } from '@/store/paymentsStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Search, DollarSign, Calendar } from 'lucide-react'

export default function PaymentsPage() {
  const { t } = useTranslation()
  const { payments, getPaymentsByMonth, getTotalPaymentsByMonth } = usePaymentsStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('2024-02')

  // Get unique months from payments
  const months = [...new Set(payments.map(p => p.month))].sort().reverse()

  const filteredPayments = payments.filter(payment =>
    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedMonth === 'all' || payment.month === selectedMonth)
  )

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-')
    const date = new Date(parseInt(year), parseInt(monthNum) - 1)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'overdue':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('admin.paymentsManagement')}</h1>
        <p className="text-muted-foreground">{t('admin.paymentsManagementDesc')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.totalPayments')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.length} {t('admin.payments')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.currentMonth')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${getTotalPaymentsByMonth(selectedMonth).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatMonth(selectedMonth)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.averagePayment')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filteredPayments.length > 0 ? (totalAmount / filteredPayments.length).toFixed(0) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('admin.perStudent')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('admin.searchByStudentName')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('admin.allMonths')}</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {formatMonth(month)}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.studentName')}</TableHead>
                <TableHead>{t('admin.group')}</TableHead>
                <TableHead>{t('admin.amount')}</TableHead>
                <TableHead>{t('admin.month')}</TableHead>
                <TableHead>{t('admin.paymentDate')}</TableHead>
                <TableHead>{t('admin.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.studentName}</TableCell>
                  <TableCell>{payment.group}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>{formatMonth(payment.month)}</TableCell>
                  <TableCell>
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.monthlyBreakdown')}</CardTitle>
          <CardDescription>{t('admin.paymentTotalsByMonth')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {months.map((month) => {
              const monthPayments = getPaymentsByMonth(month)
              const total = getTotalPaymentsByMonth(month)
              return (
                <div key={month} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{formatMonth(month)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {monthPayments.length} {t('admin.payments')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${total.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">
                      {t('admin.average')}: ${monthPayments.length > 0 ? (total / monthPayments.length).toFixed(0) : 0}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 