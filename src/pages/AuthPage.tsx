import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { Eye, EyeOff, Lock, User, GraduationCap, Users, ShoppingCart, Heart } from 'lucide-react'

export default function AuthPage() {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const login = useAuthStore((state: any) => state.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      console.log('Attempting login with:', username, password)
      const success = await login(username, password)
      console.log('Login result:', success)
      
      if (success) {
        console.log('Login successful!')
        // Redirect based on role
        const user = useAuthStore.getState().user
        if (user) {
          console.log('Redirecting to:', `/${user.role}/dashboard`)
          navigate(`/${user.role}/dashboard`)
        }
      } else {
        setError(t('auth.invalidCredentials'))
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(t('auth.loginError'))
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    {
      role: t('common.admin'),
      username: 'admin',
      password: 'password',
      icon: Users,
      description: t('auth.adminDescription'),
      color: 'bg-blue-500'
    },
    {
      role: t('common.teacher'),
      username: 'teacher1',
      password: 'password',
      icon: GraduationCap,
      description: t('auth.teacherDescription'),
      color: 'bg-green-500'
    },
    {
      role: t('common.student'),
      username: 'student1',
      password: 'password',
      icon: ShoppingCart,
      description: t('auth.studentDescription'),
      color: 'bg-purple-500'
    },
    {
      role: t('common.parent'),
      username: 'parent1',
      password: 'password',
      icon: Heart,
      description: t('auth.parentDescription'),
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduCRM
              </h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                {t('auth.welcomeToFuture')}
                <span className="block text-blue-600">{t('auth.educationManagement')}</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('auth.streamlineDescription')}
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('auth.studentManagement')}</h3>
                <p className="text-sm text-gray-600">{t('auth.studentManagementDesc')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('auth.teacherDashboard')}</h3>
                <p className="text-sm text-gray-600">{t('auth.teacherDashboardDesc')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('auth.studentShop')}</h3>
                <p className="text-sm text-gray-600">{t('auth.studentShopDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">{t('auth.welcomeBack')}</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {t('auth.signInToAccount')}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-foreground dark:text-white">
                    {t('auth.username')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                      placeholder={t('auth.enterUsername')}
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground dark:text-white">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      placeholder={t('auth.enterPassword')}
                      className="pl-10 pr-10 h-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('auth.signingIn')}</span>
                    </div>
                  ) : (
                    t('auth.signIn')
                  )}
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4 text-center">{t('auth.demoAccounts')}</h4>
                <div className="space-y-3">
                  {demoAccounts.map((account) => (
                    <div
                      key={account.role}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => {
                        setUsername(account.username)
                        setPassword(account.password)
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${account.color} rounded-lg flex items-center justify-center`}>
                          <account.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{account.role}</span>
                            <span className="text-xs text-gray-500">{t('auth.clickToFill')}</span>
                          </div>
                          <p className="text-xs text-gray-600">{account.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 