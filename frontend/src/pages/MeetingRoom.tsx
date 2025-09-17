import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Fab,
  Drawer,
  AppBar,
  Toolbar,
  Button,
  Chip,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  Chat,
  CallEnd,
  Send,
  People,
} from '@mui/icons-material';
import type { RootState } from '../store/store';
import {
  toggleAudio,
  toggleVideo,
  toggleScreenShare,
  addChatMessage,
  setLocalStream,
  addParticipant,
  clearMeeting,
} from '../store/slices/meetingSlice';

const MeetingRoom: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    participants,
    localStream,
    chatMessages,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
  } = useSelector((state: RootState) => state.meeting);

  useEffect(() => {
    initializeMedia();
    
    // Mock participants for demo
    dispatch(addParticipant({
      id: '1',
      name: 'John Doe',
      audio: true,
      video: true,
    }));
    dispatch(addParticipant({
      id: '2',
      name: 'Jane Smith',
      audio: true,
      video: false,
    }));

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isVideoEnabled]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      dispatch(setLocalStream(stream));
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const handleToggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        dispatch(toggleAudio());
      }
    }
  };

  const handleToggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        dispatch(toggleVideo());
      }
    }
  };

  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        // Replace video track with screen share
        const videoTrack = screenStream.getVideoTracks()[0];
        if (localStream && videoTrack) {
          // In a real WebRTC app, you'd replace the track in the peer connection
          dispatch(toggleScreenShare());
        }
        
        videoTrack.onended = () => {
          dispatch(toggleScreenShare());
        };
      } else {
        // Stop screen sharing and return to camera
        dispatch(toggleScreenShare());
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim() && user) {
      const message = {
        id: Date.now().toString(),
        sender: user.name,
        message: chatMessage,
        timestamp: new Date().toISOString(),
      };
      dispatch(addChatMessage(message));
      setChatMessage('');
    }
  };

  const handleLeaveMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    dispatch(clearMeeting());
    navigate('/dashboard');
  };

  const handleEndMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    dispatch(clearMeeting());
    navigate(`/summary/${meetingId}`);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Meeting Room - {meetingId}
          </Typography>
          <Chip
            icon={<People />}
            label={`${participants.length + 1} participants`}
            variant="outlined"
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            color="error"
            onClick={handleEndMeeting}
            sx={{ mr: 1 }}
          >
            End Meeting
          </Button>
          <Button
            variant="outlined"
            onClick={handleLeaveMeeting}
          >
            Leave
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: 'flex' }}>
        {/* Video Grid */}
        <Box sx={{ flex: 1, p: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, height: '100%' }}>
            {/* Local Video */}
            <Box sx={{ flex: '1 1 300px', minHeight: 300, maxWidth: '50%' }}>
              <Paper
                sx={{
                  height: 300,
                  position: 'relative',
                  backgroundColor: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isVideoEnabled ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <VideocamOff sx={{ fontSize: 48, mb: 1 }} />
                    <Typography>Camera Off</Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    px: 1,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="caption">
                    {user?.name} (You)
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Participant Videos */}
            {participants.map((participant) => (
              <Box key={participant.id} sx={{ flex: '1 1 300px', minHeight: 300, maxWidth: '50%' }}>
                <Paper
                  sx={{
                    height: 300,
                    position: 'relative',
                    backgroundColor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {participant.video ? (
                    <Box sx={{ textAlign: 'center', color: 'white' }}>
                      <Videocam sx={{ fontSize: 48, mb: 1 }} />
                      <Typography>Camera On</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', color: 'white' }}>
                      <VideocamOff sx={{ fontSize: 48, mb: 1 }} />
                      <Typography>Camera Off</Typography>
                    </Box>
                  )}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      px: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="caption">
                      {participant.name}
                      {!participant.audio && <MicOff sx={{ ml: 1, fontSize: 14 }} />}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Chat Drawer */}
        <Drawer
          anchor="right"
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          variant="persistent"
          sx={{
            width: chatOpen ? 300 : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 300,
              position: 'relative',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Chat</Typography>
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <List>
              {chatMessages.map((msg) => (
                <ListItem key={msg.id} alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">{msg.sender}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(msg.timestamp)}
                        </Typography>
                      </Box>
                    }
                    secondary={msg.message}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <IconButton onClick={handleSendMessage} color="primary">
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Drawer>
      </Box>

      {/* Controls */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderRadius: 4,
          p: 1,
        }}
      >
        <IconButton
          onClick={handleToggleAudio}
          sx={{
            backgroundColor: isAudioEnabled ? 'primary.main' : 'error.main',
            color: 'white',
            '&:hover': {
              backgroundColor: isAudioEnabled ? 'primary.dark' : 'error.dark',
            },
          }}
        >
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </IconButton>

        <IconButton
          onClick={handleToggleVideo}
          sx={{
            backgroundColor: isVideoEnabled ? 'primary.main' : 'error.main',
            color: 'white',
            '&:hover': {
              backgroundColor: isVideoEnabled ? 'primary.dark' : 'error.dark',
            },
          }}
        >
          {isVideoEnabled ? <Videocam /> : <VideocamOff />}
        </IconButton>

        <IconButton
          onClick={handleScreenShare}
          sx={{
            backgroundColor: isScreenSharing ? 'success.main' : 'grey.700',
            color: 'white',
            '&:hover': {
              backgroundColor: isScreenSharing ? 'success.dark' : 'grey.800',
            },
          }}
        >
          {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
        </IconButton>

        <IconButton
          onClick={() => setChatOpen(!chatOpen)}
          sx={{
            backgroundColor: chatOpen ? 'success.main' : 'grey.700',
            color: 'white',
            '&:hover': {
              backgroundColor: chatOpen ? 'success.dark' : 'grey.800',
            },
          }}
        >
          <Chat />
        </IconButton>

        <Fab
          color="error"
          size="medium"
          onClick={handleLeaveMeeting}
          sx={{ ml: 2 }}
        >
          <CallEnd />
        </Fab>
      </Box>
    </Box>
  );
};

export default MeetingRoom;