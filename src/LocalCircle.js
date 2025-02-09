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
  Badge
} from '@mui/material';
import { Person, Store, Event, Notifications, LocationOn, BusinessCenter } from '@mui/icons-material';
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

fetchBusinessesData(); // Call the fetch function


    fetchMarketplaceData();
    fetchEventsData();
    fetchAlertsData();
    fetchNeighborsData();
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

  // RSVP Functionality for Events
  const handleRSVP = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, rsvp: true } : event
      )
    );
  };

  // Handle Chat for Marketplace
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
    }, 3000); // Message visible for 3 seconds
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
        </Box>
      ) : (
        <Container maxWidth="lg">
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
              <Box sx={{ flexGrow: 1 }} />
              <Button variant="contained" onClick={handleLogout}>
                Logout
              </Button>
            </Tabs>
          </Paper>

          <Grid container spacing={3}>
            {/* Neighbors Tab */}
            {activeTab === 'community' &&
  neighbors.map((neighbor) => (
    <Grid item xs={12} sm={6} md={4} key={neighbor.id}>
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {neighbor.Name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Radius: {neighbor.Radius}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Skills: {neighbor.Skills}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenNeighborChat(neighbor.id)}
          >
            Connect
          </Button>
        </CardActions>
      </Card>

      {/* Chatbox for the Neighbor */}
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
              color="primary"
              onClick={handleSendNeighborMessage}
            >
              Send
            </Button>
          </Box>
        </Box>
      )}

      {/* Message Sent Confirmation */}
      {messageSent && openNeighborChat === neighbor.id && (
        <Typography
          variant="body2"
          color="success.main"
          sx={{ mt: 1, textAlign: 'center' }}
        >
          Message sent, wait for reply...
        </Typography>
      )}
    </Grid>
  ))}

            {/* Marketplace Tab */}
            {activeTab === 'marketplace' &&
              marketplace.map(item => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {item.name}
                      </Typography>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        {item.description}
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                        Price: {item.price}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button variant="contained" fullWidth onClick={handleOpenChat}>
                        Request Item
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}

            {/* Events Tab */}
            {activeTab === 'events' &&
              events.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {event.Name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Venue: {event.Venue}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: {event.Date}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {!event.rsvp ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleRSVP(event.id)}
                        >
                          RSVP
                        </Button>
                      ) : (
                        <Typography variant="body2" color="success.main">
                          Thanks for RSVPing!
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
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {alert.Description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Date: {alert.Date}
                      </Typography>
                      <img
                        src={alert.image}
                        alt="Alert"
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              {/* Local Businesses Tab */}
{activeTab === 'businesses' &&
  businesses.map((business) => (
    <Grid item xs={12} sm={6} md={4} key={business.id}>
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {business.Name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Service: {business.Service}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rating: {business.Rating}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Location: {business.Location}
          </Typography>
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