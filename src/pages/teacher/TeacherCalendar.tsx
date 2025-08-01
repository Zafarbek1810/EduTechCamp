import { useState } from 'react'
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
import { Plus, Trash2 } from 'lucide-react'
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
  const { user } = useAuthStore()
  const { addEvent, updateEvent, deleteEvent, getEventsByUser } = useCalendarStore()
  const { getGroupsByTeacher } = useGroupsStore()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  
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
      alert('Please select a group for this event')
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground dark:text-white">Calendar</h1>
          <p className="text-muted-foreground dark:text-gray-400">Manage your lessons, homework, and schedules</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex-0 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium" onClick={() => {
              setIsEditMode(false)
              resetForm()
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Event title"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lesson">Lesson</SelectItem>
                    <SelectItem value="homework">Homework</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="groupId">Group</Label>
                <Select
                  value={formData.groupId}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, groupId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Event description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start">Start</Label>
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
                  <Label htmlFor="end">End</Label>
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
                  {isEditMode ? 'Update' : 'Create'}
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
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userEvents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {userEvents.filter(e => e.type === 'lesson').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Homework</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {userEvents.filter(e => e.type === 'homework').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
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
              defaultView="month"
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