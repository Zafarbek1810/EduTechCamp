import { useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale/en-US'
import { useAuthStore } from '@/store/authStore'
import { useCalendarStore, type CalendarEvent } from '@/store/calendarStore'
import { useStudentsStore } from '@/store/studentsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
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
  const { user } = useAuthStore()
  const { getEventsByGroup } = useCalendarStore()
  const { getStudent } = useStudentsStore()
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month')

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

  const handleViewChange = (view: 'month' | 'week' | 'day') => {
    setCurrentView(view)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Calendar</h1>
        <p className="text-muted-foreground">
          View your upcoming events and schedule
          {currentStudent && (
            <span className="ml-2 text-sm">
              (Group: {currentStudent.group})
            </span>
          )}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <span className="text-2xl">📅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              All events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <span className="text-2xl">⏰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Next 5 events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons</CardTitle>
            <span className="text-2xl">📚</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userEvents.filter(event => event.type === 'lesson').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Scheduled lessons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <span className="text-2xl">📝</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userEvents.filter(event => event.type === 'homework').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Due assignments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getEventTypeIcon(event.type)}</div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(event.start, { addSuffix: true })}
                      </p>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Calendar View</CardTitle>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={currentView === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewChange('month')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'month' 
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="font-medium">Month</span>
              </Button>
              <Button
                variant={currentView === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewChange('week')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'week' 
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="font-medium">Week</span>
              </Button>
              <Button
                variant={currentView === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewChange('day')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  currentView === 'day' 
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="font-medium">Day</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px] p-4">
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
              className="dark:bg-gray-800 dark:text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* No Events Message */}
      {userEvents.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Events Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {currentStudent 
                ? `No events have been scheduled for your group (${currentStudent.group}) yet.`
                : 'No events found. Please contact your administrator if you believe this is an error.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 