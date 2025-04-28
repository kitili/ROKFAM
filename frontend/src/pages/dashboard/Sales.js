import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import axios from 'axios';

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    payment_method: 'cash',
    items: [{ product_id: '', quantity: 1 }],
  });

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get('/api/sales');
      setSales(response.data);
    } catch (error) {
      setError('Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      setError('Failed to fetch products');
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      payment_method: 'cash',
      items: [{ product_id: '', quantity: 1 }],
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', quantity: 1 }],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/sales', formData);
      fetchSales();
      handleCloseDialog();
    } catch (error) {
      setError('Failed to create sale');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await axios.delete(`/api/sales/${id}`);
        fetchSales();
      } catch (error) {
        setError('Failed to delete sale');
      }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Sales</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          New Sale
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  {new Date(sale.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {sale.items.map((item) => (
                    <Typography key={item.id}>
                      {item.quantity} x {item.product.name}
                    </Typography>
                  ))}
                </TableCell>
                <TableCell>${sale.total_amount.toFixed(2)}</TableCell>
                <TableCell>{sale.payment_method}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(sale.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>New Sale</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Payment Method"
                name="payment_method"
                value={formData.payment_method}
                onChange={(e) =>
                  setFormData({ ...formData, payment_method: e.target.value })
                }
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="mpesa">M-Pesa</MenuItem>
                <MenuItem value="card">Card</MenuItem>
              </TextField>
            </Grid>

            {formData.items.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          select
                          label="Product"
                          value={item.product_id}
                          onChange={(e) =>
                            handleItemChange(index, 'product_id', e.target.value)
                          }
                        >
                          {products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                              {product.name} (${product.unit_price})
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Quantity"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, 'quantity', e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          onClick={() => handleRemoveItem(index)}
                          disabled={formData.items.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Complete Sale
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Sales; 