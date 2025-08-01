import { useState } from 'react'
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
import { CheckCircle, XCircle, FileText, Award, Users, Save } from 'lucide-react'

export default function TeacherAttendance() {
  const { user } = useAuthStore()
  const { getGroupsByTeacher } = useGroupsStore()
  const { getStudentsByTeacher } = useStudentsStore()
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
  const students = getStudentsByTeacher(user?.id || '')
  const lessons = getLessonsByTeacher(user?.id || '')

  const getStudentsInGroup = (groupId: string) => {
    return students.filter(student => student.group === groupId)
  }

  const getLessonsForGroup = (groupId: string) => {
    return lessons.filter(lesson => lesson.groupId === groupId)
  }

  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId)
    setSelectedLesson('')
    setAttendanceData([])
    
    if (groupId && selectedDate) {
      loadAttendanceData(groupId, selectedDate)
    }
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    
    if (selectedGroup && date) {
      loadAttendanceData(selectedGroup, date)
    }
  }

  const loadAttendanceData = (groupId: string, date: string) => {
    const existingRecord = getAttendanceByDate(groupId, date)
    const groupStudents = getStudentsInGroup(groupId)
    
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

  const handleAttendanceChange = (studentId: string, field: keyof StudentAttendance, value: any) => {
    setAttendanceData(prev => 
      prev.map(record => 
        record.studentId === studentId 
          ? { ...record, [field]: value }
          : record
      )
    )
  }

  const handleSave = async () => {
    if (!selectedGroup || !selectedDate || !selectedLesson) {
      alert('Please select group, date, and lesson')
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
      
      alert('Attendance saved successfully!')
    } catch (error) {
      alert('Error saving attendance')
    } finally {
      setIsLoading(false)
    }
  }

  const getLessonName = (lessonId: string) => {
    return lessons.find(l => l.id === lessonId)?.topic || 'Unknown Lesson'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance & Homework</h1>
        <p className="text-muted-foreground">Mark attendance, homework completion, and assign points</p>
      </div>

      {/* Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Select Group and Date</CardTitle>
          <CardDescription>
            Choose a group and date to mark attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                Group
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => handleGroupChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a group</option>
                {teacherGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} - {group.subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                Lesson
              </label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={!selectedGroup}
              >
                <option value="">Select a lesson</option>
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

      {/* Attendance Table */}
      {selectedGroup && selectedDate && attendanceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Attendance for {new Date(selectedDate).toLocaleDateString()}</span>
              {selectedLesson && (
                <Badge variant="secondary">
                  {getLessonName(selectedLesson)}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Mark attendance, homework completion, and assign points (0-10)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Homework</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Notes</TableHead>
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
                        >
                          {record.isPresent ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Present
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Absent
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
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          {record.homeworkDone ? 'Done' : 'Not Done'}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={record.points}
                          onChange={(e) => handleAttendanceChange(record.studentId, 'points', parseInt(e.target.value) || 0)}
                          className="w-20"
                          disabled={!record.isPresent}
                        />
                        <Award className="w-4 h-4 text-gray-500" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={record.notes || ''}
                        onChange={(e) => handleAttendanceChange(record.studentId, 'notes', e.target.value)}
                        placeholder="Optional notes"
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
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Save Attendance'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {(!selectedGroup || !selectedDate) && (
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1. Select a group from the dropdown above</p>
              <p>2. Choose a date for the attendance record</p>
              <p>3. Select the lesson for this session</p>
              <p>4. Mark attendance, homework completion, and assign points (0-10)</p>
              <p>5. Add optional notes for each student</p>
              <p>6. Click "Save Attendance" to save the data</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 