# Matcha - Online Dating App

Matcha is a modern online dating web application built with **SvelteKit** that helps users find romantic connections based on geographic location, shared interests, and personal preferences.

## 🛠️ Tech Stack

### Frontend

- **SvelteKit 2.x** - Modern reactive web framework
- **Svelte 5.x** - Component framework with an improved reactivity system
- **TailwindCSS 4.x** - Utility-first CSS framework
- **DaisyUI 5.x** - Pre-built UI components for Tailwind
- **TypeScript** - Static typing for JavaScript

### Backend

- **SvelteKit Server** - Full-stack API with server-side rendering
- **PostgreSQL** - Relational database
- **Node.js** with Bun runtime

### External Services

- **AWS S3** - Profile image storage
- **Mailjet** - Transactional email service
- **Geolocation APIs** - For automatic and manual geographic location

### Authentication & Security

- **Argon2** - Password hashing
- **Oslo** - Cryptographic utilities
- **Token-based session** management

## 🚀 Main Features

### 1. Authentication System

- **Full registration** with email, username, first and last name, and password
- **Email verification** with unique links
- **Secure login** using Argon2 password hashing
- **Password recovery** via email
- **One-click logout** from any page
- **Session management** using secure tokens

### 2. Full User Profile

- **Personal information**: gender, sexual orientation, biography
- **Tags/interests system** with 15+ predefined categories
- **Photo gallery**: up to 5 images (JPG, PNG, GIF)
- **Geographic location**: automatic by IP or manual
- **Full edit** of profile data
- **Privacy and preferences settings**

### 3. Smart Discovery System

- **Matching algorithm** based on:
  - Geographic proximity
  - Shared interests (tags)
  - Popularity rating ("fame rating")
  - Compatible sexual orientation
- **Sorting** by age, distance, rating and compatibility
- **Advanced filters** across multiple criteria
- **Personalized suggestions** based on the user's profile

### 4. Advanced Search

- **Age filters**: customizable range
- **Distance filters**: configurable radius
- **Rating filters**: min/max popularity
- **Tags filters**: multi-select interests
- **Sortable and dynamically filtered results**

### 5. Social Interactions

- **Likes system**: give and remove likes
- **Matching**: when two users like each other
- **User blocking**: prevent unwanted interactions
- **Report profiles**: moderation for fake content
- **Visit history**: track who viewed your profile

### 6. Real-time Chat

- **Instant messaging** between matched users
- **Server-Sent Events (SSE)** for real-time notifications
- **Modern chat UI** with message history
- **Status indicators**: online/offline and last seen

### 7. Notifications System

Real-time notifications for:

- ❤️ **Received likes**
- 👀 **Profile visits**
- 💘 **New matches**
- 💔 **Unlikes**
- 💬 **Chat messages**

### 8. Settings & Privacy

- **Account settings**: change personal data
- **Password management**: secure change with verification
- **Location settings**: automatic or manual
- **Photo management**: upload, edit and delete
- **Blocked users list**
- **Account deletion**

## 🗂️ Project Structure

```
src/
├── app.html                 # Main HTML template
├── app.css                  # Global styles
├── hooks.server.ts          # SvelteKit server hooks
├── lib/
│   ├── components/          # Reusable components
│   │   ├── chat/           # Chat components
│   │   └── common/         # Common UI components
│   ├── helpers/            # Utility functions
│   │   ├── validators.ts   # Form validators
│   │   ├── user.ts        # User utilities
│   │   └── enum.ts        # Enums and constants
│   ├── server/            # Server logic
│   │   ├── auth.ts        # Authentication system
│   │   ├── users.ts       # User management
│   │   ├── utils.ts       # Server utilities
│   │   └── db/            # Database configuration
│   ├── stores/            # Svelte stores
│   └── mail/              # Email system
├── params/                # Custom route parameters
├── routes/                # Application routes
│   ├── auth/             # Authentication (login, register)
│   ├── api/              # API endpoints
│   ├── chat/             # Messaging system
│   ├── discover/         # Discovery page
│   ├── search/           # Advanced search
│   ├── settings/         # Account settings
│   ├── users/[user]/     # User profiles
│   └── notifications/    # Notifications center
└── static/               # Static files
    ├── assets/           # Images and icons
    └── icons/            # App iconography
```

## 🖼️ Images / Imágenes

