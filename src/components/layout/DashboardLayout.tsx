import { ReactNode, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { useChatStore } from '@/store/chatStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import LanguageSelector from '@/components/ui/LanguageSelector'
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  FileText, 
  BarChart3, 
  ShoppingCart,
  BookOpen,
  CheckCircle,
  Calendar,
  ClipboardList,
  MessageSquare,
  Gamepad2,
  Bot,
  LogOut,
  X,
  Moon,
  Sun,
  Menu,
  User
} from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const { getUnreadCount, messages, groups } = useChatStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  )
  const [updateTrigger, setUpdateTrigger] = useState(0)

  // Force re-render when messages or groups change to update badge counts
  useEffect(() => {
    setUpdateTrigger(prev => prev + 1)
  }, [messages, groups])

  console.log('DashboardLayout - user:', user)
  console.log('DashboardLayout - location:', location.pathname)
  console.log('DashboardLayout - children:', children)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getNavigationItems = () => {
    if (!user) return []

    // Force recalculation of unread count
    const unreadCount = getUnreadCount(user.id)

    switch (user.role) {
      case 'admin':
        return [
          { name: t('navigation.dashboard'), href: '/admin/dashboard', icon: LayoutDashboard },
          { name: t('navigation.teachers'), href: '/admin/teachers', icon: Users },
          { name: t('navigation.students'), href: '/admin/students', icon: GraduationCap },
          { name: t('navigation.payments'), href: '/admin/payments', icon: FileText },
          { name: t('navigation.reports'), href: '/admin/reports', icon: BarChart3 },
          { name: t('navigation.products'), href: '/admin/products', icon: ShoppingCart },
        ]
      case 'teacher':
        return [
          { name: t('navigation.dashboard'), href: '/teacher/dashboard', icon: LayoutDashboard },
          { name: t('common.myGroups'), href: '/teacher/groups', icon: Users },
          { name: t('navigation.lessons'), href: '/teacher/lessons', icon: BookOpen },
          { name: t('navigation.attendance'), href: '/teacher/attendance', icon: CheckCircle },
          { name: t('common.aiTestGenerator'), href: '/teacher/ai-test-generator', icon: Bot },
          { name: t('navigation.statistics'), href: '/teacher/statistics', icon: BarChart3 },
          { name: t('navigation.calendar'), href: '/teacher/calendar', icon: Calendar },
          { name: t('navigation.quizzes'), href: '/teacher/quizzes', icon: ClipboardList },
          { 
            name: t('navigation.messages'), 
            href: '/teacher/messages', 
            icon: MessageSquare,
            badge: unreadCount
          },
        ]
      case 'student':
        return [
          { name: t('navigation.dashboard'), href: '/student/dashboard', icon: LayoutDashboard },
          { name: t('navigation.homework'), href: '/student/homework', icon: BookOpen },
          { name: t('navigation.calendar'), href: '/student/calendar', icon: Calendar },
          { name: t('navigation.quizzes'), href: '/student/quizzes', icon: ClipboardList },
          { name: t('navigation.games'), href: '/student/games', icon: Gamepad2 },
          { name: t('navigation.tests'), href: '/student/tests', icon: FileText },
          { 
            name: t('navigation.messages'), 
            href: '/student/messages', 
            icon: MessageSquare,
            badge: unreadCount
          },
          { name: t('navigation.shop'), href: '/student/shop', icon: ShoppingCart },
        ]
      case 'parent':
        return [
          { name: t('navigation.dashboard'), href: '/parent/dashboard', icon: LayoutDashboard },
          { name: t('common.myChild'), href: '/parent/child', icon: GraduationCap },
          { name: t('navigation.payments'), href: '/parent/payments', icon: FileText },
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
              const hasBadge = 'badge' in item && item.badge > 0
              
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start relative ${
                    isActive 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {hasBadge && (
                    <Badge 
                      variant="destructive" 
                      className="ml-auto h-5 w-5 rounded-full p-0 text-xs font-medium flex items-center justify-center"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
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
              {t('common.logout')}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {navigationItems.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <LanguageSelector />
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button> */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 