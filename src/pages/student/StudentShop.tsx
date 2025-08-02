import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuthStore } from '@/store/authStore'
import { useShopStore, type Product } from '@/store/shopStore'
import { ShoppingCart, Award, Package, Calendar, TrendingUp, TrendingDown } from 'lucide-react'

export default function StudentShop() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { products, getStudentPoints, spendPoints, recordPurchase, getStudentPurchases, getStudentTransactions } = useShopStore()
  const [purchasing, setPurchasing] = useState<string | null>(null)

  const currentPoints = getStudentPoints(user?.id || '')
  const purchasedProducts = getStudentPurchases(user?.id || '')
  const pointTransactions = getStudentTransactions(user?.id || '')

  const handlePurchase = async (product: Product) => {
    if (currentPoints < product.price) {
      alert(t('student.notEnoughPoints'))
      return
    }

    setPurchasing(product.id)
    
    // Simulate purchase process
    setTimeout(() => {
      spendPoints(user?.id || '', product.price, `Purchased ${product.name}`, product.id, product.name)
      recordPurchase(user?.id || '', product)
      setPurchasing(null)
      alert(`${t('student.successfullyPurchased')} ${product.name}!`)
    }, 1000)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - new Date(date).getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 0) {
      return `${diffInDays} ${diffInDays > 1 ? t('student.days') : t('student.day')} ${t('student.ago')}`
    } else if (diffInHours > 0) {
      return `${diffInHours} ${diffInHours > 1 ? t('student.hours') : t('student.hour')} ${t('student.ago')}`
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMinutes} ${diffInMinutes > 1 ? t('student.minutes') : t('student.minute')} ${t('student.ago')}`
    }
  }

  return (
    <div className="space-y-6">
      {/* Points Display */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-yellow-900 dark:text-yellow-100">{t('student.myPoints')}</CardTitle>
              <CardDescription className="text-yellow-700 dark:text-yellow-300">
                {t('student.spendEarnedPoints')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{currentPoints}</div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">{t('student.availablePoints')}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">💰</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-blue-900 dark:text-blue-100">{t('student.availableProducts')}</CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                {t('student.exchangePointsForRewards')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: Product) => (
              <Card key={product.id} className="overflow-hidden bg-white dark:bg-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border-blue-200 dark:border-blue-700">
                <div className="h-48 bg-gray-100 flex items-center justify-center mb-3">
                  <img style={{width:'100%', height:'250px', objectFit:'cover'}} src={product.image}/>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">{product.name}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">
                      <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="font-bold text-yellow-700 dark:text-yellow-300">{product.price} {t('student.shopPoints')}</span>
                    </div>
                    <Button
                      onClick={() => handlePurchase(product)}
                      disabled={currentPoints < product.price || purchasing === product.id}
                      className={`flex items-center space-x-2 ${
                        currentPoints < product.price 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        {purchasing === product.id ? t('student.purchasing') : t('student.buy')}
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Purchased Products Table */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-green-900 dark:text-green-100">{t('student.myPurchasedProducts')}</CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                {t('student.productsExchangedForPoints')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {purchasedProducts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">{t('student.noProductsPurchasedYet')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">{t('student.startShoppingToSeePurchases')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('student.product')}</TableHead>
                  <TableHead>{t('student.price')}</TableHead>
                  <TableHead>{t('student.purchaseDate')}</TableHead>
                  <TableHead>{t('student.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchasedProducts.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img 
                          src={purchase.productImage} 
                          alt={purchase.productName}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-medium">{purchase.productName}</p>
                          <p className="text-sm text-muted-foreground">ID: {purchase.productId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{purchase.price} {t('student.shopPoints')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{formatDate(purchase.purchaseDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t('student.purchased')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Points History */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">📊</span>
            </div>
            <div>
              <CardTitle className="text-purple-900 dark:text-purple-100">{t('student.pointsHistory')}</CardTitle>
              <CardDescription className="text-purple-700 dark:text-purple-300">
                {t('student.recentPointsTransactions')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pointTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">{t('student.noPointTransactionsYet')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">{t('student.completeActivitiesToEarnPoints')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pointTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    transaction.type === 'earned' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'earned' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'earned' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        transaction.type === 'earned' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {transaction.type === 'earned' ? t('student.pointsEarned') : t('student.pointsSpent')}
                      </p>
                      <p className={`text-sm ${
                        transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.reason}
                        {transaction.relatedProductName && (
                          <span className="ml-1 text-xs opacity-75">
                            ({transaction.relatedProductName})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-medium ${
                      transaction.type === 'earned' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                    </span>
                    <p className={`text-xs ${
                      transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatTimeAgo(transaction.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How to Earn Points */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">🎯</span>
            </div>
            <div>
              <CardTitle className="text-indigo-900 dark:text-indigo-100">{t('student.howToEarnPoints')}</CardTitle>
              <CardDescription className="text-indigo-700 dark:text-indigo-300">
                {t('student.waysToEarnMorePoints')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 border border-green-200 dark:border-green-700 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📅</span>
                </div>
                <h4 className="font-bold text-green-700 dark:text-green-300">{t('student.perfectAttendance')}</h4>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">+15 {t('student.pointsPerWeek')}</p>
            </div>
            
            <div className="p-6 border border-blue-200 dark:border-blue-700 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📝</span>
                </div>
                <h4 className="font-bold text-blue-700 dark:text-blue-300">{t('student.homeworkCompletion')}</h4>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">+10 {t('student.pointsPerAssignment')}</p>
            </div>
            
            <div className="p-6 border border-purple-200 dark:border-purple-700 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">💬</span>
                </div>
                <h4 className="font-bold text-purple-700 dark:text-purple-300">{t('student.classParticipation')}</h4>
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">+5 {t('student.pointsPerClass')}</p>
            </div>
            
            <div className="p-6 border border-orange-200 dark:border-orange-700 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🏆</span>
                </div>
                <h4 className="font-bold text-orange-700 dark:text-orange-300">{t('student.highScores')}</h4>
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">+20 {t('student.pointsForHighScores')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 