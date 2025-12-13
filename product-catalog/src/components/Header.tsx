import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  Button,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from "@mui/material";
import {
  ShoppingCart,
  Search as SearchIcon,
  AccountCircle,
  Logout,
  Favorite,
  KeyboardArrowDown
} from "@mui/icons-material";
import { useState } from "react";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onSearchChange: (value: string) => void;
  onNavigate: (page: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export default function Header({
  cartCount,
  onCartClick,
  onSearchChange,
  onNavigate,
  categories,
  selectedCategory,
  onCategoryChange
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCategoryAnchorEl(event.currentTarget);
  };

  const handleCategoryMenuClose = () => {
    setCategoryAnchorEl(null);
  };

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    handleCategoryMenuClose();
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#fff', color: '#333', boxShadow: 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => onNavigate('home')}>
          <ShoppingCart sx={{ fontSize: 32, color: '#FF6B6B' }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: isMobile ? 'none' : 'block'
            }}
          >
            ShopHub
          </Typography>
        </Box>
        {/* Navigation Links */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Featured Link */}
            <Typography
              variant="body1"
              sx={{
                cursor: 'pointer',
                fontWeight: selectedCategory === 'Featured' ? 'bold' : 'normal',
                color: selectedCategory === 'Featured' ? '#FF6B6B' : '#333',
                '&:hover': {
                  color: '#FF6B6B',
                },
              }}
              onClick={() => handleCategorySelect('Featured')}
            >
              Featured
            </Typography>
            
            {/* All Products Link */}
            <Typography
              variant="body1"
              sx={{
                cursor: 'pointer',
                fontWeight: selectedCategory === 'All Products' ? 'bold' : 'normal',
                color: selectedCategory === 'All Products' ? '#FF6B6B' : '#333',
                '&:hover': {
                  color: '#FF6B6B',
                },
              }}
              onClick={() => handleCategorySelect('All Products')}
            >
              All Products
            </Typography>

            {/* Category Dropdown */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={handleCategoryMenuOpen}
                endIcon={<KeyboardArrowDown />}
                sx={{
                  color: '#333',
                  textTransform: 'capitalize',
                  fontWeight: categories.filter(c => c !== 'Featured' && c !== 'All Products').includes(selectedCategory) ? 'bold' : 'normal',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#FF6B6B',
                  },
                }}
              >
                {categories.filter(c => c !== 'Featured' && c !== 'All Products').includes(selectedCategory) ? selectedCategory : 'Categories'}
              </Button>
              <Popover
                open={Boolean(categoryAnchorEl)}
                anchorEl={categoryAnchorEl}
                onClose={handleCategoryMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      maxHeight: 400,
                      overflowY: 'auto',
                    },
                  },
                }}
              >
                <List sx={{ py: 0 }}>
                  {categories
                    .filter(c => c !== 'Featured' && c !== 'All Products')
                    .map((category) => (
                      <ListItem key={category} disablePadding>
                        <ListItemButton
                          selected={selectedCategory === category}
                          onClick={() => handleCategorySelect(category)}
                          sx={{
                            '&.Mui-selected': {
                              backgroundColor: '#FFE5E5',
                              '&:hover': {
                                backgroundColor: '#FFD5D5',
                              },
                            },
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                            },
                          }}
                        >
                          <ListItemText
                            primary={category}
                            primaryTypographyProps={{
                              sx: {
                                textTransform: 'capitalize',
                                fontWeight: selectedCategory === category ? 'bold' : 'normal',
                                color: selectedCategory === category ? '#FF6B6B' : '#333',
                              },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                </List>
              </Popover>
            </Box>
          </Box>
        )}
        {!isMobile && (
          <TextField
            size="small"
            placeholder="Search products..."
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              flex: 1,
              maxWidth: 400,
              backgroundColor: '#f5f5f5',
              borderRadius: 1
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#999' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}

        {/* Right Actions */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton
            sx={{
              color: '#FF6B6B',
              '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.1)' }
            }}
          >
            <Favorite />
          </IconButton>

          <IconButton
            onClick={onCartClick}
            sx={{
              color: '#FF6B6B',
              '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.1)' }
            }}
          >
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          <IconButton
            onClick={handleMenu}
            sx={{
              color: '#333',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>My Account</MenuItem>
            <MenuItem onClick={handleClose}>Orders</MenuItem>
            <MenuItem onClick={handleClose}>Wishlist</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleClose} sx={{ display: 'flex', gap: 1, color: '#FF6B6B' }}>
              <Logout fontSize="small" /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
