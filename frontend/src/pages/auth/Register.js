import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'seller',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Register
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={formData.username}
        onChange={handleChange}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        select
        name="role"
        label="Role"
        value={formData.role}
        onChange={handleChange}
      >
        <MenuItem value="seller">Seller</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </TextField>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Register
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/login')}
          >
            Login here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Register; 