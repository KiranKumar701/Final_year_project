export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Meeting {
  id: string;
  title: string;
  scheduledTime: string;
  participants: string[];
  status: 'scheduled' | 'active' | 'completed';
}

export interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  audio: boolean;
  video: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

export interface MeetingSummary {
  id: string;
  meetingId: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  generatedAt: string;
}