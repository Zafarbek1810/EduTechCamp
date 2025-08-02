import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { useLessonsStore, type Lesson } from '@/store/lessonsStore'
import { useGroupsStore } from '@/store/groupsStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Plus, Edit, Trash2, Calendar, FileText, X, Users, FileEdit } from 'lucide-react'

export default function TeacherLessons() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { getLessonsByTeacher, addLesson, updateLesson, deleteLesson } = useLessonsStore()
  const { getGroupsByTeacher } = useGroupsStore()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [formData, setFormData] = useState({
    groupId: '',
    topic: '',
    date: '',
    homework: '',
    description: ''
  })

  const teacherGroups = getGroupsByTeacher(user?.id || '')
  const teacherLessons = getLessonsByTeacher(user?.id || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingLesson) {
      updateLesson(editingLesson.id, formData)
    } else {
      addLesson({
        ...formData,
        teacherId: user?.id || ''
      })
    }
    handleCloseModal()
  }

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setFormData({
      groupId: lesson.groupId,
      topic: lesson.topic,
      date: lesson.date,
      homework: lesson.homework,
      description: lesson.description || ''
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm(t('teacher.confirmDeleteLesson'))) {
      deleteLesson(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingLesson(null)
    setFormData({
      groupId: '',
      topic: '',
      date: '',
      homework: '',
      description: ''
    })
  }

  const openAddModal = () => {
    setEditingLesson(null)
    setFormData({
      groupId: '',
      topic: '',
      date: '',
      homework: '',
      description: ''
    })
    setIsModalOpen(true)
  }

  const getLessonsByGroup = (groupId: string) => {
    return teacherLessons.filter(lesson => lesson.groupId === groupId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('teacher.lessons')}</h1>
          <p className="text-muted-foreground">{t('teacher.createAndManageLessons')}</p>
        </div>
        <Button onClick={openAddModal} className="flex-0 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
          <Plus className="w-4 h-4 mr-2" />
          {t('teacher.createLesson')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.totalLessons')}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherLessons.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('teacher.createdLessons')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.activeGroups')}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherGroups.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('teacher.withLessons')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('teacher.thisMonth')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teacherLessons.filter(l => {
                const lessonDate = new Date(l.date)
                const now = new Date()
                return lessonDate.getMonth() === now.getMonth() && 
                       lessonDate.getFullYear() === now.getFullYear()
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('teacher.lessonsThisMonth')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lessons by Group */}
      {teacherGroups.map((group) => (
        <Card key={group.id}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>{group.name}</span>
              <Badge variant="secondary">{group.subject}</Badge>
            </CardTitle>
            <CardDescription>
              {t('teacher.lessonsFor')} {group.name} - {group.lessonDays.join(', ')} {t('teacher.at')} {group.lessonTime}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('teacher.topic')}</TableHead>
                  <TableHead>{t('teacher.date')}</TableHead>
                  <TableHead>{t('teacher.homework')}</TableHead>
                  <TableHead>{t('teacher.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getLessonsByGroup(group.id).map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.topic}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{new Date(lesson.date).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="truncate max-w-xs">
                          {lesson.homework}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(lesson)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(lesson.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {getLessonsByGroup(group.id).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      {t('teacher.noLessonsCreatedForGroupYet')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Beautiful Modal for Create/Edit Lesson */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="relative pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        {editingLesson ? t('teacher.editLesson') : t('teacher.createNewLesson')}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {editingLesson ? t('teacher.updateLessonInfo') : t('teacher.createNewLessonForGroup')}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseModal}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Lesson Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('teacher.lessonInformation')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {t('teacher.group')}
                        </label>
                        <select
                          value={formData.groupId}
                          onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          required
                        >
                          <option value="">{t('teacher.selectAGroup')}</option>
                          {teacherGroups.map((group) => (
                            <option key={group.id} value={group.id}>
                              {group.name} - {group.subject}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {t('teacher.date')}
                        </label>
                        <Input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="h-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-2">
                        <FileEdit className="w-4 h-4" />
                        {t('teacher.topic')}
                      </label>
                      <Input
                        type="text"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        placeholder={t('teacher.enterLessonTopic')}
                        className="h-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('teacher.content')}</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {t('teacher.homeworkAssignment')}
                        </label>
                        <textarea
                          value={formData.homework}
                          onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
                          placeholder={t('teacher.enterHomeworkAssignment')}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          rows={3}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          {t('teacher.descriptionOptional')}
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder={t('teacher.enterLessonDescription')}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button 
                      type="submit" 
                      className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                    >
                      {editingLesson ? t('teacher.updateLesson') : t('teacher.createLesson')}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCloseModal}
                      className="h-11 px-6"
                    >
                      {t('common.cancel')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
} 