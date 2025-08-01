import { useState, useEffect } from 'react'
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

      // Update students' points in the students store
      attendanceData.forEach(record => {
        const student = students.find(s => s.id === record.studentId)
        if (student) {
          const currentPoints = student.points || 0
          const newPoints = currentPoints + record.points
          updateStudent(record.studentId, { points: newPoints })
        }
      })
      
      alert('Attendance saved successfully! Points have been updated for all students.')
      
      // Clear the form after successful save
      setSelectedGroup('')
      setSelectedDate('')
      setSelectedLesson('')
      setAttendanceData([])
    } catch {
      alert('Error saving attendance')
    } finally {
      setIsLoading(false)
    }
  }

  const getLessonName = (lessonId: string) => {
    return lessons.find(l => l.id === lessonId)?.topic || 'Unknown Lesson'
  }

  const getGroupName = (groupId: string) => {
    return teacherGroups.find(g => g.id === groupId)?.name || 'Unknown Group'
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

      {/* Points System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Points System</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Attendance Points:</h4>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Present: +10 points</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>Absent: -5 points</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Homework Points:</h4>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-green-500" />
                <span>Completed: +10 points</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>Not Done: -5 points</span>
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
              <span>Attendance for {getGroupName(selectedGroup)} - {new Date(selectedDate).toLocaleDateString()}</span>
              {selectedLesson && (
                <Badge variant="secondary">
                  {getLessonName(selectedLesson)}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Mark attendance and homework completion. Points are automatically calculated.
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
                          className={record.isPresent ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                        >
                          {record.isPresent ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Present (+10)
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Absent (-5)
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
                          {record.homeworkDone ? 'Done (+10)' : 'Not Done (-5)'}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={record.points >= 0 ? "default" : "destructive"}
                          className="text-sm font-medium"
                        >
                          {record.points > 0 ? '+' : ''}{record.points} points
                        </Badge>
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
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Save Attendance & Update Points'}</span>
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
              <p>4. Mark attendance and homework completion for each student</p>
              <p>5. Points are automatically calculated based on attendance and homework</p>
              <p>6. Add optional notes for each student</p>
              <p>7. Click "Save Attendance & Update Points" to save the data and update student points</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Students Message */}
      {selectedGroup && selectedDate && attendanceData.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Students Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No students are currently assigned to the selected group. Please assign students to the group first.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 