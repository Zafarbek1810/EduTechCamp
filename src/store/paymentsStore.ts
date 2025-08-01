import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Payment {
  id: string
  studentId: string
  studentName: string
  group: string
  amount: number
  month: string
  paymentDate: string
  status: 'paid' | 'pending' | 'overdue'
}

interface PaymentsState {
  payments: Payment[]
  addPayment: (payment: Omit<Payment, 'id'>) => void
  updatePayment: (id: string, payment: Partial<Payment>) => void
  deletePayment: (id: string) => void
  getPaymentsByMonth: (month: string) => Payment[]
  getPaymentsByStudent: (studentId: string) => Payment[]
  getTotalPaymentsByMonth: (month: string) => number
}

// Mock initial payments data
const initialPayments: Payment[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Alice Johnson',
    group: 'Math Group A',
    amount: 500,
    month: '2024-01',
    paymentDate: '2024-01-15',
    status: 'paid'
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Bob Wilson',
    group: 'Math Group A',
    amount: 500,
    month: '2024-01',
    paymentDate: '2024-01-20',
    status: 'paid'
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Carol Davis',
    group: 'English Group B',
    amount: 450,
    month: '2024-01',
    paymentDate: '2024-01-18',
    status: 'paid'
  },
  {
    id: '4',
    studentId: '4',
    studentName: 'David Miller',
    group: 'Science Group C',
    amount: 550,
    month: '2024-01',
    paymentDate: '2024-01-25',
    status: 'paid'
  },
  {
    id: '5',
    studentId: '5',
    studentName: 'Emma Brown',
    group: 'Science Group C',
    amount: 550,
    month: '2024-01',
    paymentDate: '2024-01-30',
    status: 'paid'
  },
  {
    id: '6',
    studentId: '1',
    studentName: 'Alice Johnson',
    group: 'Math Group A',
    amount: 500,
    month: '2024-02',
    paymentDate: '2024-02-15',
    status: 'paid'
  },
  {
    id: '7',
    studentId: '2',
    studentName: 'Bob Wilson',
    group: 'Math Group A',
    amount: 500,
    month: '2024-02',
    paymentDate: '2024-02-20',
    status: 'paid'
  },
  {
    id: '8',
    studentId: '3',
    studentName: 'Carol Davis',
    group: 'English Group B',
    amount: 450,
    month: '2024-02',
    paymentDate: '2024-02-18',
    status: 'paid'
  },
  {
    id: '9',
    studentId: '4',
    studentName: 'David Miller',
    group: 'Science Group C',
    amount: 550,
    month: '2024-02',
    paymentDate: '2024-02-25',
    status: 'paid'
  },
  {
    id: '10',
    studentId: '5',
    studentName: 'Emma Brown',
    group: 'Science Group C',
    amount: 550,
    month: '2024-02',
    paymentDate: '2024-02-28',
    status: 'paid'
  }
]

export const usePaymentsStore = create<PaymentsState>()(
  persist(
    (set, get) => ({
      payments: initialPayments,
      
      addPayment: (payment) => {
        const newPayment = {
          ...payment,
          id: Date.now().toString()
        }
        set(state => ({
          payments: [...state.payments, newPayment]
        }))
      },
      
      updatePayment: (id, payment) => {
        set(state => ({
          payments: state.payments.map(p => 
            p.id === id ? { ...p, ...payment } : p
          )
        }))
      },
      
      deletePayment: (id) => {
        set(state => ({
          payments: state.payments.filter(p => p.id !== id)
        }))
      },
      
      getPaymentsByMonth: (month) => {
        const state = get()
        return state.payments.filter(p => p.month === month)
      },
      
      getPaymentsByStudent: (studentId) => {
        const state = get()
        return state.payments.filter(p => p.studentId === studentId)
      },
      
      getTotalPaymentsByMonth: (month) => {
        const state = get()
        return state.payments
          .filter(p => p.month === month)
          .reduce((total, p) => total + p.amount, 0)
      }
    }),
    {
      name: 'payments-storage'
    }
  )
) 