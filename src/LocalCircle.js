import { collection, getDocs } from 'firebase/firestore';
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
  Avatar,
  Badge,
  IconButton,
  Rating,
  Divider
} from '@mui/material';
import {
  Person,
  Store,
  Event,
  Notifications,
  LocationOn,
  BusinessCenter,
  Call,
  Language,
  DirectionsWalk
} from '@mui/icons-material';
import { auth, googleProvider, db } from './Backend';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LocalCircle = () => {
  const [activeTab, setActiveTab] = useState('community');
  const [marketplace, setMarketplace] = useState([]);
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [neighbors, setNeighbors] = useState([]);
  const [user, setUser] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [openNeighborChat, setOpenNeighborChat] = useState(null);
  const [neighborMessage, setNeighborMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Marketplace Data
    const fetchMarketplaceData = async () => {
      try {
        const marketplaceRef = collection(db, 'marketplace');
        const querySnapshot = await getDocs(marketplaceRef);
        const marketplaceData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMarketplace(marketplaceData);
      } catch (error) {
        console.error('Error fetching marketplace data:', error);
      }
    };

    // Fetch Events Data
    const fetchEventsData = async () => {
      try {
        const eventsRef = collection(db, 'Events');
        const querySnapshot = await getDocs(eventsRef);
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events data:', error);
      }
    };

    // Fetch Alerts Data
    const fetchAlertsData = async () => {
      try {
        const alertsRef = collection(db, 'alerts');
        const querySnapshot = await getDocs(alertsRef);
        const alertsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlerts(alertsData);
      } catch (error) {
        console.error('Error fetching alerts data:', error);
      }
    };

    // Fetch Neighbors Data
    const fetchNeighborsData = async () => {
      try {
        const neighborsRef = collection(db, 'Neighbors');
        const querySnapshot = await getDocs(neighborsRef);
        const neighborsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNeighbors(neighborsData);
      } catch (error) {
        console.error('Error fetching neighbors data:', error);
      }
    };

    // Fetch Local Businesses Data
    const fetchBusinessesData = async () => {
      try {
        const businessesRef = collection(db, 'Local Businesses');
        const querySnapshot = await getDocs(businessesRef);
        const businessesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBusinesses(businessesData);
      } catch (error) {
        console.error('Error fetching businesses data:', error);
      }
    };

    fetchMarketplaceData();
    fetchEventsData();
    fetchAlertsData();
    fetchNeighborsData();
    fetchBusinessesData();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const signedInUser = result.user;
      setUser({ name: signedInUser.displayName, email: signedInUser.email });
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch(error => console.error('Error signing out:', error));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRSVP = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, rsvp: true } : event
      )
    );
  };

  const handleOpenChat = () => setOpenChat(true);
  const handleCloseChat = () => {
    setOpenChat(false);
    setChatMessage('');
  };

  const handleSendMessage = () => {
    alert('Message sent!');
    handleCloseChat();
  };

  const handleOpenNeighborChat = (neighborId) => {
    setOpenNeighborChat(neighborId);
  };

  const handleCloseNeighborChat = () => {
    setOpenNeighborChat(null);
    setNeighborMessage('');
  };

  const handleSendNeighborMessage = () => {
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      handleCloseNeighborChat();
    }, 3000);
  };

  return (
    <Box
    sx={{
      minHeight: '100vh', // Full viewport height
      display: 'flex', // Center content
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0, // No extra space around
      padding: 0, // No extra space inside
      background: 'linear-gradient(135deg, #000046, #1cb5e0)', // Gradient background
      color: '#fff', // Text color
    }}
  >
    {!user ? (
      <Box
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to LocalLink!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Please log in or create a profile to get started.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleGoogleSignIn}
            sx={{
              bgcolor: '#1cb5e0',
              ':hover': { bgcolor: '#19a7cc' },
              width: '200px',
            }}
          >
            Login with Google
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/signup')}
            sx={{
              borderColor: '#fff',
              color: '#fff',
              ':hover': { borderColor: '#ddd', color: '#ddd' },
              width: '200px',
            }}
          >
            Create Profile
          </Button>
        </Box>
      </Box>

      ) : (
        <Container maxWidth="lg">
          <Paper 
            elevation={3}
            sx={{ 
              mb: 4,
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': {
                  minWidth: 120,
                  py: 2
                }
              }}
            >
              <Tab icon={<Person />} label="NEIGHBORS" value="community" />
              <Tab icon={<Store />} label="MARKETPLACE" value="marketplace" />
              <Tab icon={<Event />} label="EVENTS" value="events" />
              <Tab
                icon={
                  <Badge badgeContent={alerts.length} color="error">
                    <Notifications />
                  </Badge>
                }
                label="ALERTS"
                value="alerts"
              />
              <Tab icon={<BusinessCenter />} label="LOCAL BUSINESS" value="businesses" />
              <Box sx={{ flexGrow: 1 }} />
              <Button 
                variant="contained" 
                onClick={handleLogout}
                sx={{ 
                  mx: 2,
                  my: 1,
                  borderRadius: 2
                }}
              >
                LOGOUT
              </Button>
            </Tabs>
          </Paper>

          <Grid container spacing={3}>
            {/* Neighbors Tab */}
            {activeTab === 'community' &&
              neighbors.map((neighbor) => (
                <Grid item xs={12} sm={6} md={4} key={neighbor.id}>
                  <Card 
                    elevation={2}
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {neighbor.Name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <LocationOn color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {neighbor.Radius} miles
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                          {neighbor.Skills.split(',').map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill.trim()}
                              size="small"
                              sx={{ m: 0.5 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', p: 2 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleOpenNeighborChat(neighbor.id)}
                        sx={{ borderRadius: 2 }}
                      >
                        CONNECT
                      </Button>
                    </CardActions>

                    {/* Neighbor Chat Dialog */}
                    {openNeighborChat === neighbor.id && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          bgcolor: '#f9f9f9',
                        }}
                      >
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          Send a message to {neighbor.Name}:
                        </Typography>
                        <textarea
                          style={{
                            width: '100%',
                            height: '80px',
                            borderRadius: '8px',
                            padding: '8px',
                            marginBottom: '8px',
                          }}
                          value={neighborMessage}
                          onChange={(e) => setNeighborMessage(e.target.value)}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Button variant="outlined" onClick={handleCloseNeighborChat}>
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleSendNeighborMessage}
                          >
                            Send
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {messageSent && openNeighborChat === neighbor.id && (
                      <Typography
                        variant="body2"
                        color="success.main"
                        sx={{ mt: 1, textAlign: 'center' }}
                      >
                        Message sent, wait for reply...
                      </Typography>
                    )}
                  </Card>
                </Grid>
              ))}

            {/* Local Businesses Tab */}
            {activeTab === 'businesses' &&
              businesses.map((business) => (
                <Grid item xs={12} sm={6} md={4} key={business.id}>
                  <Card 
                    elevation={2}
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {business.Name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {business.Service}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1 }}>
                        <Rating value={parseFloat(business.Rating)} readOnly precision={0.1} />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {business.Rating}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                        <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {business.Location}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                      <IconButton color="primary">
                        <Call />
                      </IconButton>
                      <IconButton color="primary">
                        <Language />
                      </IconButton>
                      <Button
                        variant="contained"
                        startIcon={<DirectionsWalk />}
                        sx={{ borderRadius: 2 }}
                      >
                        DIRECTIONS
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}

            {/* Marketplace Tab */}
{activeTab === 'marketplace' &&
  marketplace.map(item => (
    <Grid item xs={12} sm={6} md={4} key={item.id}>
      <Card
        elevation={2}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2
        }}
      >
        <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {item.name}
          </Typography>
          <Box sx={{ my: 2 }}>
            <img
              src={item.image}
              alt={item.name}
              style={{ 
                width: '100%', 
                height: '200px', 
                objectFit: 'cover', 
                borderRadius: '8px' 
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {item.description}
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            ${item.price}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleOpenChat}
            sx={{ borderRadius: 2 }}
          >
            REQUEST ITEM
          </Button>
        </CardActions>

        {/* Chat Dialog for Marketplace */}
        {openChat && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              border: '1px solid #ccc',
              borderRadius: '8px',
              bgcolor: '#f9f9f9',
            }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              Message about {item.name}:
            </Typography>
            <textarea
              style={{
                width: '100%',
                height: '80px',
                borderRadius: '8px',
                padding: '8px',
                marginBottom: '8px',
              }}
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={handleCloseChat}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </Box>
          </Box>
        )}
      </Card>
    </Grid>
  ))}

