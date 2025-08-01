import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useChatStore, type ChatGroup } from '@/store/chatStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Users, User, Plus, Edit, Trash2, MoreVertical } from 'lucide-react'
import { format } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function TeacherMessages() {
  const { user } = useAuthStore()
  const { messages, addMessage, getMessagesByGroup, getMessagesByParticipants, getGroupsByUser, markGroupAsRead, setTyping, getTypingUsers, deleteMessage, editMessage, getMessagesForTeacher } = useChatStore()
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isNewChat, setIsNewChat] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const userGroups = getGroupsByUser(user?.id || '')

  // Demo students for new chat - using correct user IDs
  const demoStudents = [
    { id: '3', name: 'Alice Student', group: 'Math Group A' }, // student1 (id: 3)
    { id: '6', name: 'Bob Student', group: 'Science Group C' }, // student2 (id: 6)
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedGroup, messages])

  useEffect(() => {
    if (selectedGroup && user) {
      markGroupAsRead(selectedGroup.id, user.id)
    }
  }, [selectedGroup, user])

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
    } else if (selectedStudent) {
      addMessage({
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        content: newMessage.trim(),
        recipientId: selectedStudent
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
    } else if (selectedStudent) {
      return getMessagesByParticipants(user?.id || '', selectedStudent)
    }
    return []
  }

  const startNewChat = (studentId: string) => {
    setSelectedStudent(studentId)
    setSelectedGroup(null)
    setIsNewChat(false)
  }

  const getGroupName = (group: ChatGroup) => {
    if (group.type === 'individual') {
      const otherParticipant = group.participants.find(p => p !== user?.id)
      const student = demoStudents.find(s => s.id === otherParticipant)
      return student ? student.name : 'Individual Chat'
    }
    return group.name
  }

  const getTypingIndicator = () => {
    if (!selectedGroup) return null
    
    const typingUsers = getTypingUsers(selectedGroup.id)
    const typingUserNames = typingUsers
      .filter(id => id !== user?.id)
      .map(id => {
        const student = demoStudents.find(s => s.id === id)
        return student ? student.name : 'Someone'
      })
    
    if (typingUserNames.length > 0) {
      return (
        <div className="flex items-center space-x-2 text-sm text-gray-500 italic">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>{typingUserNames.join(', ')} is typing...</span>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Communicate with your students and groups</p>
        </div>
        <Button 
          onClick={() => setIsNewChat(true)}
          className="flex-0 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Conversations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => {
                      setSelectedGroup(group)
                      setSelectedStudent(null)
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedGroup?.id === group.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
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
                              'No messages yet'
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
          <Card className="h-[600px] flex flex-col">
            {selectedGroup || selectedStudent ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {selectedGroup?.type === 'individual' ? <User className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {selectedGroup ? getGroupName(selectedGroup) : 
                           demoStudents.find(s => s.id === selectedStudent)?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedGroup?.type === 'group' ? 'Group Chat' : 'Individual Chat'}
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
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs opacity-75">{message.senderName}</span>
                            <span className="text-xs opacity-75">
                              {format(message.timestamp, 'HH:mm')}
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
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                  Cancel
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
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={handleTyping}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
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
          <Card className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl">
            <CardHeader>
              <CardTitle>Start New Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {demoStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => startNewChat(student.id)}
                    className="p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{student.group}</p>
                      </div>
                      <User className="w-4 h-4 text-gray-400" />
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