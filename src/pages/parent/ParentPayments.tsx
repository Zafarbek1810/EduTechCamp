import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Eye,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit
} from 'lucide-react'

export default function ParentPayments() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock payment data
  const paymentData = {
    childName: 'Alice Student',
    totalPaid: 2500,
    totalDue: 3000,
    outstanding: 500,
    nextPayment: {
      amount: 250,
      dueDate: '2024-02-01',
      description: t('student.monthlyTuitionFee')
    },
    paymentHistory: [
      { id: '1', date: '2024-01-01', amount: 250, description: t('student.monthlyTuitionFee'), status: 'paid', method: t('student.creditCard') },
      { id: '2', date: '2023-12-01', amount: 250, description: t('student.monthlyTuitionFee'), status: 'paid', method: t('student.bankAccount') },
      { id: '3', date: '2023-11-01', amount: 250, description: t('student.monthlyTuitionFee'), status: 'paid', method: t('student.creditCard') },
      { id: '4', date: '2023-10-01', amount: 250, description: t('student.monthlyTuitionFee'), status: 'paid', method: t('student.bankAccount') },
      { id: '5', date: '2023-09-01', amount: 250, description: t('student.monthlyTuitionFee'), status: 'paid', method: t('student.creditCard') },
      { id: '6', date: '2023-08-01', amount: 250, description: t('student.monthlyTuitionFee'), status: 'paid', method: t('student.bankAccount') },
      { id: '7', date: '2023-07-01', amount: 250, description: t('student.monthlyTuitionFee'), status: 'paid', method: t('student.creditCard') },
      { id: '8', date: '2023-06-01', amount: 250, description: t('student.monthlyTuitionFee'), status: 'paid', method: t('student.bankAccount') },
      { id: '9', date: '2023-05-01', amount: 250, description: t('student.monthlyTuitionFee'), status: 'paid', method: t('student.creditCard') },
      { id: '10', date: '2023-04-01', amount: 250, description: t('student.monthlyTuitionFee'), status: 'paid', method: t('student.bankAccount') }
    ],
    upcomingPayments: [
      { id: '11', dueDate: '2024-02-01', amount: 250, description: t('student.monthlyTuitionFee'), status: 'pending' },
      { id: '12', dueDate: '2024-03-01', amount: 250, description: t('student.monthlyTuitionFee'), status: 'pending' },
      { id: '13', dueDate: '2024-04-01', amount: 250, description: t('student.monthlyTuitionFee'), status: 'pending' },
      { id: '14', dueDate: '2024-05-01', amount: 250, description: t('student.monthlyTuitionFee'), status: 'pending' }
    ],
    paymentMethods: [
      { id: '1', type: t('student.creditCard'), last4: '1234', expiry: '12/25', isDefault: true },
      { id: '2', type: t('student.bankAccount'), account: '****5678', bank: 'Chase Bank', isDefault: false }
    ]
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0">{t('student.paid')}</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-0">{t('student.pending')}</Badge>
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-0">{t('student.overdue')}</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-0">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t('student.payments')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('student.managePaymentsForChild', { name: paymentData.childName })}
          </p>
        </div>

        {/* Enhanced Payment Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('student.totalPaid')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{formatCurrency(paymentData.totalPaid)}</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">{t('student.thisAcademicYear')}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                {t('student.totalDue')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(paymentData.totalDue)}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">{t('student.thisAcademicYear')}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {t('student.outstanding')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(paymentData.outstanding)}</div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">{t('student.remainingBalance')}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {t('student.nextPayment')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(paymentData.nextPayment.amount)}</div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">{t('student.dueDate', { date: paymentData.nextPayment.dueDate })}</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Next Payment Alert */}
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('student.nextPaymentDue')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {paymentData.nextPayment.description} - {formatCurrency(paymentData.nextPayment.amount)}
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                    {t('student.due')}: {paymentData.nextPayment.dueDate}
                  </p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-0 shadow-lg">
                {t('student.makePayment')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              {t('student.paymentHistory')}
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-yellow-600 data-[state=active]:text-white">
              {t('student.upcomingPayments')}
            </TabsTrigger>
            <TabsTrigger value="methods" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
              {t('student.paymentMethods')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <span>{t('student.paymentHistory')}</span>
                  </div>
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Download className="w-4 h-4 mr-2" />
                    {t('student.export')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                        <TableHead className="font-semibold">{t('student.date')}</TableHead>
                        <TableHead className="font-semibold">{t('student.description')}</TableHead>
                        <TableHead className="font-semibold">{t('student.amount')}</TableHead>
                        <TableHead className="font-semibold">{t('student.method')}</TableHead>
                        <TableHead className="font-semibold">{t('student.status')}</TableHead>
                        <TableHead className="font-semibold">{t('student.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentData.paymentHistory.map((payment) => (
                        <TableRow key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell className="font-medium">{payment.date}</TableCell>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell className="font-bold text-green-600 dark:text-green-400">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(payment.status)}
                              {getStatusBadge(payment.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-8">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <span>{t('student.upcomingPayments')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {paymentData.upcomingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{payment.description}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{t('student.due')}: {payment.dueDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(payment.amount)}
                        </div>
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods" className="space-y-8">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <span>{t('student.paymentMethods')}</span>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('student.addMethod')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {paymentData.paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                          <CreditCard className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{method.type}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {method.type === t('student.creditCard')
                              ? `**** ${method.last4} • ${t('student.expires')} ${method.expiry}`
                              : `${method.bank} • ****${method.account}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {method.isDefault && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0">
                            {t('student.default')}
                          </Badge>
                        )}
                        <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                          <Edit className="w-4 h-4 mr-2" />
                          {t('student.edit')}
                        </Button>
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