{/* Events Tab */}
{activeTab === 'events' &&
  events.map((event) => (
    <Grid item xs={12} sm={6} md={4} key={event.id}>
      <Card
        elevation={2}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2
        }}
      >
        <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {event.Name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <LocationOn color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {event.Venue}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
            <Event color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {event.Date}
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', p: 2 }}>
          {!event.rsvp ? (
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleRSVP(event.id)}
              sx={{ borderRadius: 2 }}
            >
              RSVP
            </Button>
          ) : (
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
              ✓ RSVP Confirmed
            </Typography>
          )}
        </CardActions>
      </Card>
    </Grid>
  ))}

{/* Alerts Tab */}
{activeTab === 'alerts' &&
  alerts.map((alert) => (
    <Grid item xs={12} sm={6} md={4} key={alert.id}>
      <Card
        elevation={2}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          border: '1px solid #ffcccc'
        }}
      >
        <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Notifications color="error" sx={{ mr: 1 }} />
            <Typography variant="h6" color="error" fontWeight="bold">
              Alert
            </Typography>
          </Box>
          <Typography variant="body1" gutterBottom>
            {alert.Description}
          </Typography>
          <Box sx={{ my: 2 }}>
            <img
              src={alert.image}
              alt="Alert"
              style={{ 
                width: '100%',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
            <Event color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {alert.Date}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))}
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default LocalCircle;