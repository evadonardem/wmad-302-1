import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating
} from "@mui/material";
import { Favorite, FavoriteBorder, AddShoppingCart } from "@mui/icons-material";
import { useState } from "react";

const FEATURED_PRODUCTS = [
  {
    id: 1,
    title: 'Premium Wireless Headphones',
    price: 199.99,
    original_price: 299.99,
    rating: 4.5,
    reviews: 320,
    image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/1.webp',
    discount: 33,
    badge: 'New'
  },
  {
    id: 2,
    title: 'Smart Watch Pro',
    price: 299.99,
    original_price: 399.99,
    rating: 4.8,
    reviews: 450,
    image: 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/1.webp',
    discount: 25,
    badge: 'Hot'
  },
  {
    id: 3,
    title: '4K Ultra HD Camera',
    price: 799.99,
    original_price: 999.99,
    rating: 4.6,
    reviews: 280,
    image: 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp',
    discount: 20,
    badge: 'Sale'
  },
  {
    id: 4,
    title: 'Portable Bluetooth Speaker',
    price: 89.99,
    original_price: 129.99,
    rating: 4.4,
    reviews: 210,
    image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/1.webp',
    discount: 30,
    badge: ''
  },
  {
    id: 5,
    title: 'USB-C Fast Charger',
    price: 49.99,
    original_price: 79.99,
    rating: 4.7,
    reviews: 550,
    image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/2.webp',
    discount: 37,
    badge: ''
  },
  {
    id: 6,
    title: 'Wireless Mouse',
    price: 34.99,
    original_price: 59.99,
    rating: 4.3,
    reviews: 180,
    image: 'https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/1.webp',
    discount: 41,
    badge: ''
  }
];

interface HomeProps {
  onCategoryChange: (categoryName: string) => void;
  onAddToCart: (product: any) => void;
}

export default function Home({ onCategoryChange, onAddToCart }: HomeProps) {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 6,
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Welcome to ShopHub
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            Discover amazing products at unbeatable prices
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Free shipping on orders over $50 • 30-day returns • 24/7 customer support
          </Typography>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container sx={{ mb: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
          Featured Products
        </Typography>
        <Grid container spacing={3}>
          {FEATURED_PRODUCTS.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                {/* Product Image */}
                <Box sx={{ position: 'relative', overflow: 'hidden', height: 250 }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={product.image}
                    alt={product.title}
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  />

                  {/* Badges */}
                  {product.badge && (
                    <Chip
                      label={product.badge}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor:
                          product.badge === 'New'
                            ? '#4CAF50'
                            : product.badge === 'Hot'
                              ? '#FF6B6B'
                              : '#FF9800',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  )}

                  {/* Discount Badge */}
                  <Chip
                    label={`-${product.discount}%`}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: '#FF6B6B',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />

                  {/* Wishlist Button */}
                  <Button
                    onClick={() => toggleWishlist(product.id)}
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      minWidth: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    {wishlist.includes(product.id) ? (
                      <Favorite sx={{ color: '#FF6B6B' }} />
                    ) : (
                      <FavoriteBorder sx={{ color: '#999' }} />
                    )}
                  </Button>
                </Box>

                {/* Product Info */}
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#999', mb: 0.5 }}>
                    Electronics
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, minHeight: 50 }}>
                    {product.title}
                  </Typography>

                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Rating value={product.rating} readOnly size="small" />
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      ({product.reviews})
                    </Typography>
                  </Box>

                  {/* Price */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'bold', color: '#FF6B6B' }}
                    >
                      ${(product.price || 0).toFixed(2)}
                    </Typography>
                    {product.original_price && (
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: 'line-through',
                          color: '#999'
                        }}
                      >
                        ${(product.original_price || 0).toFixed(2)}
                      </Typography>
                    )}
                  </Box>

                  {/* Add to Cart Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: '#FF6B6B',
                      '&:hover': { backgroundColor: '#FF5252' },
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                    startIcon={<AddShoppingCart />}
                    onClick={() => onAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
