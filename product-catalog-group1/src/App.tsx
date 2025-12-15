import { useEffect, useState, useMemo, useRef } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  Stack,
  Container,
  Grid,
  IconButton,
  Paper,
  CssBaseline,
  GlobalStyles,
  Tooltip,
  Alert,
  Snackbar,
  ThemeProvider,
  createTheme,
} from "@mui/material"; 
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LaptopIcon from '@mui/icons-material/Laptop';
import DiamondIcon from '@mui/icons-material/Diamond'; 
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural'; 
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ChairIcon from '@mui/icons-material/Chair'; 
import CheckroomIcon from '@mui/icons-material/Checkroom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WatchIcon from '@mui/icons-material/Watch';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FilterListIcon from '@mui/icons-material/FilterList';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'; 
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { alpha } from "@mui/material/styles";

import './App.css'; 

import Navbar from "./components/Navbar";
import FilterSidebar, { type FilterState } from "./components/FilterSidebar";
import Cart, { type CartItem } from "./components/Cart"; 
import ProductDetailsModal from "./components/ProductDetailsModal";
import CompareModal from "./components/CompareModal"; 
import Orders, { type Order } from "./components/Orders"; 
import UserPage from "./components/UserPage"; 

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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'smartphones': return <SmartphoneIcon />;
    case 'laptops': return <LaptopIcon />;
    case 'fragrances': 
    case 'beauty':
    case 'skin-care': return <FaceRetouchingNaturalIcon />;
    case 'groceries': return <LocalGroceryStoreIcon />;
    case 'home-decoration': 
    case 'furniture': return <ChairIcon />;
    case 'tops':
    case 'womens-dresses':
    case 'mens-shirts': return <CheckroomIcon />;
    case 'automotive':
    case 'motorcycle':
    case 'vehicle': return <DirectionsCarIcon />;
    case 'mens-watches':
    case 'womens-watches': return <WatchIcon />;
    case 'womens-bags': return <ShoppingBagIcon />;
    case 'womens-jewellery':
    case 'sunglasses': return <DiamondIcon />;
    default: return <FilterListIcon />;
  }
};

