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
  IconButton,
  Badge,
  TextField,
  Menu,
  MenuItem,
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
  ErrorOutline
} from '@mui/icons-material';
import { auth, googleProvider } from './firebase'; // Adjust the path to your firebase.js file
import { signInWithPopup, signOut } from 'firebase/auth';
import './LocalCircle.css';

const LocalCircle = () => {
  const [activeTab, setActiveTab] = useState('community');
  const [userLocation, setUserLocation] = useState(null);
  const [neighbors, setNeighbors] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [welcomeMessageShown, setWelcomeMessageShown] = useState(false);

  // Mock data setup
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

  // Your existing mock data...
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

  // Location verification
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
  useEffect(() => {
    if (user && !welcomeMessageShown) {
      setShowWelcomeMessage(true);
      setWelcomeMessageShown(true); // Mark the message as shown
  
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false); // Hide the message after 3 seconds
      }, 3000);
  
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [user]); // Only depend on `user`, not `welcomeMessageShown`

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const signedInUser = result.user;
      setUser({
        name: signedInUser.displayName,
        email: signedInUser.email,
        photo: signedInUser.photoURL,
      });
      setActiveTab('community'); // Redirect to the main page after login
      console.log('User signed in:', signedInUser);
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      setUser(null); // Clear the user state
      setWelcomeMessageShown(false); // Reset the welcome message state
      setActiveTab('login'); // Redirect to the login tab
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
    <Container maxWidth="lg">
      {/* Welcome message */}
      {user && showWelcomeMessage && (
 <Box
 sx={{
   position: 'fixed',
   top: 0,
   left: 0,
   width: '100%',
   backgroundColor: '#cce7ff', // Lightish blue
   color: '#333', // Darker text for contrast
   textAlign: 'center',
   py: 2,
   zIndex: 1300,
   animation: 'fadeIn 0.3s ease-in, fadeOut 0.5s ease-out 3s', // Appears in 0.3s, fades out in 0.5s, disappears in 3s
 }}
>
 <Typography variant="h6" component="div">
   Welcome, {user.name}!
 </Typography>
</Box>
      )}
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
            <Box sx={{ flexGrow: 1 }} /> {/* This pushes the Login tab to the end */}
            {/* Conditional rendering for Login/Logout */}
    {user ? (
      <Tab 
        icon={<Person />} 
        label="Logout" 
        onClick={handleLogout} // Call handleLogout when clicked
      />
    ) : (
      <Tab 
        icon={<Person />} 
        label="Login" 
        value="login" 
      />
    )}
  </Tabs>
  </Paper>
        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Existing sections... */}
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
                  <Button variant="contained" fullWidth>
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
                  <Button variant="contained" fullWidth color={alert.severity}>
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
          {/* Login Page */}
          {activeTab === 'login' && (
  <Paper elevation={3} sx={{ p: 4, mx: 'auto', maxWidth: 400 }}>
    <Typography variant="h5" gutterBottom>
      Login
    </Typography>
    <TextField fullWidth label="Email" margin="normal" type="email" />
    <TextField fullWidth label="Password" margin="normal" type="password" />
    <Button variant="contained" fullWidth sx={{ mt: 2 }}>
      Submit
    </Button>
    <Typography variant="body1" align="center" sx={{ my: 2 }}>
      Or
    </Typography>
    <Button
      variant="outlined"
      fullWidth
      sx={{ mt: 2 }}
      onClick={handleGoogleSignIn}
    >
      Sign in with Google
    </Button>
  </Paper>
)}

        </Grid>
      </Container>
    </Box>
  );
};

export default LocalCircle;