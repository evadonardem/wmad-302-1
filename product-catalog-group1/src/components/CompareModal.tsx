import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  Rating,
  Grow,
  Fade,
  Stack,
  // Tooltip removed
} from "@mui/material";
import { useTheme, alpha } from '@mui/material/styles';
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

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
}

interface CompareModalProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const CompareModal: React.FC<CompareModalProps> = ({
  open,
  onClose,
  products,
  onAddToCart,
}) => {
  if (products.length === 0) return null;

  const theme = useTheme();

  // Helper to style sticky headers/columns
  const stickyHeaderStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    bgcolor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
  };

  return (
    <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="lg" 
        fullWidth
        TransitionComponent={Grow}
        transitionDuration={400}
        PaperProps={{
            sx: { 
                borderRadius: "24px", 
                boxShadow: theme.palette.mode === 'dark' ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                backgroundImage: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(145deg, #1e1e1e 0%, #121212 100%)' 
                  : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                overflow: 'hidden'
            }
        }}
    >
      {/* Header */}
      <Box sx={{ px: 4, py: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box>
            <Typography variant="h5" fontWeight={800}>Compare Products</Typography>
            <Typography variant="body2" color="text.secondary">{products.length} items selected</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ bgcolor: theme.palette.action.hover, '&:hover': { transform: 'rotate(90deg)' }, transition: 'all 0.3s' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <TableContainer sx={{ maxHeight: '70vh', scrollBehavior: 'smooth' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...stickyHeaderStyle, zIndex: 11, minWidth: 150, fontWeight: 700, color: 'text.secondary' }}>
                    Features
                </TableCell>
                {products.map((p) => (
                  <TableCell 
                    key={p.id} 
                    align="center" 
                    sx={{ ...stickyHeaderStyle, minWidth: 220, p: 2 }}
                  >
                    <Box sx={{ position: 'relative', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <Box 
                            component="img" 
                            src={p.thumbnail} 
                            alt={p.title} 
                            sx={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'contain', 
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'scale(1.1)' }
                            }} 
                        />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2, height: 40, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
                        {p.title}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            
            <TableBody>
              
              {/* Price Row */}
              <TableRow hover>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: 'text.secondary' }}>Price</TableCell>
                {products.map((p) => (
                  <TableCell key={p.id} align="center">
                    <Typography variant="h6" color="primary.main" fontWeight={800}>
                        ₱{p.price.toLocaleString()}
                    </Typography>
                    {p.discountPercentage > 0 && (
                        <Typography variant="caption" color="error" fontWeight={600}>
                            {Math.round(p.discountPercentage)}% Off
                        </Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>

              {/* Rating Row */}
              <TableRow hover>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: 'text.secondary' }}>Rating</TableCell>
                {products.map((p) => (
                  <TableCell key={p.id} align="center">
                    <Stack alignItems="center" spacing={0.5}>
                        <Rating value={p.rating} readOnly precision={0.5} size="small" />
                        <Typography variant="caption" color="text.secondary">({p.rating}/5)</Typography>
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>

              {/* Brand Row */}
              <TableRow hover>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: 'text.secondary' }}>Brand</TableCell>
                {products.map((p) => (
                  <TableCell key={p.id} align="center">
                    <Typography variant="body2" fontWeight={500}>{p.brand}</Typography>
                  </TableCell>
                ))}
              </TableRow>

              {/* Category Row */}
              <TableRow hover>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: 'text.secondary' }}>Category</TableCell>
                {products.map((p) => (
                  <TableCell key={p.id} align="center">
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{p.category.replace('-', ' ')}</Typography>
                  </TableCell>
                ))}
              </TableRow>

              {/* Stock Row */}
              <TableRow hover>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: 'text.secondary' }}>Availability</TableCell>
                {products.map((p) => (
                  <TableCell key={p.id} align="center">
                    {p.stock > 0 ? (
                        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} color="success.main">
                            <CheckCircleIcon fontSize="small" />
                            <Typography variant="body2" fontWeight={600}>In Stock ({p.stock})</Typography>
                        </Box>
                    ) : (
                        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} color="error.main">
                            <RemoveCircleOutlineIcon fontSize="small" />
                            <Typography variant="body2" fontWeight={600}>Out of Stock</Typography>
                        </Box>
                    )}
                  </TableCell>
                ))}
              </TableRow>

              {/* Description Row */}
              <TableRow hover>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: 'text.secondary', verticalAlign: 'top', pt: 3 }}>Description</TableCell>
                {products.map((p) => (
                  <TableCell key={p.id} align="center" sx={{ verticalAlign: 'top', p: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.85rem' }}>
                        {p.description}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>

              {/* Action Row */}
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}></TableCell>
                {products.map((p) => (
                  <TableCell key={p.id} align="center" sx={{ py: 3 }}>
                    <Fade in timeout={800}>
                        <Button 
                            variant="contained" 
                            fullWidth
                            disableElevation
                            startIcon={<AddShoppingCartIcon />}
                            onClick={() => onAddToCart(p)}
                            sx={{ 
                                borderRadius: '12px', 
                                py: 1.2, 
                                fontWeight: 700,
                                textTransform: 'none',
                                background: 'linear-gradient(45deg, #00d9ff 30%, #0071e3 90%)',
                                boxShadow: '0 4px 15px rgba(0, 113, 227, 0.3)',
                                color: 'white',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #0071e3, #005bb5)',
                                    boxShadow: '0 6px 20px rgba(0, 113, 227, 0.5)',
                                    transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Add to Cart
                        </Button>
                    </Fade>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default CompareModal;