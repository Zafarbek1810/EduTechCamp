import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  FileText, 
  BarChart3, 
  LogOut,
  User,
  GraduationCap,
  CheckCircle,
  Menu,
  X,
  Calendar,
  ClipboardList,
  MessageSquare,
  BookOpen
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  )

  console.log('DashboardLayout - user:', user)
  console.log('DashboardLayout - location:', location.pathname)
  console.log('DashboardLayout - children:', children)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getNavigationItems = () => {
    if (!user) return []

    switch (user.role) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Teachers', href: '/admin/teachers', icon: Users },
          { name: 'Students', href: '/admin/students', icon: GraduationCap },
          { name: 'Payments', href: '/admin/payments', icon: FileText },
          { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
          { name: 'Products', href: '/admin/products', icon: ShoppingCart },
        ]
      case 'teacher':
        return [
          { name: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
          { name: 'My Groups', href: '/teacher/groups', icon: Users },
          { name: 'Lessons', href: '/teacher/lessons', icon: BookOpen },
          { name: 'Attendance', href: '/teacher/attendance', icon: CheckCircle },
          { name: 'Statistics', href: '/teacher/statistics', icon: BarChart3 },
          { name: 'Calendar', href: '/teacher/calendar', icon: Calendar },
          { name: 'Quizzes', href: '/teacher/quizzes', icon: ClipboardList },
          { name: 'Messages', href: '/teacher/messages', icon: MessageSquare },
        ]
      case 'student':
        return [
          { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Homework', href: '/student/homework', icon: BookOpen },
          { name: 'Calendar', href: '/student/calendar', icon: Calendar },
          { name: 'Quizzes', href: '/student/quizzes', icon: ClipboardList },
          { name: 'Messages', href: '/student/messages', icon: MessageSquare },
          { name: 'Shop', href: '/student/shop', icon: ShoppingCart },
        ]
      case 'parent':
        return [
          { name: 'Dashboard', href: '/parent/dashboard', icon: LayoutDashboard },
          { name: 'My Child', href: '/parent/child', icon: GraduationCap },
          { name: 'Payments', href: '/parent/payments', icon: FileText },
        ]
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  const handleNavigation = (href: string) => {
    navigate(href)
    setSidebarOpen(false) // Close sidebar on mobile after navigation
  }

  const toggleDarkMode = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      setIsDark(false)
      localStorage.setItem('theme', 'light')
    } else {
      html.classList.add('dark')
      setIsDark(true)
      localStorage.setItem('theme', 'dark')
    }
  }

  // On mount, respect saved theme
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    } else if (saved === 'light') {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">EduCRM</h1>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Button>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">
                {navigationItems.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                Welcome back, {user?.name}
              </span>
              {/* <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle dark mode"
                onClick={toggleDarkMode}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button> */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 