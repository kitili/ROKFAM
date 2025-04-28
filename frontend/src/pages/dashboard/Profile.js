import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Divider,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        username: user.username,
        email: user.email,
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.put('/api/auth/profile', {
        username: formData.username,
        email: formData.email,
      });
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await axios.put('/api/auth/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setSuccess('Password updated successfully');
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update password');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Profile Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Update Profile
              </Typography>
              <form onSubmit={handleProfileUpdate}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Change Password
              </Typography>
              <form onSubmit={handlePasswordUpdate}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  margin="normal"
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Account Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography color="text.secondary">Role</Typography>
                  <Typography variant="body1">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="text.secondary">Member Since</Typography>
                  <Typography variant="body1">
                    {new Date(user.created_at).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="text.secondary">Last Login</Typography>
                  <Typography variant="body1">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString()
                      : 'Never'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile; 