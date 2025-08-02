import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { useAttendanceStore, type AttendanceRecord, type StudentAttendance } from '@/store/attendanceStore'
import { useGroupsStore } from '@/store/groupsStore'
import { useStudentsStore } from '@/store/studentsStore'
import { useLessonsStore } from '@/store/lessonsStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, FileText, Award, Users, Save, AlertCircle } from 'lucide-react'

export default function TeacherAttendance() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { getGroupsByTeacher } = useGroupsStore()
  const { students, updateStudent } = useStudentsStore()
  const { getLessonsByTeacher } = useLessonsStore()
  const { 
    getAttendanceByDate, 
    addAttendanceRecord, 
    updateAttendanceRecord 
  } = useAttendanceStore()
  
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedLesson, setSelectedLesson] = useState('')
  const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const teacherGroups = getGroupsByTeacher(user?.id || '')
  const lessons = getLessonsByTeacher(user?.id || '')

  // Get students in the selected group
  const getStudentsInGroup = (groupId: string) => {
    const group = teacherGroups.find(g => g.id === groupId)
    if (!group) return []
    return students.filter(student => student.group === group.name)
  }

  const getLessonsForGroup = (groupId: string) => {
    return lessons.filter(lesson => lesson.groupId === groupId)
  }

  // Calculate points based on attendance and homework
  const calculatePoints = (isPresent: boolean, homeworkDone: boolean) => {
    let points = 0
    if (isPresent) {
      points += 10 // 10 points for attendance
    } else {
      points -= 5 // -5 points for absence
    }
    
    if (homeworkDone) {
      points += 10 // 10 points for homework
    } else {
      points -= 5 // -5 points for no homework
    }
    
    return points
  }

  // Load attendance data when group, date, or lesson changes
  useEffect(() => {
    if (selectedGroup && selectedDate) {
      loadAttendanceData()
    }
  }, [selectedGroup, selectedDate, selectedLesson])

  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId)
    setSelectedLesson('')
    setAttendanceData([])
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
  }

  const loadAttendanceData = () => {
    if (!selectedGroup || !selectedDate) return

    const existingRecord = getAttendanceByDate(selectedGroup, selectedDate)
    const groupStudents = getStudentsInGroup(selectedGroup)
    
    if (existingRecord) {
      setAttendanceData(existingRecord.records)
      setSelectedLesson(existingRecord.lessonId)
    } else {
      // Initialize with default values
      const newAttendanceData: StudentAttendance[] = groupStudents.map(student => ({
        studentId: student.id,
        studentName: student.fullName,
        isPresent: false,
        homeworkDone: false,
        points: 0,
        notes: ''
      }))
      setAttendanceData(newAttendanceData)
    }
  }

  const handleAttendanceChange = (studentId: string, field: keyof StudentAttendance, value: boolean | string | number) => {
    setAttendanceData(prev => 
      prev.map(record => {
        if (record.studentId === studentId) {
          const updatedRecord = { ...record, [field]: value }
          
          // Recalculate points when attendance or homework changes
          if (field === 'isPresent' || field === 'homeworkDone') {
            updatedRecord.points = calculatePoints(updatedRecord.isPresent, updatedRecord.homeworkDone)
          }
          
          return updatedRecord
        }
        return record
      })
    )
  }

  const handleSave = async () => {
    if (!selectedGroup || !selectedDate || !selectedLesson) {
      alert(t('teacher.pleaseSelectGroupDateAndLesson'))
      return
    }

    setIsLoading(true)
    
    try {
      const existingRecord = getAttendanceByDate(selectedGroup, selectedDate)
      
      const attendanceRecord: Omit<AttendanceRecord, 'id' | 'createdAt'> = {
        groupId: selectedGroup,
        lessonId: selectedLesson,
        date: selectedDate,
        records: attendanceData
      }

      if (existingRecord) {
        updateAttendanceRecord(existingRecord.id, attendanceRecord)
      } else {
        addAttendanceRecord(attendanceRecord)
      }

      // Update students' points in the students store
      attendanceData.forEach(record => {
        const student = students.find(s => s.id === record.studentId)
        if (student) {
          const currentPoints = student.points || 0
          const newPoints = currentPoints + record.points
          updateStudent(record.studentId, { points: newPoints })
        }
      })
      
      alert(t('teacher.attendanceSavedSuccessfully'))
      
      // Clear the form after successful save
      setSelectedGroup('')
      setSelectedDate('')
      setSelectedLesson('')
      setAttendanceData([])
    } catch {
      alert(t('teacher.errorSavingAttendance'))
    } finally {
      setIsLoading(false)
    }
  }

  const getLessonName = (lessonId: string) => {
    return lessons.find(l => l.id === lessonId)?.topic || t('teacher.unknownLesson')
  }

  const getGroupName = (groupId: string) => {
    return teacherGroups.find(g => g.id === groupId)?.name || t('teacher.unknownGroup')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('teacher.attendanceAndHomework')}</h1>
        <p className="text-muted-foreground">{t('teacher.markAttendanceHomeworkAndPoints')}</p>
      </div>

      {/* Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle>{t('teacher.selectGroupAndDate')}</CardTitle>
          <CardDescription>
            {t('teacher.chooseGroupAndDateToMarkAttendance')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                {t('teacher.group')}
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => handleGroupChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">{t('teacher.selectAGroup')}</option>
                {teacherGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} - {group.subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                {t('teacher.date')}
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                {t('teacher.lesson')}
              </label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={!selectedGroup}
              >
                <option value="">{t('teacher.selectALesson')}</option>
                {selectedGroup && getLessonsForGroup(selectedGroup).map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.topic} - {new Date(lesson.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>{t('teacher.pointsSystem')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">{t('teacher.attendancePoints')}:</h4>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{t('teacher.present')}: +10 {t('teacher.points')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>{t('teacher.absent')}: -5 {t('teacher.points')}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">{t('teacher.homeworkPoints')}:</h4>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-green-500" />
                <span>{t('teacher.completed')}: +10 {t('teacher.points')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>{t('teacher.notDone')}: -5 {t('teacher.points')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      {selectedGroup && selectedDate && attendanceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{t('teacher.attendanceFor')} {getGroupName(selectedGroup)} - {new Date(selectedDate).toLocaleDateString()}</span>
              {selectedLesson && (
                <Badge variant="secondary">
                  {getLessonName(selectedLesson)}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {t('teacher.markAttendanceAndHomeworkDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('teacher.student')}</TableHead>
                  <TableHead>{t('teacher.attendance')}</TableHead>
                  <TableHead>{t('teacher.homework')}</TableHead>
                  <TableHead>{t('teacher.points')}</TableHead>
                  <TableHead>{t('teacher.notes')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record.studentId}>
                    <TableCell className="font-medium">
                      {record.studentName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={record.isPresent ? "default" : "outline"}
                          onClick={() => handleAttendanceChange(record.studentId, 'isPresent', !record.isPresent)}
                          className={record.isPresent ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                        >
                          {record.isPresent ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {t('teacher.present')} (+10)
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              {t('teacher.absent')} (-5)
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={record.homeworkDone ? "default" : "outline"}
                          onClick={() => handleAttendanceChange(record.studentId, 'homeworkDone', !record.homeworkDone)}
                          disabled={!record.isPresent}
                          className={record.homeworkDone ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          {record.homeworkDone ? `${t('teacher.done')} (+10)` : `${t('teacher.notDone')} (-5)`}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={record.points >= 0 ? "default" : "destructive"}
                          className="text-sm font-medium"
                        >
                          {record.points > 0 ? '+' : ''}{record.points} {t('teacher.points')}
                        </Badge>
                        <Award className="w-4 h-4 text-gray-500" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={record.notes || ''}
                        onChange={(e) => handleAttendanceChange(record.studentId, 'notes', e.target.value)}
                        placeholder={t('teacher.optionalNotes')}
                        className="w-full"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end mt-4">
              <Button 
                onClick={handleSave} 
                disabled={isLoading || !selectedLesson}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? t('teacher.saving') : t('teacher.saveAttendanceAndUpdatePoints')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {(!selectedGroup || !selectedDate) && (
        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.instructions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1. {t('teacher.selectGroupFromDropdown')}</p>
              <p>2. {t('teacher.chooseDateForAttendance')}</p>
              <p>3. {t('teacher.selectLessonForSession')}</p>
              <p>4. {t('teacher.markAttendanceAndHomeworkForStudents')}</p>
              <p>5. {t('teacher.pointsAutomaticallyCalculated')}</p>
              <p>6. {t('teacher.addOptionalNotesForStudents')}</p>
              <p>7. {t('teacher.clickSaveToUpdatePoints')}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Students Message */}
      {selectedGroup && selectedDate && attendanceData.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('teacher.noStudentsFound')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('teacher.noStudentsAssignedToSelectedGroup')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 