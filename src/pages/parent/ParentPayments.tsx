import { useState } from 'react'
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
  Eye
} from 'lucide-react'

export default function ParentPayments() {
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
      description: 'Monthly Tuition Fee'
    },
    paymentHistory: [
      { id: '1', date: '2024-01-01', amount: 250, description: 'Monthly Tuition Fee', status: 'paid', method: 'Credit Card' },
      { id: '2', date: '2023-12-01', amount: 250, description: 'Monthly Tuition Fee', status: 'paid', method: 'Bank Transfer' },
      { id: '3', date: '2023-11-01', amount: 250, description: 'Monthly Tuition Fee', status: 'paid', method: 'Credit Card' },
      { id: '4', date: '2023-10-01', amount: 250, description: 'Monthly Tuition Fee', status: 'paid', method: 'Bank Transfer' },
      { id: '5', date: '2023-09-01', amount: 250, description: 'Monthly Tuition Fee', status: 'paid', method: 'Credit Card' },
      { id: '6', date: '2023-08-01', amount: 250, description: 'Monthly Tuition Fee', status: 'paid', method: 'Bank Transfer' },
      { id: '7', date: '2023-07-01', amount: 250, description: 'Monthly Tuition Fee', status: 'paid', method: 'Credit Card' },
      { id: '8', date: '2023-06-01', amount: 250, description: 'Monthly Tuition Fee', status: 'paid', method: 'Bank Transfer' },
      { id: '9', date: '2023-05-01', amount: 250, description: 'Monthly Tuition Fee', status: 'paid', method: 'Credit Card' },
      { id: '10', date: '2023-04-01', amount: 250, description: 'Monthly Tuition Fee', status: 'paid', method: 'Bank Transfer' }
    ],
    upcomingPayments: [
      { id: '11', dueDate: '2024-02-01', amount: 250, description: 'Monthly Tuition Fee', status: 'pending' },
      { id: '12', dueDate: '2024-03-01', amount: 250, description: 'Monthly Tuition Fee', status: 'pending' },
      { id: '13', dueDate: '2024-04-01', amount: 250, description: 'Monthly Tuition Fee', status: 'pending' },
      { id: '14', dueDate: '2024-05-01', amount: 250, description: 'Monthly Tuition Fee', status: 'pending' }
    ],
    paymentMethods: [
      { id: '1', type: 'Credit Card', last4: '1234', expiry: '12/25', isDefault: true },
      { id: '2', type: 'Bank Account', account: '****5678', bank: 'Chase Bank', isDefault: false }
    ]
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage payments for {paymentData.childName}</p>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paymentData.totalPaid)}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">This academic year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(paymentData.totalDue)}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">This academic year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(paymentData.outstanding)}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Remaining balance</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(paymentData.nextPayment.amount)}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Due {paymentData.nextPayment.dueDate}</p>
          </CardContent>
        </Card>
      </div>

      {/* Next Payment Alert */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Next Payment Due</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {paymentData.nextPayment.description} - {formatCurrency(paymentData.nextPayment.amount)}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Due: {paymentData.nextPayment.dueDate}
                </p>
              </div>
            </div>
            <Button>Make Payment</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Payment History</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Payment History</span>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentData.paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.status)}
                          {getStatusBadge(payment.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentData.upcomingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{payment.description}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Due: {payment.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
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

        <TabsContent value="methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Payment Methods</span>
                <Button size="sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Method
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentData.paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{method.type}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {method.type === 'Credit Card' 
                            ? `**** ${method.last4} • Expires ${method.expiry}`
                            : `${method.bank} • ****${method.account}`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && (
                        <Badge variant="outline" className="text-xs">Default</Badge>
                      )}
                      <Button variant="outline" size="sm">Edit</Button>
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