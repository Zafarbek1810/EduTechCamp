import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useShopStore, type Product } from '@/store/shopStore'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function AdminProducts() {
  const { t } = useTranslation()
  const { products, addProduct, removeProduct, updateProduct } = useShopStore()
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        image: formData.image
      })
      setEditingProduct(null)
    } else {
      addProduct({
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        image: formData.image
      })
    }
    
    setFormData({ name: '', description: '', price: '', category: '', image: '' })
    setShowForm(false)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm(t('admin.confirmDeleteProduct'))) {
      removeProduct(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.shopProducts')}</h2>
          <p className="text-muted-foreground">{t('admin.manageShopProducts')}</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex-0 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
          <Plus className="w-4 h-4" />
          <span>{t('admin.addProduct')}</span>
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? t('admin.editProduct') : t('admin.addNewProduct')}</CardTitle>
            <CardDescription>
              {editingProduct ? t('admin.updateProductInfo') : t('admin.createNewProduct')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">{t('admin.productName')}</label>
                  <Input
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('admin.enterProductName')}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">{t('admin.category')}</label>
                  <Input
                    value={formData.category}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, category: e.target.value })}
                    placeholder={t('admin.categoryExample')}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">{t('admin.description')}</label>
                <Input
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('admin.enterProductDescription')}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">{t('admin.pricePoints')}</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
                    placeholder={t('admin.enterPriceInPoints')}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">{t('admin.imageUrl')}</label>
                  <Input
                    value={formData.image}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, image: e.target.value })}
                    placeholder={t('admin.enterImageUrl')}
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-0 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
                  {editingProduct ? t('admin.updateProduct') : t('admin.addProduct')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                    setFormData({ name: '', description: '', price: '', category: '', image: '' })
                  }}
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="h-48 bg-gray-100 flex items-center justify-center mb-3">
              {/* <Package className="w-16 h-16 text-gray-400" /> */}
              <img style={{width:'100%', height:'250px', objectFit:'cover'}} src={product.image}/>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('admin.category')}:</span>
                  <span className="text-sm text-muted-foreground">{product.category}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('admin.price')}:</span>
                  <span className="text-sm font-bold text-blue-600">{product.price} {t('admin.points')}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {t('common.edit')}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('admin.totalProducts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">{t('admin.availableInShop')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('admin.averagePrice')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.length > 0 
                ? Math.round(products.reduce((sum: number, p: Product) => sum + p.price, 0) / products.length)
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">{t('admin.pointsPerProduct')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('admin.categories')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(products.map((p: Product) => p.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">{t('admin.differentCategories')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 