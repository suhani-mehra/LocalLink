import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Avatar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { CloudUpload, PhotoCamera } from '@mui/icons-material';
import { db } from './Backend'; // Import your Firestore instance
import { setDoc,getDoc, doc } from 'firebase/firestore';
const SignUp = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [idDocument, setIdDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = ['Personal Information', 'Profile Picture', 'ID Verification'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setError('Profile picture must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdDocumentUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10000000) { // 10MB limit
        setError('ID document must be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdDocument(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.age &&
          formData.phoneNumber &&
          formData.address &&
          formData.city &&
          formData.state &&
          formData.zipCode
        );
      case 1:
        return profilePicture !== null;
      case 2:
        return idDocument !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const userId = formData.email;
  
      // Check if the email already exists
      const userRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userRef);
  
      if (userSnapshot.exists()) {
        alert('An account with this email already exists. Please log in.');
        navigate('/');
        return;
      }
  
      // Save new user to Firestore
      const userData = {
        ...formData,
        profilePicture,
        idDocument,
        createdAt: new Date().toISOString(),
      };
  
      await setDoc(userRef, userData);
      console.log('User profile created successfully:', userData);
  
      // Automatically log in the user after signup
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/app');
    } catch (err) {
      console.error('Error creating profile:', err);
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              required
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <TextField
              required
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <TextField
              required
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              required
              name="age"
              label="Age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
            />
            <TextField
              required
              name="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            <TextField
              required
              name="address"
              label="Street Address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <TextField
              required
              name="city"
              label="City"
              value={formData.city}
              onChange={handleInputChange}
            />
            <FormControl required>
              <InputLabel>State</InputLabel>
              <Select
                name="state"
                value={formData.state}
                label="State"
                onChange={handleInputChange}
              >
                <MenuItem value="CA">California</MenuItem>
                <MenuItem value="NY">New York</MenuItem>
                <MenuItem value="TX">Texas</MenuItem>
                {/* Add more states */}
              </Select>
            </FormControl>
            <TextField
              required
              name="zipCode"
              label="ZIP Code"
              value={formData.zipCode}
              onChange={handleInputChange}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
            {profilePicture && (
              <Avatar
                src={profilePicture}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
            )}
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
            >
              Upload Profile Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleProfilePictureUpload}
              />
            </Button>
            <Typography variant="caption" color="text.secondary">
              Maximum file size: 5MB
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
            {idDocument && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="success.main">
                  ID Document uploaded successfully
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUpload />}
            >
              Upload ID Document
              <input
                type="file"
                hidden
                accept="image/*,.pdf"
                onChange={handleIdDocumentUpload}
              />
            </Button>
            <Typography variant="caption" color="text.secondary">
              Please upload a clear image of your driver's license or state ID
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Maximum file size: 10MB
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create Your Profile
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!validateCurrentStep() || loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : activeStep === steps.length - 1 ? (
              'Create Profile'
            ) : (
              'Next'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
