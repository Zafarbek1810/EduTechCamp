import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  content: string
  timestamp: Date
  groupId?: string
  recipientId?: string
  isRead: boolean
  messageType?: 'text' | 'file' | 'image'
  fileUrl?: string
  fileName?: string
}

export interface ChatGroup {
  id: string
  name: string
  type: 'group' | 'individual'
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  createdAt: Date
  updatedAt: Date
}

interface ChatState {
  messages: Message[]
  groups: ChatGroup[]
  typingUsers: { [groupId: string]: string[] }
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void
  markAsRead: (messageId: string) => void
  markGroupAsRead: (groupId: string, userId: string) => void
  getMessagesByGroup: (groupId: string) => Message[]
  getMessagesByParticipants: (participant1: string, participant2: string) => Message[]
  getGroupsByUser: (userId: string) => ChatGroup[]
  createGroup: (group: Omit<ChatGroup, 'id' | 'lastMessage' | 'unreadCount' | 'createdAt' | 'updatedAt'>) => void
  getUnreadCount: (userId: string) => number
  setTyping: (groupId: string, userId: string, isTyping: boolean) => void
  getTypingUsers: (groupId: string) => string[]
  deleteMessage: (messageId: string) => void
  editMessage: (messageId: string, newContent: string) => void
}

