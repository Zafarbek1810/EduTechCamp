import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale/en-US'
import { useAuthStore } from '@/store/authStore'
import { useCalendarStore, type CalendarEvent } from '@/store/calendarStore'
import { useGroupsStore } from '@/store/groupsStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react'
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

export default function TeacherCalendar() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { addEvent, updateEvent, deleteEvent, getEventsByUser } = useCalendarStore()
  const { getGroupsByTeacher } = useGroupsStore()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lesson' as 'lesson' | 'homework' | 'quiz' | 'exam',
    start: new Date(),
    end: new Date(),
    groupId: ''
  })

  const userEvents = getEventsByUser(user?.id || '', user?.role || '')
  const teacherGroups = getGroupsByTeacher(user?.id || '')

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color || '#3B82F6',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  const handleSelect = ({ start, end }: { start: Date; end: Date }) => {
    setFormData(prev => ({
      ...prev,
      start,
      end: end || new Date(start.getTime() + 60 * 60 * 1000) // 1 hour default
    }))
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      type: event.type,
      start: event.start,
      end: event.end,
      groupId: event.groupId || ''
    })
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.groupId) {
      alert(t('teacher.pleaseSelectGroupForEvent'))
      return
    }

    if (isEditMode && selectedEvent) {
      updateEvent(selectedEvent.id, {
        ...formData,
        teacherId: user?.id
      })
    } else {
      addEvent({
        ...formData,
        teacherId: user?.id
      })
    }
    
    resetForm()
    setIsDialogOpen(false)
  }

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id)
      resetForm()
      setIsDialogOpen(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'lesson',
      start: new Date(),
      end: new Date(),
      groupId: ''
    })
    setSelectedEvent(null)
    setIsEditMode(false)
  }

  const handleViewChange = (view: 'month' | 'week' | 'day') => {
    setCurrentView(view)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground dark:text-white">{t('teacher.calendar')}</h1>
          <p className="text-muted-foreground dark:text-gray-400">{t('teacher.manageLessonsHomeworkAndSchedules')}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex-0 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium" onClick={() => {
              setIsEditMode(false)
              resetForm()
            }}>
              <Plus className="w-4 h-4 mr-2" />
              {t('teacher.addEvent')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? t('teacher.editEvent') : t('teacher.addNewEvent')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t('teacher.title')}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t('teacher.eventTitle')}
                />
              </div>
              
              <div>
                <Label htmlFor="type">{t('teacher.type')}</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lesson">{t('teacher.lesson')}</SelectItem>
                    <SelectItem value="homework">{t('teacher.homework')}</SelectItem>
                    <SelectItem value="quiz">{t('teacher.quiz')}</SelectItem>
                    <SelectItem value="exam">{t('teacher.exam')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="groupId">{t('teacher.group')}</Label>
                <Select
                  value={formData.groupId}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, groupId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('teacher.selectAGroup')} />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherGroups.map((group) => (
                      <SelectItem key={group.id} value={group.name}>
                        {group.name} - {group.subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">{t('teacher.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('teacher.eventDescription')}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start">{t('teacher.start')}</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={format(formData.start, "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      start: new Date(e.target.value) 
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end">{t('teacher.end')}</Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    value={format(formData.end, "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      end: new Date(e.target.value) 
                    }))}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmit} className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
                  {isEditMode ? t('teacher.update') : t('teacher.create')}
                </Button>
                {isEditMode && (
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.totalEvents')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userEvents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.lessons')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {userEvents.filter(e => e.type === 'lesson').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.homework')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {userEvents.filter(e => e.type === 'homework').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.quizzes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {userEvents.filter(e => e.type === 'quiz').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('teacher.calendarView')}</CardTitle>
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
                <span className="font-medium">{t('teacher.month')}</span>
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
                <span className="font-medium">{t('teacher.week')}</span>
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
                <span className="font-medium">{t('teacher.day')}</span>
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
              selectable
              onSelectSlot={handleSelect}
              onSelectEvent={handleEventSelect}
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
    </div>
  )
} 