import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Share,
  KeyboardArrowRight,
  CheckCircle,
  Schedule,
  SmartToy,
} from '@mui/icons-material';
import type { MeetingSummary } from '../types';

const PostMeetingSummary: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock AI-generated summary - in real app, this would come from API
    setTimeout(() => {
      const mockSummary: MeetingSummary = {
        id: '1',
        meetingId: meetingId || '',
        summary: `This meeting focused on the quarterly project review and planning for the next phase of development. The team discussed current progress, identified key challenges, and outlined priorities for the upcoming quarter. Major decisions were made regarding resource allocation and timeline adjustments.`,
        keyPoints: [
          'Q3 project deliverables were completed 95% on schedule',
          'Budget utilization is within 5% of projections',
          'Team identified three critical path dependencies',
          'New feature requests prioritized for Q4 roadmap',
          'Testing phase will be extended by one week for quality assurance',
          'Client feedback has been overwhelmingly positive'
        ],
        actionItems: [
          'John to finalize API documentation by Friday',
          'Sarah to schedule client demo for next week',
          'Development team to refactor authentication module',
          'Marketing to prepare launch campaign materials',
          'QA team to develop comprehensive test scenarios',
          'Project manager to update stakeholder timeline'
        ],
        generatedAt: new Date().toISOString(),
      };
      setSummary(mockSummary);
      setLoading(false);
    }, 1500);
  }, [meetingId]);

  const handleDownload = () => {
    if (!summary) return;
    
    const content = `
Meeting Summary - ${new Date(summary.generatedAt).toLocaleDateString()}

OVERVIEW:
${summary.summary}

KEY POINTS:
${summary.keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

ACTION ITEMS:
${summary.actionItems.map((item, index) => `${index + 1}. ${item}`).join('\n')}

Generated on: ${new Date(summary.generatedAt).toLocaleString()}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${meetingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share && summary) {
      navigator.share({
        title: 'Meeting Summary',
        text: summary.summary,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Meeting Summary
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SmartToy sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              AI is generating your meeting summary...
            </Typography>
            <Typography color="text.secondary">
              Please wait while we analyze the meeting content and create insights.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (!summary) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Summary not found
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Meeting Summary
          </Typography>
          <Button color="inherit" startIcon={<Share />} onClick={handleShare}>
            Share
          </Button>
          <Button color="inherit" startIcon={<Download />} onClick={handleDownload}>
            Download
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Summary Header */}
          <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SmartToy sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h4" component="h1">
                  AI-Generated Meeting Summary
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Chip
                  icon={<Schedule />}
                  label={`Generated ${new Date(summary.generatedAt).toLocaleDateString()}`}
                  variant="outlined"
                />
                <Chip
                  icon={<Schedule />}
                  label={`Meeting ID: ${meetingId}`}
                  variant="outlined"
                />
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {summary.summary}
              </Typography>
            </Paper>
          </Box>

          {/* Key Points and Action Items */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Key Points */}
            <Box sx={{ flex: '1 1 400px' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <KeyboardArrowRight sx={{ mr: 1, color: 'primary.main' }} />
                  Key Discussion Points
                </Typography>
                <List>
                  {summary.keyPoints.map((point, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {index + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText primary={point} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>

          {/* Action Items */}
          <Box sx={{ flex: '1 1 400px' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                  Action Items
                </Typography>
                <List>
                  {summary.actionItems.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item}
                        primaryTypographyProps={{
                          variant: 'body2'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Statistics */}
        <Box>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Meeting Statistics
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="primary.main">
                    6
                  </Typography>
                  <Typography color="text.secondary">
                    Key Points Identified
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="success.main">
                    6
                  </Typography>
                  <Typography color="text.secondary">
                    Action Items Created
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="info.main">
                    3
                  </Typography>
                  <Typography color="text.secondary">
                    Participants
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Navigation */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
              >
                Schedule New Meeting
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PostMeetingSummary;