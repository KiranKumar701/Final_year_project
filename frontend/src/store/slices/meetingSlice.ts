import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Meeting {
  id: string;
  title: string;
  scheduledTime: string;
  participants: string[];
  status: 'scheduled' | 'active' | 'completed';
}

interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  audio: boolean;
  video: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

interface MeetingState {
  meetings: Meeting[];
  currentMeeting: Meeting | null;
  participants: Participant[];
  localStream: MediaStream | null;
  chatMessages: ChatMessage[];
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
}

const initialState: MeetingState = {
  meetings: [],
  currentMeeting: null,
  participants: [],
  localStream: null,
  chatMessages: [],
  isAudioEnabled: true,
  isVideoEnabled: true,
  isScreenSharing: false,
};

const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    setMeetings: (state, action: PayloadAction<Meeting[]>) => {
      state.meetings = action.payload;
    },
    addMeeting: (state, action: PayloadAction<Meeting>) => {
      state.meetings.push(action.payload);
    },
    setCurrentMeeting: (state, action: PayloadAction<Meeting>) => {
      state.currentMeeting = action.payload;
    },
    addParticipant: (state, action: PayloadAction<Participant>) => {
      state.participants.push(action.payload);
    },
    removeParticipant: (state, action: PayloadAction<string>) => {
      state.participants = state.participants.filter(p => p.id !== action.payload);
    },
    setLocalStream: (state, action: PayloadAction<MediaStream | null>) => {
      state.localStream = action.payload;
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload);
    },
    toggleAudio: (state) => {
      state.isAudioEnabled = !state.isAudioEnabled;
    },
    toggleVideo: (state) => {
      state.isVideoEnabled = !state.isVideoEnabled;
    },
    toggleScreenShare: (state) => {
      state.isScreenSharing = !state.isScreenSharing;
    },
    clearMeeting: (state) => {
      state.currentMeeting = null;
      state.participants = [];
      state.localStream = null;
      state.chatMessages = [];
      state.isScreenSharing = false;
    },
  },
});

export const {
  setMeetings,
  addMeeting,
  setCurrentMeeting,
  addParticipant,
  removeParticipant,
  setLocalStream,
  addChatMessage,
  toggleAudio,
  toggleVideo,
  toggleScreenShare,
  clearMeeting,
} = meetingSlice.actions;

export default meetingSlice.reducer;