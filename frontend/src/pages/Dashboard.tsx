import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  Chip,
} from '@mui/material';
import {
  Add,
  VideoCall,
  Schedule,
  Person,
  Logout,
  PlayArrow,
} from '@mui/icons-material';
import type { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { setMeetings, addMeeting } from '../store/slices/meetingSlice';
import type { Meeting } from '../types';

const Dashboard: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    scheduledTime: '',
  });
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { meetings } = useSelector((state: RootState) => state.meeting);

  useEffect(() => {
    // Mock meetings data - in real app, this would come from API
    const mockMeetings: Meeting[] = [
      {
        id: '1',
        title: 'Weekly Team Standup',
        scheduledTime: '2024-01-15T10:00:00',
        participants: ['john@example.com', 'jane@example.com'],
        status: 'scheduled',
      },
      {
        id: '2',
        title: 'Project Review',
        scheduledTime: '2024-01-15T14:00:00',
        participants: ['manager@example.com', 'dev@example.com'],
        status: 'completed',
      },
    ];
    dispatch(setMeetings(mockMeetings));
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleCreateMeeting = () => {
    if (!meetingForm.title || !meetingForm.scheduledTime) {
      return;
    }

    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: meetingForm.title,
      scheduledTime: meetingForm.scheduledTime,
      participants: [user?.email || ''],
      status: 'scheduled',
    };

    dispatch(addMeeting(newMeeting));
    setMeetingForm({ title: '', scheduledTime: '' });
    setOpen(false);
  };

  const handleJoinMeeting = (meetingId: string) => {
    navigate(`/meeting/${meetingId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'active':
        return 'success';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <VideoCall sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Video Conferencing Platform
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Person />
            <Typography variant="body1">{user?.name}</Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            Schedule Meeting
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Quick Actions */}
          <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<VideoCall />}
                  onClick={() => navigate('/meeting/instant')}
                >
                  Start Instant Meeting
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Schedule />}
                  onClick={() => setOpen(true)}
                >
                  Schedule Meeting
                </Button>
              </Box>
            </Paper>
          </Box>

          {/* Meetings List */}
          <Box sx={{ flex: '2 1 400px', minWidth: 400 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Meetings
              </Typography>
              {meetings.length === 0 ? (
                <Typography color="text.secondary">
                  No meetings scheduled. Create your first meeting!
                </Typography>
              ) : (
                <List>
                  {meetings.map((meeting) => (
                    <ListItem key={meeting.id} sx={{ px: 0 }}>
                      <Card sx={{ width: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6">{meeting.title}</Typography>
                            <Chip
                              label={meeting.status}
                              color={getStatusColor(meeting.status) as any}
                              size="small"
                            />
                          </Box>
                          <Typography color="text.secondary" gutterBottom>
                            <Schedule sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                            {formatDateTime(meeting.scheduledTime)}
                          </Typography>
                          <Typography variant="body2">
                            Participants: {meeting.participants.length}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          {meeting.status === 'scheduled' && (
                            <Button
                              size="small"
                              startIcon={<PlayArrow />}
                              onClick={() => handleJoinMeeting(meeting.id)}
                            >
                              Join Meeting
                            </Button>
                          )}
                          {meeting.status === 'completed' && (
                            <Button
                              size="small"
                              onClick={() => navigate(`/summary/${meeting.id}`)}
                            >
                              View Summary
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>
        </Box>

        {/* Create Meeting Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Schedule New Meeting</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Meeting Title"
              fullWidth
              variant="outlined"
              value={meetingForm.title}
              onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Scheduled Time"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={meetingForm.scheduledTime}
              onChange={(e) => setMeetingForm({ ...meetingForm, scheduledTime: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateMeeting} variant="contained">
              Schedule Meeting
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Dashboard;