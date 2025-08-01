import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useGroupsStore, type Group } from '@/store/groupsStore'
import { useStudentsStore } from '@/store/studentsStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Users, Clock, Eye, Plus, Edit, Trash2, X, BookOpen, Calendar, User, UserPlus, Search, ChevronDown } from 'lucide-react'

export default function TeacherGroups() {
  const { user } = useAuthStore()
  const { getGroupsByTeacher, addGroup, updateGroup, deleteGroup } = useGroupsStore()
  const { updateStudent, students } = useStudentsStore()
  
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [showStudentsModal, setShowStudentsModal] = useState(false)
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    lessonDays: [] as string[],
    lessonTime: '',
    studentCount: 0
  })
  
  const teacherGroups = getGroupsByTeacher(user?.id || '')
  // const teacherStudents = getStudentsByTeacher(user?.id || '')

  const handleViewStudents = (group: Group) => {
    setSelectedGroup(group)
    setShowStudentsModal(true)
  }

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('Are you sure you want to delete this group?')) {
      deleteGroup(groupId)
    }
  }

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group)
    setFormData({
      name: group.name,
      subject: group.subject,
      lessonDays: group.lessonDays,
      lessonTime: group.lessonTime,
      studentCount: group.studentCount
    })
    setIsGroupModalOpen(true)
  }

  const handleAddGroup = () => {
    setEditingGroup(null)
    setFormData({
      name: '',
      subject: '',
      lessonDays: [],
      lessonTime: '',
      studentCount: 0
    })
    setIsGroupModalOpen(true)
  }

  const handleCloseGroupModal = () => {
    setIsGroupModalOpen(false)
    setEditingGroup(null)
    setFormData({
      name: '',
      subject: '',
      lessonDays: [],
      lessonTime: '',
      studentCount: 0
    })
  }

  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingGroup) {
      updateGroup(editingGroup.id, formData)
    } else {
      addGroup({
        ...formData,
        teacherId: user?.id || ''
      })
    }
    handleCloseGroupModal()
  }

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      lessonDays: prev.lessonDays.includes(day)
        ? prev.lessonDays.filter(d => d !== day)
        : [...prev.lessonDays, day]
    }))
  }

  const handleAssignStudents = (group: Group) => {
    setSelectedGroup(group)
    setSelectedStudents(getStudentsInGroup(group.id).map(s => s.id))
    setSearchTerm('')
    setIsAssignModalOpen(true)
  }

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false)
    setSelectedGroup(null)
    setSelectedStudents([])
    setSearchTerm('')
  }

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handleAssignSubmit = () => {
    if (!selectedGroup) return

    // Update all students to remove them from the current group
    students.forEach(student => {
      if (student.group === selectedGroup.name) {
        updateStudent(student.id, { group: '' })
      }
    })

    // Assign selected students to the group
    selectedStudents.forEach(studentId => {
      const student = students.find(s => s.id === studentId)
      if (student) {
        updateStudent(studentId, { group: selectedGroup.name })
      }
    })

    // Update group student count
    updateGroup(selectedGroup.id, { studentCount: selectedStudents.length })

    handleCloseAssignModal()
  }

  const getStudentsInGroup = (groupId: string) => {
    const group = teacherGroups.find(g => g.id === groupId)
    if (!group) return []
    return students.filter(student => student.group === group.name)
  }

  const getAvailableStudents = () => {
    // Show all students in the system (like admin section)
    return students.filter(student =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Groups</h1>
          <p className="text-muted-foreground">Manage your assigned groups and students</p>
        </div>
        <Button className="flex-0 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium" onClick={handleAddGroup}>
          <Plus className="w-4 h-4 mr-2" />
          Add Group
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherGroups.length}</div>
            <p className="text-xs text-muted-foreground">
              Active groups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teacherGroups.reduce((sum, group) => sum + group.studentCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all groups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(teacherGroups.map(g => g.subject)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Different subjects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Groups Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Groups</CardTitle>
          <CardDescription>
            Overview of all groups assigned to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Lesson Days</TableHead>
                <TableHead>Lesson Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teacherGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{group.subject}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{group.studentCount} students</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {group.lessonDays.map((day, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{group.lessonTime}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewStudents(group)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Students
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAssignStudents(group)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Assign Students
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditGroup(group)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteGroup(group.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Beautiful Modal for Add/Edit Group */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseGroupModal}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="relative pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        {editingGroup ? 'Edit Group' : 'Add New Group'}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {editingGroup ? 'Update group information' : 'Create a new group'}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseGroupModal}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleGroupSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Group Name
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter group name"
                          className="h-10"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Subject
                        </label>
                        <Input
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="Enter subject"
                          className="h-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Lesson Time
                        </label>
                        <Input
                          type="time"
                          value={formData.lessonTime}
                          onChange={(e) => setFormData({ ...formData, lessonTime: e.target.value })}
                          className="h-10"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Student Count
                        </label>
                        <Input
                          type="number"
                          // value={formData.studentCount}
                          onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                          placeholder="Enter student count"
                          className="h-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Lesson Days
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {daysOfWeek.map((day) => (
                          <label key={day} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.lessonDays.includes(day)}
                              onChange={() => handleDayToggle(day)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-muted-foreground">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button 
                      type="submit" 
                      className="flex-1 h-11 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium"
                    >
                      {editingGroup ? 'Update Group' : 'Add Group'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCloseGroupModal}
                      className="h-11 px-6"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Beautiful Modal for Assign Students */}
      {isAssignModalOpen && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseAssignModal}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-4xl transform transition-all duration-300 scale-100 opacity-100">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm max-h-[80vh] overflow-y-auto">
              <CardHeader className="relative pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        Assign Students to {selectedGroup.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Select students from all available students to assign to this group
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseAssignModal}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>

                {/* Student Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      All Students ({getAvailableStudents().length})
                    </h3>
                    <Badge variant="secondary">
                      {selectedStudents.length} selected
                    </Badge>
                  </div>
                  
                  {/* Multi-select dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Available Students
                    </label>
                    <div className="relative">
                      <select
                        multiple
                        value={selectedStudents}
                        onChange={(e) => {
                          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                          setSelectedStudents(selectedOptions)
                        }}
                        className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none"
                      >
                        {getAvailableStudents().map((student) => (
                          <option key={student.id} value={student.id} className="py-2">
                            {student.fullName} - {student.email} {student.group ? `(Currently in: ${student.group})` : '(Unassigned)'}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Hold Ctrl (or Cmd on Mac) to select multiple students
                    </p>
                  </div>
                  
                  {/* Selected Students Preview */}
                  {selectedStudents.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Selected Students:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {selectedStudents.map((studentId) => {
                          const student = students.find(s => s.id === studentId)
                          return student ? (
                            <div key={studentId} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-md">
                              <div>
                                <p className="text-sm font-medium text-foreground">{student.fullName}</p>
                                <p className="text-xs text-gray-500">{student.email}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStudentToggle(studentId)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                  
                  {getAvailableStudents().length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No students available for assignment.
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button 
                    onClick={handleAssignSubmit}
                    className="flex-1 h-11 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium"
                    disabled={selectedStudents.length === 0}
                  >
                    Assign {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCloseAssignModal}
                    className="h-11 px-6"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Students Modal */}
      {showStudentsModal && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowStudentsModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-4xl transform transition-all duration-300 scale-100 opacity-100">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm max-h-[80vh] overflow-y-auto">
              <CardHeader className="relative pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        Students in {selectedGroup.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        View all students assigned to this group
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStudentsModal(false)}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getStudentsInGroup(selectedGroup.id).map((student) => (
                    <Card key={student.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{student.fullName}</CardTitle>
                        <CardDescription>{student.email}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Phone:</span>
                            <span className="text-sm">{student.phoneNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Group:</span>
                            <Badge variant="secondary">{selectedGroup.name}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {getStudentsInGroup(selectedGroup.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No students assigned to this group yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
} 