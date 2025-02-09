import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Avatar,
  Paper,
  InputAdornment
} from '@mui/material';
import { Close, Send } from '@mui/icons-material';

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
          {/* Chat messages */}
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

export default ChatDialog;