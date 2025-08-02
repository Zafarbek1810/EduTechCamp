import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Send, 
  Users, 
  User, 
  Edit, 
  Trash2, 
  Plus
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useChatStore } from '@/store/chatStore'
import { formatDistanceToNow } from 'date-fns'

export default function StudentMessages() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { messages, addMessage, getMessagesByGroup, getMessagesByParticipants, getGroupsByUser, markGroupAsRead, setTyping, getTypingUsers, deleteMessage, editMessage } = useChatStore()
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isNewChat, setIsNewChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const userGroups = getGroupsByUser(user?.id || '')

  // Demo teachers for display - using correct user IDs
  const demoTeachers = [
    { id: '2', name: 'John Teacher', group: 'Math Group A' }, // teacher1 (id: 2)
    { id: '5', name: 'Jane Teacher', group: 'English Group B' }, // teacher2 (id: 5)
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedGroup, selectedTeacher, messages])

  useEffect(() => {
    if (selectedGroup && user) {
      markGroupAsRead(selectedGroup.id, user.id)
    }
  }, [selectedGroup, user])

  // Mark all messages as read when visiting the messages page
  useEffect(() => {
    if (user) {
      const userGroups = getGroupsByUser(user.id)
      userGroups.forEach(group => {
        markGroupAsRead(group.id, user.id)
      })
    }
  }, [user])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return

    if (selectedGroup) {
      addMessage({
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        content: newMessage.trim(),
        groupId: selectedGroup.id
      })
    } else if (selectedTeacher) {
      addMessage({
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        content: newMessage.trim(),
        recipientId: selectedTeacher
      })
    }

    setNewMessage('')
    setIsTyping(false)
    if (selectedGroup) {
      setTyping(selectedGroup.id, user.id, false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    
    if (!isTyping && selectedGroup && user) {
      setIsTyping(true)
      setTyping(selectedGroup.id, user.id, true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (selectedGroup && user) {
        setIsTyping(false)
        setTyping(selectedGroup.id, user.id, false)
      }
    }, 2000)
  }

  const getCurrentMessages = () => {
    if (selectedGroup) {
      return getMessagesByGroup(selectedGroup.id)
    } else if (selectedTeacher) {
      return getMessagesByParticipants(user?.id || '', selectedTeacher)
    }
    return []
  }

  const getGroupName = (group: any) => {
    if (group.type === 'individual') {
      const otherParticipant = group.participants.find((p: string) => p !== user?.id)
      const teacher = demoTeachers.find(t => t.id === otherParticipant)
      return teacher ? teacher.name : 'Individual Chat'
    }
    return group.name
  }

  const getTypingIndicator = () => {
    if (!selectedGroup) return null
    
    const typingUsers = getTypingUsers(selectedGroup.id)
    const typingUserNames = typingUsers
      .filter(id => id !== user?.id)
      .map(id => {
        const teacher = demoTeachers.find(t => t.id === id)
        return teacher ? teacher.name : 'Someone'
      })
    
    if (typingUserNames.length > 0) {
      return (
        <div className="flex items-center space-x-2 text-sm text-gray-500 italic">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>{typingUserNames.join(', ')} {t('student.isTyping')}</span>
        </div>
      )
    }
    return null
  }

  const handleEditMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setEditingMessage(messageId)
      setEditContent(message.content)
    }
  }

  const handleSaveEdit = () => {
    if (editingMessage && editContent.trim()) {
      editMessage(editingMessage, editContent.trim())
      setEditingMessage(null)
      setEditContent('')
    }
  }

  const handleCancelEdit = () => {
    setEditingMessage(null)
    setEditContent('')
  }

  const startNewChat = (teacherId: string) => {
    setSelectedTeacher(teacherId)
    setSelectedGroup(null)
    setIsNewChat(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">💬</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">{t('student.messages')}</h1>
              <p className="text-purple-700 dark:text-purple-300">{t('student.communicateWithTeachersGroups')}</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsNewChat(true)}
            className="flex-0 h-11 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('student.newChat')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-blue-900 dark:text-blue-100">{t('student.conversations')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => {
                      setSelectedGroup(group)
                      setSelectedTeacher(null)
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedGroup?.id === group.id
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 border border-blue-300 dark:border-blue-600 shadow-lg'
                        : 'hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {group.type === 'individual' ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{getGroupName(group)}</p>
                          <p className="text-xs text-gray-500">
                            {group.lastMessage ? (
                              <>
                                {group.lastMessage.senderName}: {group.lastMessage.content.substring(0, 30)}
                                {group.lastMessage.content.length > 30 && '...'}
                              </>
                            ) : (
                              t('student.noMessagesYet')
                            )}
                          </p>
                        </div>
                      </div>
                      {group.unreadCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {group.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
            {selectedGroup || selectedTeacher ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-green-200 dark:border-green-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-transparent">
                            {selectedGroup?.type === 'individual' ? <User className="w-4 h-4 text-white" /> : <Users className="w-4 h-4 text-white" />}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h3 className="font-bold text-green-900 dark:text-green-100">
                          {selectedGroup ? getGroupName(selectedGroup) : 
                           demoTeachers.find(t => t.id === selectedTeacher)?.name}
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                          {selectedGroup?.type === 'group' ? t('student.groupChat') : t('student.individualChat')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {getCurrentMessages().map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-sm ${
                            message.senderId === user?.id
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs opacity-75">{message.senderName}</span>
                            <span className="text-xs opacity-75">
                              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                          {editingMessage === message.id ? (
                            <div className="space-y-2">
                              <Input
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveEdit()
                                  }
                                }}
                                className="text-sm"
                              />
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={handleSaveEdit}>
                                  {t('student.save')}
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                  {t('student.cancel')}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm">{message.content}</p>
                              {message.senderId === user?.id && (
                                <div className="flex justify-end mt-2 space-x-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditMessage(message.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteMessage(message.id)}
                                    className="h-6 w-6 p-0 text-red-500"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    {getTypingIndicator()}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t border-green-200 dark:border-green-700 bg-white dark:bg-gray-800">
                  <div className="flex space-x-3">
                    <Input
                      value={newMessage}
                      onChange={handleTyping}
                      onKeyPress={handleKeyPress}
                      placeholder={t('student.typeYourMessage')}
                      className="flex-1 border-green-300 dark:border-green-600 focus:border-green-500 dark:focus:border-green-400"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">{t('student.selectConversationToStartMessaging')}</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* New Chat Modal */}
      {isNewChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsNewChat(false)} />
          <Card className="relative w-full max-w-md bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 shadow-2xl">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">💬</span>
                </div>
                <CardTitle className="text-purple-900 dark:text-purple-100">{t('student.startNewChat')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    onClick={() => startNewChat(teacher.id)}
                    className="p-4 rounded-xl border border-purple-200 dark:border-purple-700 cursor-pointer hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-purple-900 dark:text-purple-100">{teacher.name}</p>
                        <p className="text-sm text-purple-700 dark:text-purple-300">{teacher.group}</p>
                      </div>
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 