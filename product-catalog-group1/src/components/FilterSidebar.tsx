import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Typography,
  Slider,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Box,
  Button,
  TextField,
  useTheme,
  Collapse,
  Checkbox,
  Stack,
  Badge
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckIcon from '@mui/icons-material/Check';

export interface FilterState {
  category: string;
  priceRange: number[];
  sortBy: string;
  brands: string[];
  rating: number | null;
}

interface FilterSidebarProps {
  open: boolean;
  onClose: () => void;
  products: any[];
  onFilterChange: (filters: FilterState) => void;
}

// Increased Max Price to accommodate Motorcycles/Cars
const MAX_PRICE = 1000000; 

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  open,
  onClose,
  products,
  onFilterChange,
}) => {
  const theme = useTheme();
  
  // --- Data States ---
  const [categories, setCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // --- Filter States ---
  const [selectedCategory, setSelectedCategory] = useState("");
  // Updated default range
  const [priceRange, setPriceRange] = useState<number[]>([0, MAX_PRICE]); 
  const [sortBy, setSortBy] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // --- UI States (Collapsible Sections) ---
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    brands: false,
    rating: false,
    sort: true
  });

  // Extract Categories and Brands dynamically
  useEffect(() => {
    if (products) {
      const uniqueCategories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean).sort();
      const uniqueBrands = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean).sort();
      
      setCategories(uniqueCategories);
      setAvailableBrands(uniqueBrands);
    }
  }, [products]);

  // --- Handlers ---

  const handleToggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(prev => prev === category ? "" : category);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => {
      const currentIndex = prev.indexOf(brand);
      const newBrands = [...prev];
      if (currentIndex === -1) {
        newBrands.push(brand);
      } else {
        newBrands.splice(currentIndex, 1);
      }
      return newBrands;
    });
  };

  const handleRatingChange = (rating: number | null) => {
    setSelectedRating(prev => prev === rating ? null : rating);
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handlePriceInputChange = (index: 0 | 1, value: string) => {
    const numVal = parseInt(value, 10);
    if (isNaN(numVal)) return;

    const newRange = [...priceRange];
    newRange[index] = numVal;
    setPriceRange(newRange as number[]);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value);
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setPriceRange([0, MAX_PRICE]); // Reset to new Max
    setSortBy("");
    setSelectedBrands([]);
    setSelectedRating(null);
  };

  const handleApplyFilters = () => {
    onFilterChange({
      category: selectedCategory,
      priceRange: priceRange,
      sortBy: sortBy,
      brands: selectedBrands,
      rating: selectedRating
    });
    onClose(); 
  };

  // Helper to render stars
  const renderStars = (count: number) => {
    return (
        <Box display="flex" alignItems="center">
            {[...Array(5)].map((_, i) => (
                <StarIcon 
                    key={i} 
                    fontSize="small" 
                    sx={{ color: i < count ? "#faaf00" : theme.palette.action.disabled }} 
                />
            ))}
            <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>& Up</Typography>
        </Box>
    );
  };

  const sectionHeaderStyle = {
    py: 1.5,
    px: 2,
    borderRadius: 2,
    cursor: 'pointer',
    '&:hover': { bgcolor: theme.palette.action.hover }
  };

  return (
    <Drawer 
        anchor="right" 
        open={open} 
        onClose={onClose}
        PaperProps={{
            sx: { 
                width: { xs: '100%', sm: 380 }, 
                backgroundColor: theme.palette.background.paper, 
                boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
            }
        }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <Box sx={{ 
            p: 3, 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="h5" fontWeight={800}>
            Filters
            {(selectedBrands.length > 0 || selectedCategory || selectedRating) && (
                <Badge color="primary" variant="dot" sx={{ ml: 1, mb: 0.5 }} />
            )}
          </Typography>
          <IconButton onClick={onClose} sx={{ bgcolor: theme.palette.action.hover }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
            
            {/* --- CATEGORIES --- */}
            <Box mb={1}>
                <Box onClick={() => handleToggleSection('categories')} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...sectionHeaderStyle }}>
                    <Typography variant="subtitle1" fontWeight={700}>Categories</Typography>
                    {openSections.categories ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
                </Box>
                <Collapse in={openSections.categories} timeout="auto" unmountOnExit>
                    <List dense component="div" role="list" sx={{ pl: 1 }}>
                        {categories.map((cat) => (
                            <ListItemButton
                                key={cat}
                                selected={selectedCategory === cat}
                                onClick={() => handleCategoryChange(cat)}
                                sx={{ borderRadius: 2, mb: 0.5 }}
                            >
                                <ListItemText 
                                    primary={cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                                    primaryTypographyProps={{ fontWeight: selectedCategory === cat ? 700 : 500 }}
                                />
                                {selectedCategory === cat && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />}
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
            </Box>

            <Divider sx={{ my: 1, opacity: 0.6 }} />

            {/* --- PRICE RANGE --- */}
            <Box mb={1}>
                <Box onClick={() => handleToggleSection('price')} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...sectionHeaderStyle }}>
                    <Typography variant="subtitle1" fontWeight={700}>Price Range</Typography>
                    {openSections.price ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
                </Box>
                <Collapse in={openSections.price} timeout="auto" unmountOnExit>
                    <Box px={3} py={2}>
                        <Slider
                            value={priceRange}
                            onChange={handlePriceChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={MAX_PRICE} // Updated Max
                            sx={{ color: 'primary.main', mb: 2 }}
                        />
                        <Stack direction="row" spacing={2} alignItems="center">
                            <TextField
                                label="Min"
                                size="small"
                                type="number"
                                value={priceRange[0]}
                                onChange={(e) => handlePriceInputChange(0, e.target.value)}
                                InputProps={{ startAdornment: <Typography variant="caption" sx={{ mr: 0.5 }}>₱</Typography> }}
                            />
                            <Typography color="text.secondary">-</Typography>
                            <TextField
                                label="Max"
                                size="small"
                                type="number"
                                value={priceRange[1]}
                                onChange={(e) => handlePriceInputChange(1, e.target.value)}
                                InputProps={{ startAdornment: <Typography variant="caption" sx={{ mr: 0.5 }}>₱</Typography> }}
                            />
                        </Stack>
                    </Box>
                </Collapse>
            </Box>

            <Divider sx={{ my: 1, opacity: 0.6 }} />

            {/* --- BRANDS --- */}
            <Box mb={1}>
                <Box onClick={() => handleToggleSection('brands')} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...sectionHeaderStyle }}>
                    <Typography variant="subtitle1" fontWeight={700}>Brands</Typography>
                    {openSections.brands ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
                </Box>
                <Collapse in={openSections.brands} timeout="auto" unmountOnExit>
                    <List dense sx={{ maxHeight: 200, overflowY: 'auto', pl: 1 }}>
                        {availableBrands.map((brand) => {
                            const labelId = `checkbox-list-label-${brand}`;
                            return (
                                <ListItemButton key={brand} role={undefined} onClick={() => handleBrandToggle(brand)} dense sx={{ borderRadius: 2 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Checkbox
                                            edge="start"
                                            checked={selectedBrands.indexOf(brand) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                            size="small"
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={brand} />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Collapse>
            </Box>

            <Divider sx={{ my: 1, opacity: 0.6 }} />

            {/* --- RATINGS --- */}
            <Box mb={1}>
                <Box onClick={() => handleToggleSection('rating')} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...sectionHeaderStyle }}>
                    <Typography variant="subtitle1" fontWeight={700}>Rating</Typography>
                    {openSections.rating ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
                </Box>
                <Collapse in={openSections.rating} timeout="auto" unmountOnExit>
                    <List dense sx={{ pl: 1 }}>
                        {[4, 3, 2, 1].map((rating) => (
                            <ListItemButton 
                                key={rating} 
                                onClick={() => handleRatingChange(rating)}
                                selected={selectedRating === rating}
                                sx={{ borderRadius: 2 }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Radio 
                                        checked={selectedRating === rating} 
                                        onChange={() => handleRatingChange(rating)}
                                        value={rating}
                                        size="small"
                                        sx={{ p: 0 }}
                                    />
                                </ListItemIcon>
                                {renderStars(rating)}
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
            </Box>

            <Divider sx={{ my: 1, opacity: 0.6 }} />

            {/* --- SORT BY --- */}
            <Box mb={1}>
                <Box onClick={() => handleToggleSection('sort')} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...sectionHeaderStyle }}>
                    <Typography variant="subtitle1" fontWeight={700}>Sort By</Typography>
                    {openSections.sort ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
                </Box>
                <Collapse in={openSections.sort} timeout="auto" unmountOnExit>
                     <RadioGroup value={sortBy} onChange={handleSortChange} sx={{ pl: 3, pt: 1 }}>
                        {['Relevance', 'Price: Low to High', 'Price: High to Low', 'Top Rated'].map((label, idx) => {
                            const val = idx === 0 ? "" : idx === 1 ? "price-asc" : idx === 2 ? "price-desc" : "rating";
                            return (
                                <FormControlLabel
                                    key={val}
                                    value={val}
                                    control={<Radio size="small" />}
                                    label={<Typography variant="body2">{label}</Typography>}
                                    sx={{ mb: 1 }}
                                />
                            )
                        })}
                    </RadioGroup>
                </Collapse>
            </Box>

        </Box>

        {/* Footer Actions */}
        <Box sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', gap: 2 }}>
            <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<RestartAltIcon />}
                onClick={handleClearFilters}
                color="inherit"
                sx={{ 
                    borderRadius: 3, 
                    py: 1.5, 
                    fontWeight: 700, 
                    textTransform: 'none',
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2 }
                }}
            >
                Reset
            </Button>
            <Button 
                variant="contained" 
                fullWidth 
                startIcon={<CheckIcon />}
                onClick={handleApplyFilters}
                sx={{ 
                    borderRadius: 3, 
                    py: 1.5, 
                    fontWeight: 700, 
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #00d9ff 30%, #0071e3 90%)',
                    boxShadow: '0 4px 14px 0 rgba(0,113,227,0.39)',
                    '&:hover': {
                        boxShadow: '0 6px 20px rgba(0,113,227,0.23)'
                    }
                }}
            >
                Apply Filters
            </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FilterSidebar;