// Mock data
const mockGroups: ChatGroup[] = [
  {
    id: 'group1',
    name: 'Mathematics Class',
    type: 'group',
    participants: ['teacher1', 'student1', 'student2', 'student3'],
    unreadCount: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15T10:00:00')
  },
  {
    id: 'individual1',
    name: 'John Teacher',
    type: 'individual',
    participants: ['teacher1', 'student1'],
    unreadCount: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15T10:00:00')
  }
]

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'teacher1',
    senderName: 'John Teacher',
    senderRole: 'teacher',
    content: 'Hello everyone! Welcome to today\'s mathematics class.',
    timestamp: new Date('2024-01-15T09:00:00'),
    groupId: 'group1',
    isRead: true
  },
  {
    id: '2',
    senderId: 'student1',
    senderName: 'Alice Student',
    senderRole: 'student',
    content: 'Good morning, teacher! I have a question about the homework.',
    timestamp: new Date('2024-01-15T09:05:00'),
    groupId: 'group1',
    isRead: true
  },
  {
    id: '3',
    senderId: 'teacher1',
    senderName: 'John Teacher',
    senderRole: 'teacher',
    content: 'Sure Alice, what\'s your question?',
    timestamp: new Date('2024-01-15T09:07:00'),
    groupId: 'group1',
    isRead: false
  },
  {
    id: '4',
    senderId: 'teacher1',
    senderName: 'John Teacher',
    senderRole: 'teacher',
    content: 'Alice, I wanted to discuss your recent quiz performance.',
    timestamp: new Date('2024-01-15T10:00:00'),
    recipientId: 'student1',
    isRead: false
  }
]

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: mockMessages,
      groups: mockGroups,
      typingUsers: {},
      
      addMessage: (messageData) => {
        const newMessage: Message = {
          ...messageData,
          id: Date.now().toString(),
          timestamp: new Date(),
          isRead: false
        }
        
        set((state) => {
          let updatedGroups = [...state.groups]
          
          // Handle group messages
          if (messageData.groupId) {
            updatedGroups = updatedGroups.map(group => {
              if (group.id === messageData.groupId) {
                return {
                  ...group,
                  lastMessage: newMessage,
                  unreadCount: group.unreadCount + 1,
                  updatedAt: new Date()
                }
              }
              return group
            })
          }
          
          // Handle individual messages
          if (messageData.recipientId) {
            const existingGroup = updatedGroups.find(group => 
              group.type === 'individual' && 
              group.participants.includes(messageData.senderId) && 
              group.participants.includes(messageData.recipientId!)
            )
            
            if (existingGroup) {
              // Update existing individual conversation
              updatedGroups = updatedGroups.map(group => {
                if (group.id === existingGroup.id) {
                  return {
                    ...group,
                    lastMessage: newMessage,
                    unreadCount: group.unreadCount + 1,
                    updatedAt: new Date()
                  }
                }
                return group
              })
            } else {
              // Create new individual conversation
              const newGroup: ChatGroup = {
                id: `individual-${Date.now()}`,
                name: 'Individual Chat',
                type: 'individual',
                participants: [messageData.senderId, messageData.recipientId!],
                lastMessage: newMessage,
                unreadCount: 1,
                createdAt: new Date(),
                updatedAt: new Date()
              }
              updatedGroups.push(newGroup)
            }
          }
          
          return {
            messages: [...state.messages, newMessage],
            groups: updatedGroups
          }
        })
      },
      
      markAsRead: (messageId) => {
        set((state) => ({
          messages: state.messages.map(msg => 
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
        }))
      },

      markGroupAsRead: (groupId, userId) => {
        set((state) => ({
          messages: state.messages.map(msg => 
            (msg.groupId === groupId || 
             (msg.recipientId === userId && msg.senderId !== userId) ||
             (msg.senderId === userId && msg.recipientId)) 
              ? { ...msg, isRead: true } : msg
          ),
          groups: state.groups.map(group => 
            group.id === groupId 
              ? { ...group, unreadCount: 0 }
              : group
          )
        }))
      },
      
      getMessagesByGroup: (groupId) => {
        const { messages } = get()
        return messages
          .filter(msg => msg.groupId === groupId)
          .sort((a, b) => {
            const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime()
            const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime()
            return aTime - bTime
          })
      },
      
      getMessagesByParticipants: (participant1, participant2) => {
        const { messages } = get()
        return messages
          .filter(msg => 
            (msg.senderId === participant1 && msg.recipientId === participant2) ||
            (msg.senderId === participant2 && msg.recipientId === participant1)
          )
          .sort((a, b) => {
            const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime()
            const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime()
            return aTime - bTime
          })
      },
      
      getGroupsByUser: (userId) => {
        const { groups } = get()
        return groups
          .filter(group => group.participants.includes(userId))
          .sort((a, b) => {
            const aTime = a.updatedAt instanceof Date ? a.updatedAt.getTime() : new Date(a.updatedAt).getTime()
            const bTime = b.updatedAt instanceof Date ? b.updatedAt.getTime() : new Date(b.updatedAt).getTime()
            return bTime - aTime
          })
      },
      
      createGroup: (groupData) => {
        const newGroup: ChatGroup = {
          ...groupData,
          id: Date.now().toString(),
          unreadCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        set((state) => ({
          groups: [...state.groups, newGroup]
        }))
      },
      
      getUnreadCount: (userId) => {
        const { groups } = get()
        return groups
          .filter(group => group.participants.includes(userId))
          .reduce((sum, group) => sum + group.unreadCount, 0)
      },

      setTyping: (groupId, userId, isTyping) => {
        set((state) => ({
          typingUsers: {
            ...state.typingUsers,
            [groupId]: isTyping 
              ? [...(state.typingUsers[groupId] || []).filter(id => id !== userId), userId]
              : (state.typingUsers[groupId] || []).filter(id => id !== userId)
          }
        }))
      },

      getTypingUsers: (groupId) => {
        const { typingUsers } = get()
        return typingUsers[groupId] || []
      },

      deleteMessage: (messageId) => {
        set((state) => ({
          messages: state.messages.filter(msg => msg.id !== messageId)
        }))
      },

      editMessage: (messageId, newContent) => {
        set((state) => ({
          messages: state.messages.map(msg => 
            msg.id === messageId ? { ...msg, content: newContent } : msg
          )
        }))
      }
    }),
    {
      name: 'chat-storage'
    }
  )
) 