import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { 
  Calendar as CalendarIcon
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCalendarStore } from '@/store/calendarStore'
import type { CalendarEvent } from '@/store/calendarStore'
import type { View } from 'react-big-calendar'
import { useStudentsStore } from '@/store/studentsStore'
import { formatDistanceToNow } from 'date-fns'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function StudentCalendar() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { getEventsByGroup } = useCalendarStore()
  const { getStudent } = useStudentsStore()
  const [currentView, setCurrentView] = useState<View>('month')

  // Get the current student's information
  const currentStudent = getStudent(user?.id || '')
  
  // Get events for the student's group
  const userEvents = currentStudent ? getEventsByGroup(currentStudent.group) : []

  const eventStyleGetter = (event: CalendarEvent) => {
    let color = '#3B82F6' // default blue
    
    switch (event.type) {
      case 'lesson':
        color = '#3B82F6' // blue
        break
      case 'homework':
        color = '#EF4444' // red
        break
      case 'quiz':
        color = '#10B981' // green
        break
      case 'exam':
        color = '#F59E0B' // yellow
        break
    }

    return {
      style: {
        backgroundColor: color,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  const upcomingEvents = userEvents
    .filter(event => event.start > new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5)

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return '📚'
      case 'homework':
        return '📝'
      case 'quiz':
        return '📋'
      case 'exam':
        return '📊'
      default:
        return '📅'
    }
  }

  const handleViewChange = (view: View) => {
    setCurrentView(view)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">{t('student.myCalendar')}</h1>
            <p className="text-blue-700 dark:text-blue-300">
              {t('student.viewUpcomingEventsAndSchedule')}
              {currentStudent && (
                <span className="ml-2 text-sm font-medium bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded-md">
                  {t('student.group')}: {currentStudent.group}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('student.totalEvents')}</CardTitle>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-lg">📅</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{userEvents.length}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {t('student.allEvents')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">{t('student.upcoming')}</CardTitle>
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-lg">⏰</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{upcomingEvents.length}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
              {t('student.next5Events')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">{t('student.lessons')}</CardTitle>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-lg">📚</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {userEvents.filter(event => event.type === 'lesson').length}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              {t('student.scheduledLessons')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">{t('student.assignments')}</CardTitle>
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-lg">📝</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {userEvents.filter(event => event.type === 'homework').length}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
              {t('student.dueAssignments')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-lg">⏰</span>
              </div>
              <CardTitle className="text-purple-700 dark:text-purple-300">{t('student.upcomingEvents')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="flex items-center justify-between p-6 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  style={{
                    borderLeft: `4px solid ${
                      event.type === 'lesson' ? '#3B82F6' : 
                      event.type === 'homework' ? '#EF4444' : 
                      event.type === 'quiz' ? '#10B981' : '#F59E0B'
                    }`
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-xl">{getEventTypeIcon(event.type)}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">{event.title}</h4>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                        {formatDistanceToNow(event.start, { addSuffix: true })}
                      </p>
                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={`font-medium px-3 py-1 ${
                      event.type === 'lesson' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      event.type === 'homework' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                      event.type === 'quiz' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}
                  >
                    {t(`student.${event.type}`)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-indigo-700 dark:text-indigo-300">{t('student.calendarView')}</CardTitle>
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-inner">
              <Button
                variant={currentView === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewChange('month')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === 'month' 
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="font-medium">{t('student.month')}</span>
              </Button>
              <Button
                variant={currentView === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewChange('week')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === 'week' 
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="font-medium">{t('student.week')}</span>
              </Button>
              <Button
                variant={currentView === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewChange('day')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === 'day' 
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="font-medium">{t('student.day')}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px] p-6 bg-white dark:bg-gray-800 rounded-b-xl">
            <Calendar
              localizer={localizer}
              events={userEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day']}
              view={currentView}
              onView={handleViewChange}
              step={60}
              timeslots={1}
              className="dark:bg-gray-800 dark:text-white rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* No Events Message */}
      {userEvents.length === 0 && (
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-lg">📭</span>
              </div>
              <CardTitle className="text-gray-700 dark:text-gray-300">{t('student.noEventsFound')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                {currentStudent 
                  ? t('student.noEventsScheduledForGroup', { group: currentStudent.group })
                  : t('student.noEventsFoundContactAdmin')
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 