const banners = [
  { id: 1, title: "Christmas Mega Sale", subtitle: "Unwrap Up to 70% Off Deals!", image: "https://as1.ftcdn.net/jpg/04/56/64/30/1000_F_456643021_qslkgyyRmmz3UxHEnjRWROB6pxhndKJ4.jpg", color: "#d32f2f" },
  { id: 2, title: "Holiday Tech Gifts", subtitle: "The latest gadgets for everyone on your list", image: "https://images.pexels.com/photos/5872177/pexels-photo-5872177.jpeg?_gl=1*zg1q6a*_ga*MTk4MzkxNTM3Ny4xNzY1NTU5MjIx*_ga_8JE65Q40S6*czE3NjU1NTkyMjEkbzEkZzEkdDE3NjU1NTk2MDAkajI4JGwwJGgw", color: "#1976d2" },
  { id: 3, title: "Festive Looks & Scents", subtitle: "Shine bright this holiday season", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80", color: "#ed6c02" }
];

const HeroCarousel = ({ theme }: { theme: any }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setActiveStep((prev) => (prev + 1) % banners.length);
  const handleBack = () => setActiveStep((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <Box sx={{ position: "relative", width: "100%", height: { xs: 220, md: 420 }, overflow: "hidden", borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}>
      {banners.map((step, index) => (
        <Box
          key={step.id}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: index === activeStep ? 1 : 0,
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(${step.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start", 
            color: "white",
            px: { xs: 4, md: 8 }
          }}
        >
          <Stack spacing={2} maxWidth="600px">
            <Typography variant="h3" fontWeight={800} sx={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)", fontSize: { xs: "2rem", md: "3.5rem"}, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {step.title}
            </Typography>
            <Typography variant="h6" sx={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)", fontSize: { xs: "1.1rem", md: "1.5rem"}, fontWeight: 500, opacity: 0.95 }}>
              {step.subtitle}
            </Typography>
            <Button 
                variant="contained" 
                size="large" 
                sx={{ 
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                    fontWeight: 700, 
                    borderRadius: 10,
                    px: 4,
                    py: 1.5,
                    mt: 3,
                    width: "fit-content",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.9)", transform: "scale(1.02)" }
                }}
            >
              Shop Sale
            </Button>
          </Stack>
        </Box>
      ))}

      <IconButton 
        onClick={handleBack}
        sx={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", bgcolor: alpha(theme.palette.background.paper, 0.3), backdropFilter: "blur(10px)", color: "white", "&:hover": { bgcolor: alpha(theme.palette.background.paper, 0.5) } }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton 
        onClick={handleNext}
        sx={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", bgcolor: alpha(theme.palette.background.paper, 0.3), backdropFilter: "blur(10px)", color: "white", "&:hover": { bgcolor: alpha(theme.palette.background.paper, 0.5) } }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
      
      <Stack direction="row" spacing={1.5} sx={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
        {banners.map((_, index) => (
          <Box 
            key={index} 
            sx={{ 
              width: index === activeStep ? 24 : 8, 
              height: 8, 
              borderRadius: 4, 
              bgcolor: index === activeStep ? theme.palette.background.paper : alpha(theme.palette.background.paper, 0.4),
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.2)"
            }}
            onClick={() => setActiveStep(index)}
          />
        ))}
      </Stack>
    </Box>
  );
};

const CategorySlider = ({ categories, selectedCategory, onSelectCategory, darkMode = false, theme }: { categories: any[], selectedCategory: string, onSelectCategory: (cat: string) => void, darkMode?: boolean, theme: any }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400; 
            const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    return (
        <Box sx={{ my: 6 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary" sx={{ mb: 3 }}>
              Shop by Category
            </Typography>
            
            <Box sx={{ position: 'relative' }}>
                <IconButton 
                    onClick={() => scroll('left')} 
                    sx={{ 
                        position: 'absolute', 
                        left: -20, 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        zIndex: 2,
                        bgcolor: theme.palette.background.paper,
                        boxShadow: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {bgcolor: theme.palette.action.hover},
                        display: { xs: 'none', md: 'flex' }
                    }}
                >
                    <ChevronLeftIcon />
                </IconButton>

                <Stack 
                    ref={scrollContainerRef}
                    direction="row" 
                    spacing={2} 
                    sx={{ 
                        overflowX: 'auto', 
                        pb: 2, 
                        pt: 1,
                        px: 1,
                        '&::-webkit-scrollbar': { display: 'none' }, 
                        msOverflowStyle: 'none', 
                        scrollbarWidth: 'none',
                        scrollBehavior: 'smooth'
                    }}
                >
                    {categories.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                            <Paper
                                key={cat.id}
                                elevation={0}
                                onClick={() => onSelectCategory(cat.id)}
                                sx={{
                                    minWidth: 140,
                                    height: 120,
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    borderRadius: "20px", 
                                    cursor: 'pointer', 
                                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                    bgcolor: isSelected ? 'primary.main' : darkMode ? '#1a1a1a' : 'white', 
                                    color: isSelected ? 'white' : 'text.primary',
                                    border: isSelected ? '2px solid #00d9ff' : darkMode ? '1px solid rgba(0,217,255,0.2)' : '1px solid rgba(0,217,255,0.15)',
                                    boxShadow: isSelected 
                                      ? darkMode 
                                        ? '0 0 20px rgba(0,217,255,0.5), inset 0 0 10px rgba(0,217,255,0.1)'
                                        : '0 0 15px rgba(0,217,255,0.4)'
                                      : darkMode
                                        ? '0 0 10px rgba(0,217,255,0.2)'
                                        : 'none',
                                    '&:hover': { 
                                      transform: 'scale(1.05)', 
                                      boxShadow: darkMode
                                        ? '0 0 25px rgba(0,217,255,0.4), 0 10px 20px rgba(0,0,0,0.08)'
                                        : '0 0 15px rgba(0,217,255,0.3), 0 10px 20px rgba(0,0,0,0.08)',
                                      borderColor: '#00d9ff'
                                    }
                                }}
                            >
                                <Box sx={{ 
                                    color: isSelected ? 'white' : 'text.secondary', 
                                    mb: 1.5, 
                                    '& svg': { fontSize: 36 },
                                    opacity: isSelected ? 1 : 0.7
                                }}> 
                                    {cat.icon} 
                                </Box>
                                <Typography 
                                    variant="body2" 
                                    fontWeight={600} 
                                    color="inherit" 
                                    align="center"
                                    sx={{
                                        lineHeight: 1.2,
                                        px: 1,
                                        display: '-webkit-box',
                                        overflow: 'hidden',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 2, 
                                    }}
                                >
                                    {cat.name}
                                </Typography>
                            </Paper>
                        )
                    })}
                </Stack>

                <IconButton 
                    onClick={() => scroll('right')} 
                    sx={{ 
                        position: 'absolute', 
                        right: -20, 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        zIndex: 2,
                        bgcolor: theme.palette.background.paper,
                        boxShadow: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {bgcolor: theme.palette.action.hover},
                        display: { xs: 'none', md: 'flex' }
                    }}
                >
                    <ChevronRightIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

// --- Main App Component ---
export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#00d9ff' },
      secondary: { main: '#ff006e' },
      background: {
        default: '#f5f5f7',
        paper: '#ffffff',
      },
      text: {
        primary: '#1d1d1f',
        secondary: '#6f6f77',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundImage: 'linear-gradient(135deg, #00d9ff, #0071e3)',
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)',
            '&:hover': {
              boxShadow: '0 0 30px rgba(0, 217, 255, 0.8), 0 0 60px rgba(0, 217, 255, 0.4)',
              transform: 'scale(1.02)',
            },
          },
        },
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#00d9ff' },
      secondary: { main: '#ff006e' },
      background: {
        default: '#0a0a0a',
        paper: '#1a1a1a', 
      },
      text: {
        primary: '#f5f5f7',
        secondary: '#a1a1a6',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundImage: 'linear-gradient(135deg, #00d9ff, #0071e3)',
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.6), inset 0 0 20px rgba(0, 217, 255, 0.1)',
            '&:hover': {
              boxShadow: '0 0 40px rgba(0, 217, 255, 1), inset 0 0 20px rgba(0, 217, 255, 0.2)',
              transform: 'scale(1.02)',
            },
          },
        },
      },
    },
  });

  const theme = darkMode ? darkTheme : lightTheme;
  
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showHeroCarousel, setShowHeroCarousel] = useState(true);
  const [view, setView] = useState<'home' | 'cart' | 'orders' | 'user'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState("");
  
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    category: "",
    priceRange: [0, 100000], 
    sortBy: "",
    brands: [],     
    rating: null    
  });

  // --- Cart State with Local Storage ---
  // Load from LocalStorage on mount
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save to LocalStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const [compareList, setCompareList] = useState<Product[]>([]);
  const [errorMsg, setErrorMsg] = useState(""); 

  const [orders, setOrders] = useState<Order[]>([
    {
        id: "ORD-2023-8821",
        date: "Oct 12, 2023",
        status: "Completed",
        total: 15600,
        items: [
            { id: 99, title: "Wireless Headphones", price: 5200, quantity: 2, thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg" },
            { id: 98, title: "Mechanical Keyboard", price: 5200, quantity: 1, thumbnail: "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg" }
        ]
    }
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://dummyjson.com/products?limit=0"); 
        const data = await res.json();
        
        const exchangeRate = 59; 
        const modifiedProducts = data.products.map((product: Product) => ({
            ...product,
            price: product.price * exchangeRate
        }));

        setProducts(modifiedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const dynamicCategories = useMemo(() => {
    if (!products.length) return [];
    const uniqueCats = Array.from(new Set(products.map((p) => p.category))).sort();
    return uniqueCats.map(cat => ({
        id: cat,
        name: cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        icon: getCategoryIcon(cat)
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const isSingleLetter = searchTerm.length === 1;

      result = result.filter((p) => {
        const title = (p.title ?? "").toString().toLowerCase();
        const description = (p.description ?? "").toString().toLowerCase();
        const brand = (p.brand ?? "").toString().toLowerCase();
        const category = (p.category ?? "").toString().toLowerCase();

        if (isSingleLetter) {
          return (
            title.startsWith(searchLower) ||
            description.startsWith(searchLower) ||
            brand.startsWith(searchLower) ||
            category.startsWith(searchLower)
          );
        }

        return (
          title.includes(searchLower) ||
          description.includes(searchLower) ||
          brand.includes(searchLower) ||
          category.includes(searchLower)
        );
      });
    }

    if (activeFilters.category) result = result.filter((p) => p.category === activeFilters.category);
    result = result.filter((p) => p.price >= activeFilters.priceRange[0] && p.price <= activeFilters.priceRange[1]);
    
    if (activeFilters.brands && activeFilters.brands.length > 0) {
      result = result.filter((p) => activeFilters.brands.includes(p.brand));
    }

    if (activeFilters.rating) {
      result = result.filter((p) => p.rating >= activeFilters.rating!);
    }
    
    if (activeFilters.sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (activeFilters.sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    else if (activeFilters.sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [products, searchTerm, activeFilters]);

  const promotionProducts = filteredProducts.slice(0, 20);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail, quantity: quantity }];
    });
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const handleRemoveItem = (id: number) => setCartItems((prev) => prev.filter((item) => item.id !== id));

  const handleBuyNow = (product: Product, quantity: number) => {
    handleAddToCart(product, quantity);
    setView('cart'); 
    setSelectedProduct(null); 
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = totalAmount > 1000 ? 0 : 50;
    
    const newOrder: Order = {
        id: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        items: [...cartItems],
        total: totalAmount + shipping,
        status: "To Ship" 
    };

    setOrders([newOrder, ...orders]); 
    setCartItems([]); 
    setView('orders');
    setErrorMsg("Order placed successfully! 🚀");
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prevOrders => 
        prevOrders.map(order => 
            order.id === orderId 
                ? { ...order, status: 'Cancelled' as const } 
                : order
        )
    );
    setErrorMsg("Order cancelled successfully.");
  };

  const handleCategorySelect = (category: string) => {
    const newCategory = activeFilters.category === category ? "" : category;
    setActiveFilters(prev => ({...prev, category: newCategory}));
    setView('home');
  };

  // --- NEW: Go Home Handler (Soft Refresh) ---
  const handleGoHome = () => {
    setView('home');
    setSearchTerm(""); // Clear search
    setActiveFilters({ // Reset filters
      category: "",
      priceRange: [0, 100000],
      sortBy: "",
      brands: [],
      rating: null
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const isAlreadyIn = prev.some((p) => p.id === product.id);
      if (isAlreadyIn) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= 3) {
        setErrorMsg("You can only compare up to 3 items at once.");
        return prev;
      }
      if (prev.length > 0 && prev[0].category !== product.category) {
        setErrorMsg(`You can only compare items from the same category.`);
        return prev;
      }
      return [...prev, product];
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { width: "100%", height: "100%", margin: 0, padding: 0, overflowX: "hidden" },
          body: { width: "100%", height: "100%", margin: 0, padding: 0, backgroundColor: theme.palette.background.default }, 
          "#root": { width: "100%", maxWidth: "100vw !important", height: "100%", margin: "0 !important", padding: 0, display: "block" },
          ".MuiDrawer-root": { zIndex: "1400 !important" }, 
          ".MuiModal-root": { zIndex: "1400 !important" },
          ".MuiAppBar-root": { zIndex: "1200 !important" } 
        }}
      />

      <Box sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh", pt: { xs: '80px', md: '100px' }, pb: 12, overflowX: "hidden", width: "100%", transition: "background-color 0.3s ease" }}>
        
        <Navbar 
          search={searchTerm} 
          setSearch={setSearchTerm}
          products={products}
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
          onOpenFilter={() => setFiltersOpen(true)}
          onOpenCart={() => setView('cart')}
          onOpenOrders={() => setView('orders')}
          onOpenProfile={() => setView('user')} 
          onGoHome={handleGoHome} // FIX: Passing the soft refresh handler
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        <Snackbar 
            open={!!errorMsg} 
            autoHideDuration={4000} 
            onClose={() => setErrorMsg("")} 
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert 
                onClose={() => setErrorMsg("")} 
                severity={errorMsg.includes("successfully") ? "success" : "warning"} 
                sx={{ width: '100%', borderRadius: 3, boxShadow: 3 }}
            >
                {errorMsg}
            </Alert>
        </Snackbar>

        <ProductDetailsModal 
            open={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow} 
        />

        <CompareModal 
            open={isCompareOpen}
            onClose={() => setIsCompareOpen(false)}
            products={compareList}
            onAddToCart={(product) => {
                handleAddToCart(product);
                setIsCompareOpen(false); 
            }}
        />

        <FilterSidebar
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          products={products}
          onFilterChange={(newFilters) => setActiveFilters(newFilters)}
        />

        {view === 'cart' ? (
           <Cart 
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout} 
              onContinueShopping={handleGoHome}
           />
        ) : view === 'orders' ? (
           <Orders 
              orders={orders}
              darkMode={darkMode}
              onBack={handleGoHome}
              onCancelOrder={handleCancelOrder}
           />
        ) : view === 'user' ? (  
           <UserPage 
              onBack={handleGoHome} 
              darkMode={darkMode}
           />
        ) : (
           <Container maxWidth={false} sx={{ mt: 3, px: { xs: 2, md: 4, lg: 8 } }}>
              {showHeroCarousel && <HeroCarousel theme={theme} />}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, mt: 2 }}>
                <Button 
                  variant="contained" 
                  size="medium"
                  onClick={() => setShowHeroCarousel(!showHeroCarousel)}
                  sx={{ 
                    borderRadius: 10,
                    fontWeight: 700,
                    px: 3,
                    py: 1.2,
                    boxShadow: 3,
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  {showHeroCarousel ? '✕ Hide Banner' : '⊕ Show Banner'}
                </Button>
              </Box>
              
              <CategorySlider 
                categories={dynamicCategories} 
                selectedCategory={activeFilters.category} 
                onSelectCategory={handleCategorySelect}
                darkMode={darkMode}
                theme={theme}
              />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 3, mt: 6 }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', letterSpacing: '-0.5px' }}>
                    Flash Deals ⚡
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Limited time offers on top products
                  </Typography>
                </Box>
                <Button variant="outlined" onClick={() => setFiltersOpen(true)} startIcon={<FilterListIcon />} sx={{ display: { xs: 'flex', md: 'none' } }}>
                  Filters
                </Button>
              </Box>

              <Grid container spacing={3} columns={60} sx={{ width: '100%', m: 0 }}>
                {promotionProducts.map((product) => {
                  const isInCompare = compareList.some((p) => p.id === product.id);

                  return (
                    <Grid size={{ xs: 30, sm: 20, md: 15, lg: 12, xl: 10 }} key={product.id}>
                      <Card
                        onClick={() => setSelectedProduct(product)}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                          cursor: 'pointer',
                          overflow: 'hidden', 
                          borderRadius: "20px", 
                          
                          border: isInCompare 
                            ? "2px solid #00d9ff" 
                            : darkMode 
                                ? "1px solid rgba(0,217,255,0.3)" 
                                : "1px solid rgba(0,217,255,0.15)",
                          
                          backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          
                          "&:active": {
                            transform: "scale(0.96)",
                          },
                          "&:hover": {
                            boxShadow: darkMode 
                              ? "0 0 20px rgba(0,217,255,0.4), 0 8px 25px rgba(0,0,0,0.5)" 
                              : "0 0 15px rgba(0,217,255,0.3), 0 8px 25px rgba(0,0,0,0.1)",
                            borderColor: "#00d9ff",
                            transform: "translateY(-4px)",
                            zIndex: 10 
                          }
                        }}
                      >
                        {product.discountPercentage > 0 && (
                          <Chip 
                            label={`-${Math.round(product.discountPercentage)}%`} 
                            color="error" 
                            size="small" 
                            sx={{ position: "absolute", top: 12, left: 12, zIndex: 2, fontWeight: 700, fontSize: "0.75rem", boxShadow: 2 }} 
                          />
                        )}

                        <Box sx={{ position: 'relative', pt: 2, px: 2, bgcolor: 'transparent' }}>
                             <CardMedia 
                                component="img" 
                                height="180" 
                                image={product.thumbnail} 
                                alt={product.title} 
                                sx={{ 
                                    objectFit: "contain", 
                                    transition: "transform 0.4s ease",
                                    filter: darkMode ? "drop-shadow(0 5px 10px rgba(0,0,0,0.5))" : "none"
                                }} 
                             />
                        </Box>
                       
                        <CardContent sx={{ 
                          p: 2, 
                          flexGrow: 1, 
                          display: "flex", 
                          flexDirection: "column",
                          backgroundColor: 'inherit',
                          zIndex: 1
                        }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 0.5, textTransform: 'uppercase' }}>
                            {product.category}
                          </Typography>
                          <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.3, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, height: '2.6em' }} title={product.title}>
                            {product.title}
                          </Typography>

                          <Stack direction="row" alignItems="center" spacing={0.5} mb={1}>
                            <Rating value={product.rating} precision={0.5} size="small" readOnly sx={{ fontSize: "1rem", color: '#faaf00' }} />
                            <Typography variant="caption" color="text.secondary">({product.rating})</Typography>
                          </Stack>

                          <Box sx={{ flexGrow: 1 }} />

                          <Box display="flex" alignItems="flex-end" justifyContent="space-between" mt={2}>
                            <Box>
                              <Typography variant="h6" color="text.primary" fontWeight={700}>₱{product.price.toLocaleString()}</Typography>
                            </Box>
                            
                            <Box display="flex" gap={1}>
                                <Tooltip title={isInCompare ? "Remove" : "Compare"}>
                                    <IconButton 
                                        onClick={(e) => { e.stopPropagation(); handleToggleCompare(product); }}
                                        size="small"
                                        className="action-btn"
                                        sx={{ 
                                            border: '1px solid', 
                                            borderColor: isInCompare ? 'primary.main' : 'divider', 
                                            color: isInCompare ? 'primary.main' : 'text.secondary',
                                            bgcolor: isInCompare ? alpha("#0071e3", 0.1) : 'transparent',
                                            "&:hover": { borderColor: 'primary.main', color: 'primary.main' }
                                        }}
                                    >
                                        <CompareArrowsIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                <IconButton 
                                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                                    color="primary"
                                    size="small"
                                    className="action-btn"
                                    sx={{ 
                                        bgcolor: 'primary.main', 
                                        color: 'white', 
                                        '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.1)' }, 
                                        boxShadow: 2,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <AddShoppingCartIcon fontSize="small" />
                                </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
              
              {!loading && promotionProducts.length === 0 && (
                 <Paper sx={{ textAlign: "center", mt: 8, p: 5, borderRadius: 4, bgcolor: 'transparent', boxShadow: 'none' }}>
                   <Typography variant="h5" color="text.secondary" gutterBottom>No products found</Typography>
                 </Paper>
              )}
           </Container>
        )}

        {compareList.length > 0 && view !== 'cart' && (
            <Paper 
                elevation={4} 
                sx={{ 
                    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200, p: 2, 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3,
                    color: theme.palette.text.primary,
                    bgcolor: darkMode ? theme.palette.background.paper : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(20px)',
                    borderTop: `2px solid ${darkMode ? 'rgba(0,217,255,0.3)' : 'rgba(0,217,255,0.2)'}`,
                    boxShadow: darkMode
                      ? '0 -5px 20px rgba(0,0,0,0.5)'
                      : '0 -5px 20px rgba(0,0,0,0.1)',
                }}
            >
                <Typography fontWeight="600" variant="body1" sx={{ display: { xs: 'none', md: 'block' } }}>
                    Compare ({compareList.length}/3) - <span style={{color: theme.palette.primary.main}}>{compareList[0]?.category}</span>
                </Typography>
                
                <Stack direction="row" spacing={2}>
                    {compareList.map(p => (
                        <Box key={p.id} sx={{ position: 'relative' }}>
                              <Tooltip title={p.title}>
                                <Box component="img" src={p.thumbnail} sx={{ width: 48, height: 48, borderRadius: 2, objectFit: 'contain', border: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.paper, p: 0.5 }} />
                              </Tooltip>
                             <IconButton 
                                size="small" 
                                onClick={() => handleToggleCompare(p)}
                                sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'text.primary', color: 'white', width: 22, height: 22, '&:hover': { bgcolor: 'black' }, p: 0, boxShadow: 2 }}
                             >
                                <CloseIcon sx={{ fontSize: 14 }} />
                             </IconButton>
                        </Box>
                    ))}
                </Stack>

                <Button variant="contained" onClick={() => setIsCompareOpen(true)} disabled={compareList.length < 2}>
                    Compare Now
                </Button>
                <Button color="inherit" onClick={() => setCompareList([])} sx={{ display: { xs: 'none', sm: 'inline-flex' }, color: 'text.secondary' }}>
                    Clear
                </Button>
            </Paper>
        )}
      </Box>
    </ThemeProvider>
  );
}