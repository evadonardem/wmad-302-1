import {
  Container,
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Rating,
  InputAdornment,
  CircularProgress,
  Pagination,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper
} from "@mui/material";
import {
  Search as SearchIcon,
  AddShoppingCart,
  Favorite,
  FavoriteBorder
} from "@mui/icons-material";
import { useState, useEffect } from "react";

const PRICE_RANGES = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: 'Over $500', min: 500, max: 10000 }
];

const RATINGS = [5, 4, 3, 2, 1];

interface ProductBrowseProps {
  onAddToCart: (product: any) => void;
  categoryName?: string;
  searchTerm?: string;
}

export default function ProductBrowse({ onAddToCart, categoryName, searchTerm: initialSearchTerm = '' }: ProductBrowseProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortBy, setSortBy] = useState('relevant');
  const [selectedPrices, setSelectedPrices] = useState<number[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 12;

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
    setPage(1);
  }, [initialSearchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let url = 'https://dummyjson.com/products';
        
        if (searchTerm && searchTerm.trim()) {
          url = `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm.trim())}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        const fetchedProducts = data.products || [];
        
        let filteredProducts = fetchedProducts;
        if (categoryName && categoryName !== 'All Products') {
          filteredProducts = fetchedProducts.filter((p: any) => p.category.toLowerCase() === categoryName.toLowerCase());
        }
        
        setProducts(filteredProducts);
        setPage(1);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError('Failed to load products. Please try again.');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, categoryName]);

  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handlePriceChange = (min: number, max: number) => {
    setSelectedPrices([min, max]);
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const filteredProducts = products
    .filter(p => {
      if (selectedPrices.length > 0) {
        const [min, max] = selectedPrices;
        if (p.price < min || p.price > max) return false;
      }
      if (selectedRatings.length > 0 && !selectedRatings.includes(Math.round(p.rating))) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.id - a.id;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            {categoryName ? `${categoryName} Products` : 'All Products'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            {filteredProducts.length} products found
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Sidebar - Filters */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper sx={{ p: 2, position: 'sticky', top: 80 }}>
              {/* Search */}
              <TextField
                fullWidth
                size="small"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon sx={{ color: '#999' }} />
                      </InputAdornment>
                    )
                  }
                }}
                sx={{ mb: 3 }}
              />

              {/* Sort */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel size="small">Sort By</InputLabel>
                <Select
                  size="small"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  label="Sort By"
                >
                  <MenuItem value="relevant">Most Relevant</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                </Select>
              </FormControl>

              {/* Price Filter */}
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Price Range
              </Typography>
              <FormGroup sx={{ mb: 3 }}>
                {PRICE_RANGES.map((range) => (
                  <FormControlLabel
                    key={`${range.min}-${range.max}`}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedPrices[0] === range.min && selectedPrices[1] === range.max}
                        onChange={() => handlePriceChange(range.min, range.max)}
                      />
                    }
                    label={range.label}
                  />
                ))}
              </FormGroup>

              {/* Rating Filter */}
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Rating
              </Typography>
              <FormGroup>
                {RATINGS.map((rating) => (
                  <FormControlLabel
                    key={rating}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedRatings.includes(rating)}
                        onChange={() => handleRatingChange(rating)}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={rating} readOnly size="small" />
                        <Typography variant="caption">& Up</Typography>
                      </Box>
                    }
                  />
                ))}
              </FormGroup>

              {/* Clear Filters */}
              {(selectedPrices.length > 0 || selectedRatings.length > 0 || searchTerm) && (
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 3 }}
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPrices([]);
                    setSelectedRatings([]);
                    setPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 9 }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <Typography color="error">{error}</Typography>
              </Box>
            ) : paginatedProducts.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <Typography color="textSecondary">No products found. Try a different search.</Typography>
              </Box>
            ) : (
              <>
                {/* Products Grid */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {paginatedProducts.map((product) => (
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
                        {/* Image */}
                        <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={product.images && product.images.length > 0 ? product.images[0] : ''}
                            alt={product.title}
                            sx={{
                              objectFit: 'cover',
                              transition: 'transform 0.3s',
                              '&:hover': { transform: 'scale(1.05)' }
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

                        {/* Info */}
                        <CardContent sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                            {categoryName || 'All Categories'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 'bold',
                              mb: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {product.title}
                          </Typography>

                          {/* Rating */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Rating value={product.rating} readOnly size="small" />
                            <Typography variant="caption" sx={{ color: '#999' }}>
                              ({Array.isArray(product.reviews) ? product.reviews.length : 0} reviews)
                            </Typography>
                          </Box>

                          {/* Price */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 'bold', color: '#FF6B6B' }}
                            >
                              ${(product.price || 0).toFixed(2)}
                            </Typography>
                            {product.original_price && (
                              <Typography
                                variant="caption"
                                sx={{
                                  textDecoration: 'line-through',
                                  color: '#999'
                                }}
                              >
                                ${(product.original_price || 0).toFixed(2)}
                              </Typography>
                            )}
                          </Box>

                          {/* Add to Cart */}
                          <Button
                            fullWidth
                            size="small"
                            variant="contained"
                            sx={{
                              backgroundColor: '#FF6B6B',
                              '&:hover': { backgroundColor: '#FF5252' },
                              textTransform: 'none'
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <Stack sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(_, newPage) => setPage(newPage)}
                    />
                  </Stack>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
