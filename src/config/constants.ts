// StrangR App Constants & Configuration

export const COLORS = {
  primary: '#C54B8C',
  primaryLight: '#E07FBA',
  primaryDark: '#9E3A70',
  bg: '#000000',
  bgSurface: '#111111',
  bgElevated: '#1a1a1a',
  text: '#FFFFFF',
  textMuted: '#888888',
  border: '#2a2a2a',
  success: '#10B981',
  error: '#EF4444',
} as const

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_IO_URL || 'http://localhost:3001'

export const SOCKET_EVENTS = {
  // Client → Server
  SEND_MESSAGE: 'send_message',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',
  START_MATCHING: 'start_matching',
  SKIP_STRANGER: 'skip_stranger',
  REPORT_STRANGER: 'report_stranger',
  SEND_CONNECTION_REQUEST: 'send_connection_request',
  ACCEPT_CONNECTION: 'accept_connection',
  DECLINE_CONNECTION: 'decline_connection',
  DISCONNECT_FRIEND: 'disconnect_friend',
  // Server → Client
  RECEIVE_MESSAGE: 'receive_message',
  USER_TYPING: 'user_typing',
  USER_STOPPED_TYPING: 'user_stopped_typing',
  NEW_MATCH: 'new_match',
  MATCH_SKIPPED_YOU: 'match_skipped_you',
  CONNECTION_REQUEST_RECEIVED: 'connection_request_received',
  CONNECTION_ACCEPTED: 'connection_accepted',
  CONNECTION_EXPIRED: 'connection_expired',
  YOU_WERE_REPORTED: 'you_were_reported',
  BAN_STATUS_CHANGED: 'ban_status_changed',
  FRIEND_ONLINE: 'friend_online',
  FRIEND_OFFLINE: 'friend_offline',
} as const

export const PREMIUM_PRICE = 99 // INR per month

export const BAN_DURATION_HOURS = 24
export const REPORT_BAN_THRESHOLD = 5
export const MAX_MESSAGES_PER_MINUTE = 10

export const PROFANITY_WORDS: string[] = [
  // Basic seed list — expand via backend AI detection
  'fuck', 'shit', 'ass', 'bitch', 'bastard', 'damn', 'crap',
]

export const SHYNE = {
  name: 'Shyne',
  description: 'A boutique web development group specializing in ethereal digital experiences.',
  portfolio: 'https://shynefolio.vercel.app/',
  tagline: 'CRAFTED WITH PASSION',
} as const

export const APP_META = {
  name: 'StrangR',
  tagline: 'Chat with Strangers. Build Real Friendships.',
  description: 'Completely anonymous. Purely conversation-driven. Rediscover the art of human connection.',
  url: 'https://strangr.app',
} as const
