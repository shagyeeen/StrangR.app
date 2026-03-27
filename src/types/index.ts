// TypeScript interfaces for StrangR App

export interface User {
  uid: string
  email: string
  strangRCode: string
  displayName?: string
  profileImage?: string
  accountCreatedDate: Date
  searchingForMatch: boolean
  currentMatchId: string | null
  lastActiveTime: Date
  isOnline: boolean
  friendsList: string[]
  blockedList: string[]
  banStatus: boolean
  banReason?: string
  banExpiryTime?: Date
  reportCount: number
  reportedByList: string[]
  premiumStatus: boolean
  premiumExpiryDate?: Date
  premiumDenialList?: string[]
}

export interface Message {
  id: string
  senderId: string
  text: string
  timestamp: Date
  readBy: string[]
}

export interface Friend {
  uid: string
  strangRCode: string
  petName: string
  phoneNumber?: string
  isOnline: boolean
  lastMessage?: string
  lastMessageTime?: Date
  friendshipId: string
}

export interface Friendship {
  id: string
  user1Id: string
  user2Id: string
  petName1: string
  petName2: string
  phoneNumber1?: string
  phoneNumber2?: string
  connectedAt: Date
  lastMessageTime?: Date
  disconnectedAt?: Date
}

export interface Connection {
  id: string
  senderId: string
  receiverId: string
  status: 'pending' | 'accepted' | 'expired' | 'declined'
  createdAt: Date
  expiresAt: Date
  respondedAt?: Date
}

export interface Chat {
  id: string
  user1Id: string
  user2Id: string
  messages: Message[]
  createdAt: Date
  expiresAt?: Date
}

export interface FriendChat {
  id: string
  friendshipId: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Ban {
  id: string
  userId: string
  email: string
  ipAddress: string
  banReason: 'profanity' | 'reporting_threshold'
  banStartTime: Date
  banEndTime: Date
  active: boolean
}

export interface Report {
  id: string
  reportedUserId: string
  reportedByUserId: string
  reason?: string
  timestamp: Date
  viewed: boolean
}

export interface Payment {
  id: string
  userId: string
  razorpayOrderId: string
  razorpayPaymentId?: string
  amount: number
  currency: string
  status: 'pending' | 'success' | 'failed'
  planType: 'monthly'
  createdAt: Date
  expiryDate?: Date
}

export interface Stranger {
  uid: string
  strangRCode: string
  isOnline: boolean
}

export interface ChatState {
  currentMatch: Stranger | null
  messages: Message[]
  isTyping: boolean
  connectionStatus: 'idle' | 'matching' | 'chatting' | 'pending_connection' | 'friends'
  connectionId: string | null
  friendshipId: string | null
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export type SocketEvent =
  | 'send_message'
  | 'receive_message'
  | 'typing'
  | 'stop_typing'
  | 'user_typing'
  | 'user_stopped_typing'
  | 'start_matching'
  | 'skip_stranger'
  | 'report_stranger'
  | 'new_match'
  | 'match_skipped_you'
  | 'send_connection_request'
  | 'accept_connection'
  | 'decline_connection'
  | 'connection_request_received'
  | 'connection_accepted'
  | 'connection_expired'
  | 'you_were_reported'
  | 'ban_status_changed'
  | 'friend_online'
  | 'friend_offline'
  | 'disconnect_friend'
