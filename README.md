# StrangR - Strangers Chatting App
## Complete Feature & Functionality Documentation

---

## CORE CONCEPT
**Primary Idea**: Users can chat with complete strangers without revealing identity, face, or personal details. Friendships are built purely through meaningful conversation.

**Core Value Proposition**: Anonymous + random + conversation-based connection

---

## USER IDENTIFICATION SYSTEM
- **Profile**: NO custom profiles
- **Identifier**: Auto-generated StrangR tag (e.g., StrangR#5238)
- **Anonymity Level**: Complete anonymity with strangers
- **Identity Revelation**: Only happens after mutual connection acceptance + friendship

---

## MATCHING SYSTEM

### Matching Type
- **Method**: Completely random
- **No customization**: Users cannot filter/search/choose specific strangers
- **Once lost, cannot find again**: If user skips a stranger, they cannot re-match with that same stranger intentionally
- **Persistence**: Cannot manually re-match or search for a specific StrangR code (except Premium feature - see below)

### Chat Initiation
- Users start chatting immediately after random match
- Text-only chat interface

---

## CHAT INTERFACE & CONTROLS

### Top-Left Corner
- **Display**: StrangR code of the current stranger (e.g., StrangR#5238)

### Top-Right Corner
- **Display**: Connect option/button

### Swipe Gestures
- **Swipe Right to Left**: Skip/Pass on this stranger
- **Swipe Left to Right**: Report this stranger

---

## CONNECTION & FRIENDSHIP SYSTEM

### Connection Request Flow
1. User clicks "Connect" button
2. UI shows: "Connection Pending - Waiting for StrangR to connect"
3. **Connection Request Expiry**: Connection request EXPIRES if the other user skips you
4. States:
   - **If other person accepts**: Popup with linked animation displays "StrangR Turned into Friends"
   - **If other person skips**: Connection request expires, both return to random matching

### Friendship Benefits (After Both Accept Connection)
- Chat becomes **saved/permanent** - persists even if one or both users disconnect
- Can share **phone numbers** with each other (optional - at their wish)
- Can set **pet names** for each other (nicknames)
- Both users are **removed from random matching pool** - they won't be matched as strangers again
- **Disconnect Button**: Both users can click "Disconnect" to end the friendship
  - Effect: Removes friend status and both return to random matching pool
  - Chat history remains saved for each individual user only (not synced if one deletes)

### Chat History for Strangers
- **Before friendship**: Chat is NOT saved
- **After friendship**: Chat becomes permanent/saved
- **Clearing chat**: Users can manually delete chat history; this is the only way to remove saved chat

---

## MODERATION & SAFETY

### Cussing/Profanity System
- **Detection**: Keyword-based + AI detection
- **Punishment**: User gets **BANNED**
- **Ban Duration**: 24 hours
- **Ban Display**: Banned users see a **timer** showing when the ban lifts
- **Ban Auto-Lift**: Automatically lifts after 24 hours (no manual appeal needed)
- **Ban Scope**: 
  - Same email ID - cannot use app
  - Same IP address - cannot use app
- **User Notification**: "You are banned" message displayed with countdown timer

### Reporting System
- **Who can report**: Any user can report an anonymous stranger
- **How to report**: Swipe left to right
- **Report threshold**: If a stranger receives **5 reports**, they are **banned for 24 hours**
- **Report Notification**: The reported stranger **IS notified** that they were reported
- **Report Counter**: Users can see their report count/status

---

## MONETIZATION MODEL
**Type**: Freemium

### Free Tier Features
- Random matching with strangers
- Text-only chat
- Connection requests
- Friendship conversion
- Reporting & blocking
- Phone number & pet name sharing with friends
- **Includes ads** in interface

### Premium Tier Features
1. **Connect by StrangR Code**: Can search and initiate chat with a specific stranger using their StrangR code
2. **Permanent Denial List**: Can permanently block/deny specific strangers from connecting to you (prevents them from sending connection requests)
3. **Ad-Free Interface**: No ads
4. **Pricing**: Monthly subscription model

### Account & Device
- **One StrangR Code Per Email**: Each email address gets ONE unique StrangR code
- **Multi-device**: Can log in on multiple devices but same code applies across all

---

## USER FLOWS

### Stranger Chatting Flow
1. Open app → Get random match (StrangR#XXXX shown top-left)
2. Chat via text
3. If interested → Click "Connect" (top-right)
4. Other user gets notification: "Connection Pending"
5. If they accept → "Turned into Friends" popup with animation
6. Chat is now saved permanently
7. Can exchange phone numbers & set pet names
8. Can only re-match if friendship is ended/cleared

### Stranger Skip/Report Flow
1. During chat with stranger
2. **To skip**: Swipe right to left
3. **To report**: Swipe left to right
4. Get new random stranger

### Safety Actions
- User can report stranger (contributes to 5-report ban threshold)
- Stranger can be cussing-detected and auto-banned for 24 hrs
- After 24 hrs, user can use app again from same email/IP

---

## UI/UX DESIGN SYSTEM

### Color Palette
- **Primary Color - Plum**: `#DDAODD` (vibrant purple)
- **Secondary Color - Mulberry**: `#C54B8C` (darker purple)
- **Light Mode Background**: `#D8BFD8` (Thistle - very light lavender)
- **Dark Mode Background**: Black

### Design Components
- **Icons**: Lucide Icons (lightweight, customizable SVG icons)
- **Styling Framework**: Tailwind CSS (utility-first CSS)
- **Landing Page Animation**: AOS (Animate On Scroll) - scroll-triggered animations

### Design Characteristics
- **Modern Purple Theme**: Consistent plum/mulberry color scheme across both light and dark modes
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities
- **Accessibility**: Lucide icons provide semantic icon clarity

---

## TECH STACK

### Frontend
- **Framework**: Next.js (React-based, full-stack JS framework)
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **Animation**: AOS (Animate On Scroll)

### Backend Services
- **Backend**: Node.js/Express
- **Database**: Firebase (Firestore)
- **Authentication**: Google Auth (gAuth)
- **Payment Gateway**: Razorpay (for premium subscriptions)
- **Real-time Communication**: Firebase Realtime Database / Firestore listeners

### Deployment Strategy
- **Web App**: Frontend + Node.js backend + Firebase + Razorpay
- **Mobile App**: Flutter (cross-platform iOS/Android)
  - **Backend**: Reuses same Node.js, Firebase, and Razorpay infrastructure
  - **Approach**: Separate Flutter frontend, unified backend services

---

## DEVELOPMENT ROADMAP

### Phase 1: Web App (MVP)
- Build with **Next.js** (frontend)
- Integrate **Socket.io** for real-time chat
- Connect to **Supabase** (database, auth, real-time DB)
- Connect to **Firebase** (notifications, storage, additional services)
- Deploy web version

### Phase 2: Mobile App
- Build with **Flutter** (iOS + Android)
- Connect to **same backend** (Socket.io, Supabase, Firebase)
- Mirror web app functionality
- Optimized for mobile UX

### Backend Shared Infrastructure
- Node.js/Express server (handles real-time chat, notifications, connection updates, matching algorithm)
- Firebase (user data, friend lists, chat history, ban records, real-time updates)
- Razorpay (payment processing for premium subscriptions)
- Single backend services used by both web and mobile frontends

---

## TECHNICAL NOTES & ARCHITECTURE CONSIDERATIONS

- **Email-based account system**: One code per email
- **IP + Email-based banning**: Ban enforcement across both vectors
- **Chat persistence**: Stranger chats are volatile; friend chats are permanent until manually cleared
- **Asymmetric deletion**: When one user clears chat, it only affects their view
- **Real-time notifications**: Connection pending status, connection accepted, ban status, report notifications
- **Firebase**: Handles real-time chat messaging, online status, user data storage (user profiles, chats, friends list, ban records)
- **Node.js/Express**: Backend server handles matching algorithm, ban management, cussing detection, reporting logic
- **Google Auth**: Seamless login with existing Google account
- **Razorpay**: Secure payment processing for monthly premium subscriptions

---

## LANDING PAGE STRUCTURE

### Sections Included
1. **Features**: Showcase key app features (anonymity, random matching, friendship conversion)
2. **How It Works**: Step-by-step explanation of user flow (match → chat → connect → friends)
3. **Testimonials**: User reviews/quotes from StrangR community
4. **CTA (Call-to-Action)**: Download button/link for app
5. **About Us**: Company/team information and mission
6. **Shyne Product Showcase**: Highlight **Shyne** - the web development group that created StrangR
   - Portfolio link: https://shynefolio.vercel.app/
   - Showcase team/group identity

### Design
- Built with Next.js frontend
- Responsive design for mobile/desktop
- AOS animations for scroll effects
- Purple theme consistency with app

### Shyne - Development Team
- **Name**: Shyne (Web Development Group)
- **Project**: StrangR (Strangers Chatting App)
- **Portfolio**: https://shynefolio.vercel.app/
- **Role**: Full-stack development and design of StrangR platform

---

## CHAT INTERFACE & INDICATORS

### Connection Display Logic
- **Connection Requests**: NOT displayed in chat interface
- **Only show connection when both connected**: If both users have accepted connection, they see indication that "Both are Connected" or similar status
- **Visibility**: Connection status only visible after mutual acceptance

### Status Indicators During Stranger Chat
1. **Active Chat**: User is actively matched with a StrangR
2. **Skipped Indicator**: If the StrangR skips the user:
   - Show "Skipped" status
   - Immediately transition to: "Waiting for another StrangR"
   - Match with new random stranger
3. **Typing Indicators** (implied): Show when other user is typing (standard feature)
4. **Online Status**: Show if StrangR is currently active/online

---
