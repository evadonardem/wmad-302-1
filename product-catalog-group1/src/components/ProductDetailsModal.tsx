import React, { useState, useEffect, useRef } from "react";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Dialog,
  DialogContent,
  IconButton,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Stack,
  Chip,
  Divider,
  Grow,
  Fade,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Zoom,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FlashOnIcon from '@mui/icons-material/FlashOn';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import ReviewsIcon from '@mui/icons-material/Reviews';

// --- Interfaces ---
interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  reviews?: Review[];
}

interface ProductDetailsModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow?: (product: Product, quantity: number) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  open,
  onClose,
  product,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0); // 0: Details, 1: Reviews
  const theme = useTheme();
  const scrollPositionRef = useRef(0);

  // Mock reviews if none exist
  const reviews = product?.reviews || [
    { rating: 5, comment: "Amazing product! Highly recommend.", date: "2023-10-15", reviewerName: "Alice Johnson", reviewerEmail: "" },
    { rating: 4, comment: "Good value for money.", date: "2023-10-12", reviewerName: "Mark Smith", reviewerEmail: "" },
    { rating: 5, comment: "Fast shipping and great quality.", date: "2023-10-05", reviewerName: "Sarah Lee", reviewerEmail: "" },
  ];

  useEffect(() => {
    if (open) {
      scrollPositionRef.current = window.scrollY;
      setQuantity(1);
      setActiveTab(0);
    } else {
      window.scrollTo(0, scrollPositionRef.current);
    }
  }, [open]);

  if (!product) return null;

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const handleBuyNowClick = () => {
    if (onBuyNow) {
        onBuyNow(product, quantity);
    } else {
        onAddToCart(product, quantity);
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="body"
      TransitionComponent={Grow}
      transitionDuration={400}
      PaperProps={{
        sx: {
          borderRadius: 6,
          overflow: "hidden",
          backgroundImage: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e1e1e 0%, #121212 100%)' 
            : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: theme.palette.mode === 'dark' ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.2)',
        },
      }}
    >
      {/* Header Close Button */}
      <Box sx={{ position: "absolute", right: 16, top: 16, zIndex: 10 }}>
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: theme.palette.background.paper,
            boxShadow: 2,
            transition: 'transform 0.2s',
            '&:hover': { bgcolor: theme.palette.action.hover, transform: 'rotate(90deg)' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Grid container>
          
          {/* Left Side: Image */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ bgcolor: theme.palette.action.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, position: 'relative', minHeight: 400 }}>
             <Zoom in={open} timeout={500}>
                <Box
                  component="img"
                  src={product.thumbnail}
                  alt={product.title}
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: 400,
                    objectFit: "contain",
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.05)" }
                  }}
                />
             </Zoom>
             {product.discountPercentage > 0 && (
                 <Chip 
                    label={`-${Math.round(product.discountPercentage)}% OFF`} 
                    color="error" 
                    sx={{ position: 'absolute', top: 20, left: 20, fontWeight: 'bold', boxShadow: 3 }} 
                 />
             )}
          </Grid>

          {/* Right Side: Details */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={0} sx={{ height: '100%' }}>
                
                {/* Product Header Info */}
                <Box sx={{ p: 4, pb: 2 }}>
                    <Typography variant="overline" color="primary" fontWeight={700} sx={{ letterSpacing: 1.5 }}>
                        {product.brand} • {product.category}
                    </Typography>
                    
                    <Typography variant="h4" fontWeight={800} sx={{ mt: 1, mb: 1, lineHeight: 1.2 }}>
                        {product.title}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                        <Rating value={product.rating} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            ({product.rating} / 5.0)
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => setActiveTab(1)}>
                            {reviews.length} Reviews
                        </Typography>
                    </Stack>

                    <Typography variant="h4" color="primary.main" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        ${product.price.toLocaleString()}
                        <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through', opacity: 0.6 }}>
                            ${Math.round(product.price * (100 / (100 - product.discountPercentage))).toLocaleString()}
                        </Typography>
                    </Typography>
                </Box>

                {/* Tabs */}
                <Tabs 
                    value={activeTab} 
                    onChange={(_, v) => setActiveTab(v)} 
                    variant="fullWidth"
                    sx={{ 
                        borderBottom: 1, 
                        borderColor: 'divider',
                        '& .MuiTab-root': { fontWeight: 700, minHeight: 50 } 
                    }}
                >
                    <Tab icon={<DescriptionIcon fontSize="small" />} iconPosition="start" label="Description" />
                    <Tab icon={<ReviewsIcon fontSize="small" />} iconPosition="start" label="Reviews" />
                </Tabs>

                {/* Tab Content Area */}
                <Box sx={{ p: 4, flexGrow: 1, overflowY: 'auto', maxHeight: 300 }}>
                    {/* Description Tab */}
                    {activeTab === 0 && (
                        <Fade in={activeTab === 0}>
                            <Box>
                                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                    {product.description}
                                </Typography>
                                <Box mt={3}>
                                    <Chip label={product.stock > 0 ? "In Stock" : "Out of Stock"} color={product.stock > 0 ? "success" : "error"} variant="outlined" size="small" />
                                    <Chip label="Free Shipping" color="primary" variant="outlined" size="small" sx={{ ml: 1 }} />
                                </Box>
                            </Box>
                        </Fade>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 1 && (
                        <Fade in={activeTab === 1}>
                            <List disablePadding>
                                {reviews.map((review, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem alignItems="flex-start" disableGutters>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="subtitle2" fontWeight={700}>
                                                            {review.reviewerName || "Anonymous"}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(review.date).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box mt={0.5}>
                                                        <Rating value={review.rating} size="small" readOnly sx={{ mb: 0.5 }} />
                                                        <Typography variant="body2" color="text.primary">
                                                            {review.comment}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        {index < reviews.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Fade>
                    )}
                </Box>

                {/* Actions Footer */}
                <Box sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                    <Grid container spacing={2} alignItems="center">
                        {/* Quantity Control */}
                        <Grid size={{ xs: 4 }}>
                             <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    border: `1px solid ${theme.palette.divider}`, 
                                    borderRadius: '12px',
                                    bgcolor: theme.palette.background.paper 
                                }}
                             >
                                <IconButton onClick={handleDecrement} disabled={quantity <= 1} color="primary">
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>{quantity}</Typography>
                                <IconButton onClick={handleIncrement} color="primary">
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Box>
                        </Grid>
                        
                        {/* Add to Cart - STYLED LIKE BUY NOW BUT BLUE */}
                        <Grid size={{ xs: 4 }}>
                            <Button 
                                variant="contained" 
                                size="large" 
                                fullWidth
                                startIcon={<AddShoppingCartIcon />}
                                onClick={handleAddToCartClick}
                                sx={{ 
                                    borderRadius: '12px', 
                                    py: 1.2, 
                                    fontWeight: 700,
                                    // Custom Blue Gradient matching website theme
                                    backgroundImage: 'linear-gradient(45deg, #00d9ff, #0071e3)',
                                    boxShadow: '0 4px 15px rgba(0, 113, 227, 0.4)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundImage: 'linear-gradient(45deg, #0071e3, #005bb5)',
                                        boxShadow: '0 6px 20px rgba(0, 113, 227, 0.6)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Add To Cart
                            </Button>
                        </Grid>

                        {/* Buy Now - STYLED ORANGE */}
                        <Grid size={{ xs: 4 }}>
                            <Button 
                                variant="contained" 
                                size="large" 
                                fullWidth
                                startIcon={<FlashOnIcon />}
                                onClick={handleBuyNowClick}
                                sx={{ 
                                    borderRadius: '12px', 
                                    py: 1.2, 
                                    fontWeight: 700,
                                    backgroundImage: 'linear-gradient(45deg, #ff9f00, #ff6f00)',
                                    boxShadow: '0 4px 15px rgba(255, 111, 0, 0.4)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundImage: 'linear-gradient(45deg, #ffb300, #ff8f00)',
                                        boxShadow: '0 6px 20px rgba(255, 111, 0, 0.6)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Buy Now
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;