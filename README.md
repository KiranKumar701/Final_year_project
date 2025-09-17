# Video Conferencing Platform

A modern, full-featured video conferencing application built with React.js, TypeScript, and Material-UI. This application provides seamless video calls, real-time chat, and AI-powered meeting summaries.

## Features

### Core Libraries
- **react-webrtc / simple-peer** - WebRTC for video calls
- **socket.io-client** - Real-time chat & notifications  
- **Material-UI** - Modern UI components
- **Redux Toolkit** - State management
- **React Router** - Navigation

### Key Pages
1. **Landing Page** - Login/Signup with elegant authentication forms
2. **Dashboard** - Meeting management, scheduling, and quick actions
3. **Meeting Room** - Video grid, controls, and real-time chat
4. **Post-Meeting Summary** - AI-generated meeting notes and insights

### Key Features
- **HD Video Calls** - Crystal clear video quality with multiple participants
- **Real-time Chat** - In-meeting messaging system
- **Meeting Controls** - Audio/video toggle, screen sharing, mute controls
- **Smart Scheduling** - Easy meeting creation and management
- **AI-Powered Summaries** - Automatic generation of meeting insights, key points, and action items
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **User Authentication** - Secure login and registration system

## Screenshots

### Landing Page
![Landing Page](https://github.com/user-attachments/assets/aeccc2af-9c69-4a1b-b24f-07fce2e926da)

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/ed916819-77e3-409b-97fd-83408ad71b0b)

### Meeting Room
![Meeting Room](https://github.com/user-attachments/assets/ae28a23f-9ec9-45bb-b9cf-98e7986f3e31)

### AI-Generated Summary
![Meeting Summary](https://github.com/user-attachments/assets/06d03dc4-6e06-4048-b8c8-a3b311ff027c)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Final_year_project
```

2. Navigate to the frontend directory
```bash
cd frontend
```

3. Install dependencies
```bash
npm install
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v7
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **WebRTC**: Simple-peer for video calling
- **Real-time Communication**: Socket.io-client
- **Styling**: Material-UI with Emotion

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   └── ProtectedRoute.tsx
│   ├── pages/              # Main application pages
│   │   ├── LandingPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── MeetingRoom.tsx
│   │   └── PostMeetingSummary.tsx
│   ├── store/              # Redux store configuration
│   │   ├── store.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       └── meetingSlice.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── package.json
└── vite.config.ts
```

## Features in Detail

### Authentication System
- Login and registration forms with validation
- Protected routes for authenticated users
- Persistent login state with Redux

### Meeting Management
- Create and schedule new meetings
- View meeting history and status
- Join scheduled meetings
- Instant meeting creation

### Video Conferencing
- Multi-participant video calls
- Audio/video controls (mute/unmute, camera on/off)
- Screen sharing capability
- Participant management
- Real-time chat during meetings

### AI Meeting Summaries
- Automatic generation of meeting summaries
- Key discussion points extraction
- Action items identification
- Meeting statistics and insights
- Download and share functionality

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Future Enhancements

- Backend integration for real data persistence
- Real WebRTC peer-to-peer connections
- Calendar integration
- Meeting recordings
- Advanced AI features
- Mobile app development
- Multi-language support

## License

This project is part of a final year project for educational purposes.