import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Tabs,
  Tab,
  Box,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Avatar,
  InputAdornment,
  Badge
} from '@mui/material';
import {
  Person,
  Store,
  Event,
  Notifications,
  LocationOn,
  BusinessCenter,
  Phone,
  Language,
  Star,
  Warning,
  Info,
  ErrorOutline,
  Close,
  Send
} from '@mui/icons-material';
import { auth, googleProvider, db } from './Backend'; 
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Chat Dialog Component
const ChatDialog = ({ open, handleClose, neighbor }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        timestamp: new Date().toLocaleTimeString(),
        sender: 'user'
      };
      
      setChatHistory([...chatHistory, newMessage]);
      setMessage('');

      // Simulate response after 1 second
      setTimeout(() => {
        const response = {
          text: `Hi! Thanks for reaching out. I'd be happy to connect!`,
          timestamp: new Date().toLocaleTimeString(),
          sender: 'neighbor'
        };
        setChatHistory(prev => [...prev, response]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar>{neighbor?.name[0]}</Avatar>
          <Typography>{neighbor?.name}</Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ height: '400px', p: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          height: '100%',
          overflowY: 'auto'
        }}>
          {chatHistory.map((chat, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: chat.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1,
                  maxWidth: '70%',
                  bgcolor: chat.sender === 'user' ? 'primary.main' : 'grey.100',
                  color: chat.sender === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2
                }}
              >
                <Typography variant="body1">{chat.text}</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>
                  {chat.timestamp}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'grey.100' }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={handleSend}
                  color="primary"
                  disabled={!message.trim()}
                >
                  <Send />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

// Main LocalCircle Component
const LocalCircle = () => {
  const [activeTab, setActiveTab] = useState('community');
  const [userLocation, setUserLocation] = useState(null);
  const [neighbors, setNeighbors] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedNeighbor, setSelectedNeighbor] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleChatOpen = (neighbor) => {
    setSelectedNeighbor(neighbor);
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
    setSelectedNeighbor(null);
  };
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const signedInUser = result.user;
      
      // Check if user exists in the database
      const userRef = doc(db, 'users', signedInUser.email);
      const userSnapshot = await getDoc(userRef);
  
      if (userSnapshot.exists()) {
        // User exists, proceed to app
        const userData = userSnapshot.data();
        localStorage.setItem('user', JSON.stringify(userData)); // Save user info locally
        setUser({
          name: userData.firstName + ' ' + userData.lastName,
          email: signedInUser.email,
          photo: signedInUser.photoURL,
        });
        setActiveTab('community'); // Redirect to community tab
      } else {
        // User does not exist, redirect to signup
        alert('No profile found for this account. Please create a profile.');
        navigate('/signup'); // Use navigate to redirect
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };
  
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear the user state
      console.log('User signed out');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  // Mock data
  const mockNeighbors = [
    { id: 1, name: 'Sarah Chen', distance: '0.3 miles', skills: ['Gardening', 'Piano Teaching'] },
    { id: 2, name: 'Mike Johnson', distance: '0.5 miles', skills: ['Home Repair', 'Programming'] },
    { id: 3, name: 'Lisa Wong', distance: '0.8 miles', skills: ['Cooking', 'Painting'] },
  ];

  const mockMarketplace = [
    { id: 1, type: 'tool', name: 'Power Drill', owner: 'James', distance: '0.2 miles', rate: 'Free' },
    { id: 2, type: 'skill', name: 'Math Tutoring', owner: 'Emma', distance: '0.4 miles', rate: '$20/hr' },
    { id: 3, type: 'item', name: 'Camping Tent', owner: 'David', distance: '0.6 miles', rate: '$10/day' },
  ];

  const mockEvents = [
    { id: 1, name: 'Community Garden Day', date: '2024-02-15', location: 'Central Park', attendees: 12 },
    { id: 2, name: 'Block Party', date: '2024-02-20', location: 'Main Street', attendees: 45 },
    { id: 3, name: 'Skill Share Workshop', date: '2024-02-25', location: 'Community Center', attendees: 8 },
  ];

  const mockAlerts = [
    { 
      id: 1, 
      type: 'urgent', 
      title: 'Water Main Break',
      message: 'Water service disruption on Oak Street. Repairs underway.',
      timestamp: '2 hours ago',
      severity: 'error'
    },
    { 
      id: 2, 
      type: 'community', 
      title: 'Community Meeting',
      message: 'Monthly town hall scheduled for next Wednesday at 7 PM',
      timestamp: '1 day ago',
      severity: 'info'
    },
    { 
      id: 3, 
      type: 'weather', 
      title: 'Weather Alert',
      message: 'Heavy rain expected this weekend. Please secure outdoor items.',
      timestamp: '3 hours ago',
      severity: 'warning'
    }
  ];

  const mockBusinesses = [
    {
      id: 1,
      name: "Joe's Coffee Shop",
      type: 'Café',
      rating: 4.5,
      distance: '0.2 miles',
      address: '123 Main St',
      phone: '(555) 123-4567',
      website: 'www.joescoffee.com',
      isOpen: true
    },
    {
      id: 2,
      name: 'Fresh Market',
      type: 'Grocery Store',
      rating: 4.2,
      distance: '0.4 miles',
      address: '456 Oak Ave',
      phone: '(555) 234-5678',
      website: 'www.freshmarket.com',
      isOpen: true
    },
    {
      id: 3,
      name: 'City Books',
      type: 'Bookstore',
      rating: 4.8,
      distance: '0.6 miles',
      address: '789 Elm St',
      phone: '(555) 345-6789',
      website: 'www.citybooks.com',
      isOpen: false
    }
  ];

  const verifyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  useEffect(() => {
    verifyLocation();
    setNeighbors(mockNeighbors);
    setMarketplace(mockMarketplace);
    setEvents(mockEvents);
    setAlerts(mockAlerts);
    setBusinesses(mockBusinesses);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <ErrorOutline color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <Info />;
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      {!user ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Welcome to LocalCircle!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Please log in or create a profile to get started.
          </Typography>
          <Button variant="contained" onClick={handleGoogleSignIn} sx={{ mr: 2 }}>
            Login with Google
          </Button>
          <Button variant="outlined" onClick={() => navigate('/signup')}>
            Create Profile
          </Button>
        </Box>
      ) : (
        <Container maxWidth="lg">
          {/* Location Alert */}
          {!userLocation && (
            <Alert
              severity="info"
              action={
                <Button color="inherit" size="small" onClick={verifyLocation}>
                  Enable Location
                </Button>
              }
              sx={{ mb: 4 }}
            >
              Please enable location services to connect with your community
            </Alert>
          )}
  
          {/* Navigation Tabs */}
          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<Person />} label="Neighbors" value="community" />
              <Tab icon={<Store />} label="Marketplace" value="marketplace" />
              <Tab icon={<Event />} label="Events" value="events" />
              <Tab
                icon={
                  <Badge badgeContent={alerts.length} color="error">
                    <Notifications />
                  </Badge>
                }
                label="Alerts"
                value="alerts"
              />
              <Tab icon={<BusinessCenter />} label="Local Business" value="businesses" />
              <Box sx={{ flexGrow: 1 }} /> {/* Push Login/Logout to the right */}
              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                  <Avatar src={user.photo} alt={user.name} />
                  <Typography>{user.name}</Typography>
                  <Button variant="contained" onClick={handleLogout}>
                    Logout
                  </Button>
                </Box>
              ) : (
                <Button variant="outlined" onClick={handleGoogleSignIn}>
                  Login with Google
                </Button>
              )}
            </Tabs>
          </Paper>
  
          {/* Main Content */}
          <Grid container spacing={3}>
            {/* Neighbors Section */}
            {activeTab === 'community' && neighbors.map((neighbor) => (
              <Grid item xs={12} sm={6} md={4} key={neighbor.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {neighbor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn fontSize="small" sx={{ mr: 1 }} />
                      {neighbor.distance}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Skills:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {neighbor.skills.map((skill) => (
                        <Chip key={skill} label={skill} size="small" />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleChatOpen(neighbor)}
                    >
                      Connect
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
  
            {/* Marketplace Section */}
            {activeTab === 'marketplace' && marketplace.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Offered by {item.owner}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn fontSize="small" sx={{ mr: 1 }} />
                      {item.distance}
                    </Typography>
                    <Chip
                      label={item.rate}
                      color="success"
                      variant="outlined"
                    />
                  </CardContent>
                  <CardActions>
                    <Button variant="contained" fullWidth>
                      Request {item.type === 'skill' ? 'Service' : 'Item'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
  
            {/* Events Section */}
            {activeTab === 'events' && events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {event.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {event.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn fontSize="small" sx={{ mr: 1 }} />
                      {event.location}
                    </Typography>
                    <Chip
                      label={`${event.attendees} attending`}
                      color="primary"
                      variant="outlined"
                    />
                  </CardContent>
                  <CardActions>
                    <Button variant="contained" fullWidth>
                      Join Event
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
  
            {/* Alerts Section */}
            {activeTab === 'alerts' && alerts.map((alert) => (
              <Grid item xs={12} sm={6} md={4} key={alert.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getSeverityIcon(alert.severity)}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {alert.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {alert.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                      {alert.timestamp}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      fullWidth
                      color={alert.severity}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
  
            {/* Local Businesses Section */}
            {activeTab === 'businesses' && businesses.map((business) => (
              <Grid item xs={12} sm={6} md={4} key={business.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {business.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={business.type}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        icon={<Star />}
                        label={business.rating}
                        size="small"
                        color="primary"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                      <LocationOn fontSize="small" sx={{ mr: 1 }} />
                      {business.distance} - {business.address}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={business.isOpen ? 'Open Now' : 'Closed'}
                        color={business.isOpen ? 'success' : 'default'}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      startIcon={<Phone />}
                      size="small"
                    >
                      Call
                    </Button>
                    <Button
                      startIcon={<Language />}
                      size="small"
                    >
                      Website
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                    >
                      Directions
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
  
          {/* Chat Dialog */}
          <ChatDialog
            open={chatOpen}
            handleClose={handleChatClose}
            neighbor={selectedNeighbor}
          />
        </Container>
      )}
    </Box>
  );
};

export default LocalCircle;