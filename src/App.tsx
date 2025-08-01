import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { usePageTitle } from '@/lib/usePageTitle'
import AuthPage from '@/pages/AuthPage'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import TeacherDashboard from '@/pages/teacher/TeacherDashboard'
import StudentDashboard from '@/pages/student/StudentDashboard'
import TeachersPage from './pages/admin/TeachersPage'
import StudentsPage from './pages/admin/StudentsPage'
import PaymentsPage from './pages/admin/PaymentsPage'
import ReportsPage from './pages/admin/ReportsPage'
import AdminProducts from './pages/admin/AdminProducts'
import TeacherGroups from './pages/teacher/TeacherGroups'
import TeacherLessons from './pages/teacher/TeacherLessons'
import TeacherAttendance from './pages/teacher/TeacherAttendance'
import TeacherStatistics from './pages/teacher/TeacherStatistics'
import TeacherCalendar from './pages/teacher/TeacherCalendar'
import TeacherQuizzes from './pages/teacher/TeacherQuizzes'
import TeacherMessages from './pages/teacher/TeacherMessages'
import TeacherAITestGenerator from './pages/teacher/TeacherAITestGenerator'
import StudentShop from './pages/student/StudentShop'
import StudentCalendar from './pages/student/StudentCalendar'
import StudentQuizzes from './pages/student/StudentQuizzes'
import StudentMessages from './pages/student/StudentMessages'
import StudentHomework from './pages/student/StudentHomework'
import StudentGames from './pages/student/StudentGames'
import StudentTests from './pages/student/StudentTests'
import ParentDashboard from './pages/parent/ParentDashboard'
import ParentChild from './pages/parent/ParentChild'
import ParentPayments from './pages/parent/ParentPayments'

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuthStore()
  if (!isAuthenticated || !user) {
    console.log('Redirecting to login - not authenticated')
    return <Navigate to="/" replace />
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

const links = [
  {
    role: 'admin',
    path: '/admin/dashboard',
    element: <AdminDashboard />
  },
  {
    role: 'admin',
    path: '/admin/teachers',
    element: <TeachersPage />
  },
  {
    role: 'admin',
    path: '/admin/students',
    element: <StudentsPage />
  },
  {
    role: 'admin',
    path: '/admin/payments',
    element: <PaymentsPage />
  },
  { 
    role: 'admin',
    path: '/admin/reports',
    element: <ReportsPage />
  },
  {
    role: 'admin',
    path: '/admin/products',
    element: <AdminProducts />
  },
  {
    role: 'teacher',
    path: '/teacher/dashboard',
    element: <TeacherDashboard />
  },
  {
    role: 'teacher',
    path: '/teacher/groups',
    element: <TeacherGroups />
  },
  { 
    role: 'teacher',
    path: '/teacher/lessons',
    element: <TeacherLessons />
  }, 
  {
    role: 'teacher',
    path: '/teacher/attendance',
    element: <TeacherAttendance />
  },
  {
    role: 'teacher',
    path: '/teacher/statistics',
    element: <TeacherStatistics />
  },
  {
    role: 'teacher',
    path: '/teacher/calendar',
    element: <TeacherCalendar />
  },
  {
    role: 'teacher',
    path: '/teacher/quizzes',
    element: <TeacherQuizzes />
  },
  {
    role: 'teacher',
    path: '/teacher/ai-test-generator',
    element: <TeacherAITestGenerator />
  },
  {
    role: 'teacher',
    path: '/teacher/messages',
    element: <TeacherMessages />
  },
  {
    role: 'student',
    path: '/student/dashboard',
    element: <StudentDashboard />
  },
  {
    role: 'student',
    path: '/student/messages',
    element: <StudentMessages />
  },
  {
    role: 'student',
    path: '/student/quizzes',
    element: <StudentQuizzes />
  },
  {
    role: 'student',
    path: '/student/calendar',
    element: <StudentCalendar />
  },
  {
    role: 'student',
    path: '/student/shop',
    element: <StudentShop />
  },
  {
    role: 'student',
    path: '/student/homework',
    element: <StudentHomework />
  },
  {
    role: 'student',
    path: '/student/games',
    element: <StudentGames />
  },
  {
    role: 'student',
    path: '/student/tests',
    element: <StudentTests />
  },
  {
    role: 'parent',
    path: '/parent/dashboard',
    element: <ParentDashboard />
  },
  {
    role: 'parent',
    path: '/parent/child',
    element: <ParentChild />
  },
  {
    role: 'parent',
    path: '/parent/payments',
    element: <ParentPayments />
  }
]

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AppContent() {
  const { user, isAuthenticated } = useAuthStore()
  
  // Use the page title hook inside Router context
  usePageTitle()

  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={
        isAuthenticated && user ? (
          <Navigate to={`/${user.role}/dashboard`} replace />
        ) : (
          <AuthPage />
        )
      } />
      {links.map((link) => (
        <Route key={link.path} path={link.path} element={
          <ProtectedRoute allowedRoles={[link.role]}>
            <DashboardLayout>
              {link.element}
            </DashboardLayout>
          </ProtectedRoute>
        } />
      ))}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
