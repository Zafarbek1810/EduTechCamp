import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export interface StudentPoints {
  studentId: string
  points: number
  totalEarned: number
  totalSpent: number
}

export interface PurchaseRecord {
  id: string
  studentId: string
  productId: string
  productName: string
  productImage: string
  price: number
  purchaseDate: Date
}

export interface PointTransaction {
  id: string
  studentId: string
  type: 'earned' | 'spent'
  amount: number
  reason: string
  timestamp: Date
  relatedProductId?: string
  relatedProductName?: string
}

interface ShopState {
  products: Product[]
  studentPoints: Record<string, StudentPoints>
  purchaseHistory: PurchaseRecord[]
  pointTransactions: PointTransaction[]
  addProduct: (product: Omit<Product, 'id'>) => void
  removeProduct: (id: string) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  addPoints: (studentId: string, points: number, reason: string) => void
  spendPoints: (studentId: string, points: number, reason: string, productId?: string, productName?: string) => void
  getStudentPoints: (studentId: string) => number
  recordPurchase: (studentId: string, product: Product) => void
  getStudentPurchases: (studentId: string) => PurchaseRecord[]
  getStudentTransactions: (studentId: string) => PointTransaction[]
}

// Mock initial products
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Notebook',
    description: 'High-quality notebook for students',
    price: 50,
    image: 'https://avatars.mds.yandex.net/i?id=cbe036f47064fdebf62f4403fadf9c7f809de85b-13290936-images-thumbs&n=13',
    // image: '/notebook.jpg',
    category: 'Stationery'
  },
  {
    id: '2',
    name: 'Discount Voucher',
    description: '10% discount on next month fees',
    price: 100,
    image: 'https://avatars.mds.yandex.net/i?id=a0d14928f6494f3dd11f27faa763a281361b4616-12474042-images-thumbs&n=13',
    // image: '/voucher.jpg',
    category: 'Discount'
  }
]

// Mock initial student points
const initialStudentPoints: Record<string, StudentPoints> = {
  '3': { // student1
    studentId: '3',
    points: 150,
    totalEarned: 200,
    totalSpent: 50
  }
}

// Mock initial purchase history
const initialPurchaseHistory: PurchaseRecord[] = [
  {
    id: '1',
    studentId: '3',
    productId: '1',
    productName: 'Premium Notebook',
    productImage: 'https://avatars.mds.yandex.net/i?id=cbe036f47064fdebf62f4403fadf9c7f809de85b-13290936-images-thumbs&n=13',
    price: 50,
    purchaseDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  }
]

// Mock initial point transactions
const initialPointTransactions: PointTransaction[] = [
  {
    id: '1',
    studentId: '3',
    type: 'earned',
    amount: 10,
    reason: 'Completed Math homework',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: '2',
    studentId: '3',
    type: 'spent',
    amount: 50,
    reason: 'Purchased Premium Notebook',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    relatedProductId: '1',
    relatedProductName: 'Premium Notebook'
  },
  {
    id: '3',
    studentId: '3',
    type: 'earned',
    amount: 15,
    reason: 'Perfect attendance this week',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    id: '4',
    studentId: '3',
    type: 'earned',
    amount: 20,
    reason: 'High score on Science quiz (95%)',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    id: '5',
    studentId: '3',
    type: 'earned',
    amount: 5,
    reason: 'Class participation in English',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
  }
]

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      studentPoints: initialStudentPoints,
      purchaseHistory: initialPurchaseHistory,
      pointTransactions: initialPointTransactions,
      
      addProduct: (product) => {
        const newProduct = {
          ...product,
          id: Date.now().toString()
        }
        set(state => ({
          products: [...state.products, newProduct]
        }))
      },
      
      removeProduct: (id) => {
        set(state => ({
          products: state.products.filter(p => p.id !== id)
        }))
      },
      
      updateProduct: (id, product) => {
        set(state => ({
          products: state.products.map(p => 
            p.id === id ? { ...p, ...product } : p
          )
        }))
      },
      
      addPoints: (studentId, points, reason) => {
        const transaction: PointTransaction = {
          id: Date.now().toString(),
          studentId,
          type: 'earned',
          amount: points,
          reason,
          timestamp: new Date()
        }
        
        set(state => {
          const current = state.studentPoints[studentId] || {
            studentId,
            points: 0,
            totalEarned: 0,
            totalSpent: 0
          }
          
          return {
            studentPoints: {
              ...state.studentPoints,
              [studentId]: {
                ...current,
                points: current.points + points,
                totalEarned: current.totalEarned + points
              }
            },
            pointTransactions: [transaction, ...state.pointTransactions]
          }
        })
      },
      
      spendPoints: (studentId, points, reason, productId?, productName?) => {
        const transaction: PointTransaction = {
          id: Date.now().toString(),
          studentId,
          type: 'spent',
          amount: points,
          reason,
          timestamp: new Date(),
          relatedProductId: productId,
          relatedProductName: productName
        }
        
        set(state => {
          const current = state.studentPoints[studentId]
          if (!current || current.points < points) return state
          
          return {
            studentPoints: {
              ...state.studentPoints,
              [studentId]: {
                ...current,
                points: current.points - points,
                totalSpent: current.totalSpent + points
              }
            },
            pointTransactions: [transaction, ...state.pointTransactions]
          }
        })
      },
      
      getStudentPoints: (studentId) => {
        const state = get()
        return state.studentPoints[studentId]?.points || 0
      },

      recordPurchase: (studentId, product) => {
        const purchaseRecord: PurchaseRecord = {
          id: Date.now().toString(),
          studentId,
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          price: product.price,
          purchaseDate: new Date()
        }
        
        set(state => ({
          purchaseHistory: [purchaseRecord, ...state.purchaseHistory]
        }))
      },

      getStudentPurchases: (studentId) => {
        const state = get()
        return state.purchaseHistory
          .filter(purchase => purchase.studentId === studentId)
          .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
      },

      getStudentTransactions: (studentId) => {
        const state = get()
        return state.pointTransactions
          .filter(transaction => transaction.studentId === studentId)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      }
    }),
    {
      name: 'shop-storage'
    }
  )
) 