<div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
  <img src="images/chat.png" alt="chat" style="max-width:240px; height:auto; border-radius:8px;" />
  <img src="images/profile.png" alt="profile" style="max-width:240px; height:auto; border-radius:8px;" />
</div>


## 🗃️ API Endpoints
### Authentication

- `POST /auth/login` - Login
- `POST /auth/register` - Register user
- `GET /auth/register/[token]` - Email verification
- `POST /auth/login/forgotpassword` - Password recovery

### Users

- `GET /users/[username]` - View user profile
- `POST /api/visit` - Register profile visit
- `POST /api/like-user` - Like/unlike a user
- `POST /api/block-user` - Block/unblock a user
- `POST /api/report-user` - Report a user

### Discovery

- `POST /api/get-users-by-distance` - Users by proximity
- `POST /api/get-users-by-age` - Users by age
- `POST /api/get-users-by-rating` - Users by rating
- `POST /api/user-research` - Advanced search

### Geolocation

- `GET /api/ip-location` - IP-based location
- `POST /api/location-update` - Update location
- `GET /api/manual-location` - Manual location search
- `POST /api/reverse-geocode` - Reverse geocoding

### Chat & Notifications

- `GET /api/messages` - Get chat messages
- `POST /chat` - Send message
- `POST /api/match` - Check match
- `GET /api/notifications/stream` - SSE notifications stream
- `POST /api/notifications/set-read` - Mark notifications as read

### Utilities

- `GET /api/get-tags` - Get available tags
- `GET /api/get-blocked-users` - List of blocked users
- `GET /api/check-like` - Check if a user is liked
- `GET /api/check-block` - Check if a user is blocked

## 🚀 Installation & Configuration

### Prerequisites

- **Bun** (recommended) or Node.js 18+
- **PostgreSQL** 13+
- Accounts on external services (AWS S3, Mailjet, Geolocation APIs)

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/matcha
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret
IPGEOLOCATION_API_KEY=your_ipgeolocation_key
GEOAPIFY_API_KEY=your_geoapify_key
```

### Installation

```bash
# Clone the repository
git clone https://github.com/PILTRAFILLA317/42-matcha.git
cd 42-matcha

# Install dependencies
bun install

# Configure database
# (Run migration scripts according to your PostgreSQL setup)

# Development mode
bun run dev

# Build for production
bun run build

# Preview production
bun run preview
```

## 🧩 Technical Highlights

### Advanced Reactivity System

- **Svelte 5 Runes**: improved reactivity system with `$state`, `$derived`, `$effect`
- **Reactive stores**: global state management with real-time notifications
- **SSE (Server-Sent Events)**: push updates without polling

### Component Architecture

- **Modular components**: reuse and maintainability
- **Typed props**: type safety with TypeScript
- **Advanced composition**: components specialized for chat, search, etc.

### Performance Optimization

- **Lazy loading**: deferred loading of images and components
- **Smart pagination**: for large user/notification lists
- **Geolocation caching**: optimize location queries
- **Debouncing**: in search and real-time updates

### Security

- **Dual validation**: client and server
- **Input sanitization**: prevent XSS and injection
- **Rate limiting**: protection against spam and abuse
- **Secure session management**: tokens with expiration

## 👥 User Experience

### Responsive Design

- **Mobile-first**: optimized for mobile devices
- **Consistent design system**: DaisyUI + TailwindCSS
- **Accessibility**: keyboard navigation and screen reader support

### Intuitive User Flow

1. **Onboarding**: register → verify → complete profile
2. **Discovery**: suggestions → filters → matches
3. **Interaction**: likes → matches → chat
4. **Management**: settings → privacy → notifications

### Visual Feedback

- **Subtle animations**: smooth transitions with Svelte
- **Loading states**: progress indicators
- **Toast notifications**: immediate action feedback
- **Informational modals**: confirmations and alerts

## 🔄 Project Status

**Status**: ✅ **Functional and complete**

### Implemented Features

- ✅ Full authentication system
- ✅ User profiles with photos
- ✅ Smart matching algorithm
- ✅ Advanced search with filters
- ✅ Real-time chat
- ✅ Push notifications with SSE
- ✅ Automatic and manual geolocation
- ✅ Likes/matches/blocking system
- ✅ Full settings panel
- ✅ Responsive and accessible design

---

**Developed for the 42 School project - A complete modern web application example built with SvelteKit** 💖
