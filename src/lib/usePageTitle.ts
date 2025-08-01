import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Map of routes to their corresponding titles
const routeTitles: Record<string, string> = {
  '/': 'Login - Edu Platform',
  '/admin/dashboard': 'Admin Dashboard - Edu Platform',
  '/admin/teachers': 'Manage Teachers - Edu Platform',
  '/admin/students': 'Manage Students - Edu Platform',
  '/admin/payments': 'Payment Management - Edu Platform',
  '/admin/reports': 'Reports & Analytics - Edu Platform',
  '/admin/products': 'Product Management - Edu Platform',
  '/teacher/dashboard': 'Teacher Dashboard - Edu Platform',
  '/teacher/groups': 'My Groups - Edu Platform',
  '/teacher/lessons': 'Lesson Management - Edu Platform',
  '/teacher/attendance': 'Attendance Tracking - Edu Platform',
  '/teacher/statistics': 'Teaching Statistics - Edu Platform',
  '/teacher/calendar': 'Teaching Calendar - Edu Platform',
  '/teacher/quizzes': 'Quiz Management - Edu Platform',
  '/teacher/messages': 'Messages - Edu Platform',
  '/student/dashboard': 'Student Dashboard - Edu Platform',
  '/student/messages': 'Messages - Edu Platform',
  '/student/quizzes': 'My Quizzes - Edu Platform',
  '/student/calendar': 'My Calendar - Edu Platform',
  '/student/shop': 'Student Shop - Edu Platform',
  '/parent/dashboard': 'Parent Dashboard - Edu Platform',
  '/parent/child': 'My Child - Edu Platform',
  '/parent/payments': 'Payment History - Edu Platform'
}

export const usePageTitle = () => {
  const location = useLocation()

  useEffect(() => {
    const pathname = location.pathname
    const title = routeTitles[pathname] || 'Edu Platform'
    
    document.title = title
  }, [location.pathname])
} 