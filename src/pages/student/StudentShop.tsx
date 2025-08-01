import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuthStore } from '@/store/authStore'
import { useShopStore, type Product } from '@/store/shopStore'
import { ShoppingCart, Award, Package, Calendar, TrendingUp, TrendingDown } from 'lucide-react'

export default function StudentShop() {
  const { user } = useAuthStore()
  const { products, getStudentPoints, spendPoints, recordPurchase, getStudentPurchases, getStudentTransactions } = useShopStore()
  const [purchasing, setPurchasing] = useState<string | null>(null)

  const currentPoints = getStudentPoints(user?.id || '')
  const purchasedProducts = getStudentPurchases(user?.id || '')
  const pointTransactions = getStudentTransactions(user?.id || '')

  const handlePurchase = async (product: Product) => {
    if (currentPoints < product.price) {
      alert('Not enough points!')
      return
    }

    setPurchasing(product.id)
    
    // Simulate purchase process
    setTimeout(() => {
      spendPoints(user?.id || '', product.price, `Purchased ${product.name}`, product.id, product.name)
      recordPurchase(user?.id || '', product)
      setPurchasing(null)
      alert(`Successfully purchased ${product.name}!`)
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
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    }
  }

  return (
    <div className="space-y-6">
      {/* Points Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span>My Points</span>
          </CardTitle>
          <CardDescription>
            Spend your earned points on rewards and discounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{currentPoints}</div>
          <p className="text-sm text-muted-foreground">Available points</p>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-500" />
            <span>Available Products</span>
          </CardTitle>
          <CardDescription>
            Exchange your points for these amazing rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: Product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center mb-3">
                <img style={{width:'100%', height:'250px', objectFit:'cover'}} src={product.image}/>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{product.price} points</span>
                    </div>
                    <Button
                      onClick={() => handlePurchase(product)}
                      disabled={currentPoints < product.price || purchasing === product.id}
                      className="flex items-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        {purchasing === product.id ? 'Purchasing...' : 'Buy'}
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-green-500" />
            <span>My Purchased Products</span>
          </CardTitle>
          <CardDescription>
            Products you have exchanged for points
          </CardDescription>
        </CardHeader>
        <CardContent>
          {purchasedProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No products purchased yet.</p>
              <p className="text-sm">Start shopping to see your purchases here!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Status</TableHead>
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
                        <span className="font-medium">{purchase.price} points</span>
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
                        Purchased
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
      <Card>
        <CardHeader>
          <CardTitle>Points History</CardTitle>
          <CardDescription>
            Your recent points transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pointTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No point transactions yet.</p>
              <p className="text-sm">Complete activities to earn points!</p>
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
                        {transaction.type === 'earned' ? 'Points Earned' : 'Points Spent'}
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
      <Card>
        <CardHeader>
          <CardTitle>How to Earn Points</CardTitle>
          <CardDescription>
            Ways to earn more points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Perfect Attendance</h4>
              <p className="text-sm text-muted-foreground">+15 points per week</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Homework Completion</h4>
              <p className="text-sm text-muted-foreground">+10 points per assignment</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Class Participation</h4>
              <p className="text-sm text-muted-foreground">+5 points per class</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">High Scores</h4>
              <p className="text-sm text-muted-foreground">+20 points for 90%+ scores</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 