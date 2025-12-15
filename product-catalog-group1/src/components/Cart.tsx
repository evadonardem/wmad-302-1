import React, { useState, useEffect } from "react";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  IconButton,
  Button,
  Divider,
  Stack,
  Collapse,
  Grow,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment, // Added missing import
  Chip // Added missing import
} from "@mui/material";
// Type-only import for SelectChangeEvent
import type { SelectChangeEvent } from "@mui/material"; 

import { TransitionGroup } from 'react-transition-group';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedIcon from '@mui/icons-material/Verified';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ReceiptIcon from '@mui/icons-material/Receipt';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

// --- VOUCHER OPTIONS ---
const VOUCHER_OPTIONS = [
  { code: 'SAVE10', label: '10% Off Orders', type: 'percent', value: 0.10 },
  { code: 'WELCOME20', label: 'Welcome Gift (20% Off)', type: 'percent', value: 0.20 },
  { code: 'MINUS500', label: 'Flat ₱500 Off', type: 'flat', value: 500 },
];

const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onContinueShopping,
}) => {
  const theme = useTheme();

  // --- State ---
  const [selectedVoucherCode, setSelectedVoucherCode] = useState("");
  
  // FIX: Explicitly defined the allowed severity types to include "info"
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ 
    open: false, 
    message: "", 
    severity: "success" 
  });

  // --- Calculations ---
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // 1. Calculate VAT (12% of Subtotal)
  const vatRate = 0.12;
  const vatAmount = subtotal * vatRate;

  // 2. Calculate Shipping
  const shipping = subtotal > 5000 ? 0 : 150; 
  
  // 3. Calculate Discount
  let discountAmount = 0;
  const activeVoucher = VOUCHER_OPTIONS.find(v => v.code === selectedVoucherCode);

  if (activeVoucher) {
      if (activeVoucher.type === 'percent') {
          discountAmount = subtotal * activeVoucher.value;
      } else {
          discountAmount = activeVoucher.value;
      }
  }
  
  // 4. Final Total
  const total = Math.max(0, subtotal + vatAmount + shipping - discountAmount);

  // --- Handlers ---
  const handleVoucherChange = (event: SelectChangeEvent) => {
      const code = event.target.value;
      setSelectedVoucherCode(code);
      
      if (code) {
        setSnackbar({ open: true, message: `Voucher ${code} applied!`, severity: "success" });
      } else {
        setSnackbar({ open: true, message: "Voucher removed.", severity: "info" });
      }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- Render Empty State ---
  if (items.length === 0) {
    return (
      <Grow in={true}>
        <Container maxWidth="md" sx={{ mt: 8, mb: 10, textAlign: "center" }}>
          <Box 
            sx={{ 
                p: 8, 
                borderRadius: 8, 
                background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(145deg, #1a1a1a, #0d0d0d)' 
                    : 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 20px 40px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
          >
            <Box 
                sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    p: 4, 
                    borderRadius: '50%', 
                    mb: 3,
                    animation: 'float 3s ease-in-out infinite' 
                }}
            >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 80, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
              Looks like you haven't added anything to your cart yet. Explore our products and find something you love!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={onContinueShopping}
              startIcon={<ArrowBackIcon />}
              sx={{ 
                borderRadius: 50, 
                px: 5, 
                py: 1.5, 
                fontWeight: 700,
                boxShadow: '0 8px 20px rgba(0,113,227,0.3)'
              }}
            >
              Start Shopping
            </Button>
          </Box>
          <style>{`
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0px); }
            }
          `}</style>
        </Container>
      </Grow>
    );
  }

  // --- Render Cart ---
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Grow in={true} timeout={500}>
        <Box mb={4} display="flex" alignItems="center">
            <IconButton onClick={onContinueShopping} sx={{ mr: 2, bgcolor: theme.palette.action.hover }}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight={800}>
            Shopping Cart <Typography component="span" variant="h5" color="text.secondary" fontWeight={500}>({items.length} items)</Typography>
            </Typography>
        </Box>
      </Grow>

      <Grid container spacing={4}>
        
        {/* LEFT COL: Cart Items List */}
        <Grid size={{ xs: 12, md: 8 }}>
          <TransitionGroup>
            {items.map((item) => (
              <Collapse key={item.id}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 4,
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: theme.palette.mode === 'dark' ? '0 8px 20px rgba(0,0,0,0.4)' : '0 8px 20px rgba(0,0,0,0.05)',
                            borderColor: 'primary.main'
                        }
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        {/* Image */}
                        <Grid size={{ xs: 3, sm: 2 }}>
                            <Box 
                                component="img" 
                                src={item.thumbnail} 
                                sx={{ 
                                    width: '100%', 
                                    height: 80, 
                                    objectFit: 'contain', 
                                    borderRadius: 2, 
                                    bgcolor: theme.palette.mode === 'dark' ? '#333' : '#f5f5f7',
                                    p: 0.5
                                }} 
                            />
                        </Grid>

                        {/* Title & Price */}
                        <Grid size={{ xs: 9, sm: 5 }}>
                            <Typography variant="subtitle1" fontWeight={700}>
                                {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Item #{item.id}
                            </Typography>
                            <Typography variant="h6" color="primary.main" fontWeight={700} sx={{ display: { xs: 'block', sm: 'none' } }}>
                                ₱{item.price.toLocaleString()}
                            </Typography>
                        </Grid>

                        {/* Quantity Controls */}
                        <Grid size={{ xs: 6, sm: 3 }}>
                             <Box 
                                sx={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    border: `1px solid ${theme.palette.divider}`, 
                                    borderRadius: '12px',
                                    p: 0.5
                                }}
                             >
                                <IconButton 
                                    size="small" 
                                    onClick={() => onUpdateQuantity(item.id, -1)}
                                    disabled={item.quantity <= 1}
                                    color="primary"
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography sx={{ px: 1.5, fontWeight: 'bold', minWidth: 24, textAlign: 'center' }}>{item.quantity}</Typography>
                                <IconButton 
                                    size="small" 
                                    onClick={() => onUpdateQuantity(item.id, 1)}
                                    color="primary"
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Box>
                        </Grid>

                        {/* Price & Delete (Desktop) */}
                        <Grid size={{ xs: 6, sm: 2 }} sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                             <Typography variant="h6" fontWeight={700} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                ₱{(item.price * item.quantity).toLocaleString()}
                             </Typography>
                             <IconButton 
                                onClick={() => onRemoveItem(item.id)} 
                                color="error" 
                                size="small"
                                sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) } }}
                             >
                                <DeleteOutlineIcon fontSize="small" />
                             </IconButton>
                        </Grid>
                    </Grid>
                </Paper>
              </Collapse>
            ))}
          </TransitionGroup>
        </Grid>

        {/* RIGHT COL: Order Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: { md: 'sticky' }, top: 100 }}>
              <Paper 
                elevation={0}
                sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)'
                }}
              >
                <Typography variant="h6" fontWeight={800} gutterBottom>
                  Order Summary
                </Typography>
                
                <Stack spacing={2} sx={{ mt: 3 }}>
                  
                  {/* Subtotal */}
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography fontWeight={600}>₱{subtotal.toLocaleString()}</Typography>
                  </Box>

                  {/* VAT 12% */}
                  <Box display="flex" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <ReceiptIcon fontSize="small" color="action" />
                        <Typography color="text.secondary">VAT (12%)</Typography>
                    </Box>
                    <Typography fontWeight={600}>₱{vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </Box>

                  {/* Shipping */}
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="text.secondary">Shipping Fee</Typography>
                    <Typography fontWeight={600} color={shipping === 0 ? "success.main" : "text.primary"}>
                        {shipping === 0 ? "Free" : `₱${shipping.toLocaleString()}`}
                    </Typography>
                  </Box>
                  
                  {/* Applied Voucher Display */}
                  <Collapse in={!!activeVoucher}>
                    <Box display="flex" justifyContent="space-between" sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), p: 1, borderRadius: 1 }}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <VerifiedIcon color="success" fontSize="small" />
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                                {activeVoucher?.code} Applied
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="success.main" fontWeight={700}>
                            -₱{discountAmount.toLocaleString()}
                        </Typography>
                    </Box>
                  </Collapse>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  {/* Voucher Selection Dropdown */}
                  <FormControl fullWidth size="small">
                    <InputLabel id="voucher-label">Select Discount Voucher</InputLabel>
                    <Select
                        labelId="voucher-label"
                        value={selectedVoucherCode}
                        label="Select Discount Voucher"
                        onChange={handleVoucherChange}
                        startAdornment={
                            <InputAdornment position="start">
                                <LocalOfferIcon fontSize="small" color="primary" />
                            </InputAdornment>
                        }
                        sx={{ borderRadius: 3 }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {VOUCHER_OPTIONS.map((voucher) => (
                            <MenuItem key={voucher.code} value={voucher.code}>
                                <Stack direction="row" justifyContent="space-between" width="100%" alignItems="center">
                                    <Typography variant="body2" fontWeight={600}>{voucher.label}</Typography>
                                    <Chip 
                                        label={voucher.code} 
                                        size="small" 
                                        color="primary" 
                                        variant="outlined" 
                                        sx={{ ml: 1, height: 20, fontSize: '0.65rem' }} 
                                    />
                                </Stack>
                            </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <Divider />
                  
                  <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                    <Typography variant="h6" fontWeight={700}>Total</Typography>
                    <Stack alignItems="flex-end">
                        <Typography variant="h4" fontWeight={800} color="primary.main">
                        ₱{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            (Inclusive of VAT)
                        </Typography>
                    </Stack>
                  </Box>

                  <Button 
                    variant="contained" 
                    size="large" 
                    fullWidth 
                    onClick={onCheckout}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                        mt: 2, 
                        borderRadius: 12, 
                        py: 2, 
                        fontWeight: 700, 
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        background: 'linear-gradient(45deg, #00d9ff 30%, #0071e3 90%)',
                        boxShadow: '0 8px 25px rgba(0,113,227,0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 30px rgba(0,113,227,0.6)',
                        }
                    }}
                  >
                    Check Out
                  </Button>
                  
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={1}>
                     <ProductionQuantityLimitsIcon fontSize="small" color="action" />
                     <Typography variant="caption" color="text.secondary">
                        Secure Checkout • 30-Day Returns
                     </Typography>
                  </Box>
                </Stack>
              </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar for Voucher Feedback */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 4 }}>
            {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;