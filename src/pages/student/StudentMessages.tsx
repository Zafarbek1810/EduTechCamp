import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useChatStore, type ChatGroup } from '@/store/chatStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Users, User, Edit, Trash2, MoreVertical, Plus } from 'lucide-react'
import { format } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function StudentMessages() {
  const { user } = useAuthStore()
  const { messages, addMessage, getMessagesByGroup, getMessagesByParticipants, getGroupsByUser, markGroupAsRead, setTyping, getTypingUsers, deleteMessage, editMessage } = useChatStore()
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isNewChat, setIsNewChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const userGroups = getGroupsByUser(user?.id || '')

  // Mock teachers for display
  const mockTeachers = [
    { id: 'teacher1', name: 'John Teacher' },
    { id: 'teacher2', name: 'Jane Teacher' },
    { id: 'teacher3', name: 'Mike Teacher' }
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

  const getGroupName = (group: ChatGroup) => {
    if (group.type === 'individual') {
      const otherParticipant = group.participants.find(p => p !== user?.id)
      return mockTeachers.find(t => t.id === otherParticipant)?.name || 'Unknown Teacher'
    }
    return group.name
  }

  const getGroupIcon = (group: ChatGroup) => {
    return group.type === 'group' ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />
  }

  const handleEditMessage = (messageId: string, currentContent: string) => {
    setEditingMessage(messageId)
    setEditContent(currentContent)
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

  const handleDeleteMessage = (messageId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      deleteMessage(messageId)
    }
  }

  const getTypingIndicator = () => {
    if (!selectedGroup) return null
    
    const typingUsers = getTypingUsers(selectedGroup.id)
    const otherTypingUsers = typingUsers.filter(id => id !== user?.id)
    
    if (otherTypingUsers.length === 0) return null
    
    const typingNames = otherTypingUsers.map(id => 
      mockTeachers.find(t => t.id === id)?.name || 'Someone'
    ).join(', ')
    
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 italic">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <span>{typingNames} {otherTypingUsers.length === 1 ? 'is' : 'are'} typing...</span>
      </div>
    )
  }

  const startNewChat = (teacherId: string) => {
    setSelectedTeacher(teacherId)
    setSelectedGroup(null)
    setIsNewChat(false)
  }

  // Get all conversations (groups + individual messages)
  const getAllConversations = () => {
    const conversations = [...userGroups]
    
    // Add individual conversations based on messages
    const individualMessages = messages.filter(msg => 
      (msg.senderId === user?.id && msg.recipientId) ||
      (msg.recipientId === user?.id && msg.senderId)
    )
    
    const individualTeachers = new Set<string>()
    individualMessages.forEach(msg => {
      if (msg.senderId === user?.id && msg.recipientId) {
        individualTeachers.add(msg.recipientId)
      } else if (msg.recipientId === user?.id && msg.senderId) {
        individualTeachers.add(msg.senderId)
      }
    })
    
    individualTeachers.forEach(teacherId => {
      const teacher = mockTeachers.find(t => t.id === teacherId)
      if (teacher && !conversations.find(c => c.participants.includes(teacherId))) {
        conversations.push({
          id: `individual-${teacherId}`,
          name: teacher.name,
          type: 'individual' as const,
          participants: [user?.id || '', teacherId],
          unreadCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    })
    
    return conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground dark:text-white">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400">Communicate with your teachers and classmates</p>
        </div>
        <Button onClick={() => setIsNewChat(true)} className="flex-0 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {getAllConversations().length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No conversations yet</p>
                    <Button 
                      onClick={() => setIsNewChat(true)} 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                    >
                      Start a conversation
                    </Button>
                  </div>
                ) : (
                  getAllConversations().map((group) => (
                    <button
                      key={group.id}
                      onClick={() => {
                        if (group.type === 'group') {
                          setSelectedGroup(group)
                          setSelectedTeacher(null)
                        } else {
                          setSelectedTeacher(group.participants.find(p => p !== user?.id) || null)
                          setSelectedGroup(null)
                        }
                      }}
                      className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        selectedGroup?.id === group.id || selectedTeacher === group.participants.find(p => p !== user?.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {getGroupIcon(group)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {getGroupName(group)}
                            </p>
                            {group.lastMessage && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {group.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                        {group.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {group.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            {selectedGroup || selectedTeacher ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center space-x-2">
                    {selectedGroup ? (
                      getGroupIcon(selectedGroup)
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span>{selectedGroup ? getGroupName(selectedGroup) : mockTeachers.find(t => t.id === selectedTeacher)?.name || 'Unknown Teacher'}</span>
                    {selectedGroup && selectedGroup.type === 'group' && (
                      <Badge variant="outline" className="text-xs">
                        Group
                      </Badge>
                    )}
                    {selectedTeacher && (
                      <Badge variant="outline" className="text-xs">
                        Individual
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {getCurrentMessages().length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                          <Send className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        getCurrentMessages().map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative group ${
                                message.senderId === user?.id
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                              }`}
                            >
                              {editingMessage === message.id ? (
                                <div className="space-y-2">
                                  <Input
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault()
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
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs font-medium">
                                        {message.senderName}
                                      </span>
                                      <span className="text-xs opacity-70">
                                        {format(message.timestamp, 'HH:mm')}
                                      </span>
                                    </div>
                                    {message.senderId === user?.id && (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="w-3 h-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                          <DropdownMenuItem onClick={() => handleEditMessage(message.id, message.content)}>
                                            <Edit className="w-3 h-3 mr-2" />
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleDeleteMessage(message.id)} className="text-red-600">
                                            <Trash2 className="w-3 h-3 mr-2" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    )}
                                  </div>
                                  <p className="text-sm">{message.content}</p>
                                </>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                      {getTypingIndicator()}
                      <div ref={messagesEndRef} />
                    </div>

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
                  </div>
                </CardContent>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Start New Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockTeachers.map((teacher) => (
                  <button
                    key={teacher.id}
                    onClick={() => startNewChat(teacher.id)}
                    className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Teacher</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 