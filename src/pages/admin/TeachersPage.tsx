import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTeachersStore, type Teacher } from '@/store/teachersStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash2, Plus, Search, X, User, Phone, Mail, BookOpen, DollarSign, Users, TrendingUp } from 'lucide-react'

export default function TeachersPage() {
  const { t } = useTranslation()
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useTeachersStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    subject: '',
    salary: 0,
    studentsCount: 0,
    totalFeesContributed: 0,
    kpi: 0
  })

  const filteredTeachers = teachers.filter(teacher =>
    teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData)
    } else {
      addTeacher(formData)
    }
    handleCloseModal()
  }

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      fullName: teacher.fullName,
      phoneNumber: teacher.phoneNumber,
      email: teacher.email,
      subject: teacher.subject,
      salary: teacher.salary,
      studentsCount: teacher.studentsCount,
      totalFeesContributed: teacher.totalFeesContributed,
      kpi: teacher.kpi
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm(t('admin.confirmDeleteTeacher'))) {
      deleteTeacher(id)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTeacher(null)
    setFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      subject: '',
      salary: 0,
      studentsCount: 0,
      totalFeesContributed: 0,
      kpi: 0
    })
  }

  const openAddModal = () => {
    setEditingTeacher(null)
    setFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      subject: '',
      salary: 0,
      studentsCount: 0,
      totalFeesContributed: 0,
      kpi: 0
    })
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.teachersManagement')}</h1>
          <p className="text-muted-foreground">{t('admin.teachersManagementDesc')}</p>
        </div>
        <Button onClick={openAddModal} className="flex-0 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
          <Plus className="h-4 w-4" />
          {t('admin.addTeacher')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('admin.searchTeachers')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.fullName')}</TableHead>
                <TableHead>{t('admin.phoneNumber')}</TableHead>
                <TableHead>{t('admin.email')}</TableHead>
                <TableHead>{t('admin.subject')}</TableHead>
                <TableHead>{t('admin.students')}</TableHead>
                <TableHead>{t('admin.salary')}</TableHead>
                <TableHead>{t('admin.kpi')}</TableHead>
                <TableHead className="text-right">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.fullName}</TableCell>
                  <TableCell>{teacher.phoneNumber}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.studentsCount}</TableCell>
                  <TableCell>${teacher.salary}</TableCell>
                  <TableCell>{teacher.kpi}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(teacher)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(teacher.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Beautiful Modal for Add/Edit Teacher */}
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
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {editingTeacher ? t('admin.editTeacher') : t('admin.addNewTeacher')}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {editingTeacher ? t('admin.updateTeacherInfo') : t('admin.addNewTeacherDesc')}
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
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{t('admin.personalInformation')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {t('admin.fullName')}
                        </label>
                        <Input
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder={t('admin.enterFullName')}
                          className="h-10"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {t('admin.phoneNumber')}
                        </label>
                        <Input
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          placeholder={t('admin.enterPhoneNumber')}
                          className="h-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {t('admin.emailAddress')}
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t('admin.enterEmailAddress')}
                        className="h-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{t('admin.professionalInformation')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          {t('admin.subject')}
                        </label>
                        <Input
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder={t('admin.enterSubject')}
                          className="h-10"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          {t('admin.salary')}
                        </label>
                        <Input
                          type="number"
                          // value={formData.salary}
                          onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                          placeholder={t('admin.enterSalary')}
                          className="h-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {t('admin.studentsCount')}
                        </label>
                        <Input
                          type="number"
                          // value={formData.studentsCount}
                          onChange={(e) => setFormData({ ...formData, studentsCount: Number(e.target.value) })}
                          placeholder={t('admin.enterStudentsCount')}
                          className="h-10"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          {t('admin.kpi')} (%)
                        </label>
                        <Input
                          type="number"
                          // value={formData.kpi}
                          onChange={(e) => setFormData({ ...formData, kpi: Number(e.target.value) })}
                          placeholder={t('admin.enterKpiPercentage')}
                          className="h-10"
                          required
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
                      {editingTeacher ? t('admin.updateTeacher') : t('admin.addTeacher')}
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