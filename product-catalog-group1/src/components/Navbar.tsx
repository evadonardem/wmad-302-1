import { 
  AppBar, 
  Toolbar, 
  Typography, 
  InputBase, 
  Box, 
  IconButton, 
  Badge,
  Paper,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Zoom,
  Avatar
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FilterListIcon from "@mui/icons-material/FilterList";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; 
import StorefrontIcon from '@mui/icons-material/Storefront'; 
import PersonIcon from '@mui/icons-material/Person';
import { alpha, styled, keyframes } from "@mui/material/styles";
import { useState, useMemo } from "react";

// --- Types ---
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

interface Props {
  search: string;
  setSearch: (value: string) => void;
  cartCount: number;      
  onOpenFilter: () => void; 
  onOpenCart: () => void;
  onOpenOrders: () => void; 
  onOpenProfile: () => void;
  onGoHome: () => void; // New prop to handle home navigation without reload
  products?: Product[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

// --- Animations ---
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// --- Styled Components ---
const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  padding: '8px 16px',
  borderRadius: '16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    animation: `${pulse} 1.5s infinite ease-in-out`,
    "& .logo-icon": {
      transform: "rotate(-10deg) scale(1.1)",
      color: theme.palette.primary.main,
    },
  }
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "24px",
  backgroundColor: alpha(theme.palette.mode === 'dark' ? '#00d9ff' : '#0071e3', 0.08),
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(0, 217, 255, 0.2)' : 'rgba(0, 113, 227, 0.1)'}`,
  "&:hover": {
    backgroundColor: alpha(theme.palette.mode === 'dark' ? '#00d9ff' : '#0071e3', 0.15),
    borderColor: theme.palette.mode === 'dark' ? 'rgba(0, 217, 255, 0.5)' : 'rgba(0, 113, 227, 0.3)',
    boxShadow: theme.palette.mode === 'dark' ? "0 0 20px rgba(0, 217, 255, 0.2)" : "0 4px 12px rgba(0,0,0,0.05)",
    width: "100%", 
    [theme.breakpoints.up("sm")]: { width: "400px" } 
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  zIndex: 1,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "320px", 
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.mode === 'dark' ? '#00d9ff' : theme.palette.text.secondary,
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    fontSize: "0.95rem",
    fontWeight: 500,
  },
}));

const SearchDropdown = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "calc(100% + 14px)",
  left: 0,
  right: 0,
  maxHeight: "450px",
  overflowY: "auto",
  borderRadius: "20px",
  zIndex: 10,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(0, 217, 255, 0.3)' : 'rgba(0,0,0,0.08)'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? "0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0, 217, 255, 0.15)"
    : "0 20px 40px rgba(0,0,0,0.1)",
  backdropFilter: "blur(20px)",
}));

const NavIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: "14px",
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": { 
    backgroundColor: theme.palette.mode === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  }
}));

export default function Navbar({ 
  search, 
  setSearch, 
  cartCount, 
  onOpenFilter, 
  onOpenCart, 
  onOpenOrders, 
  onOpenProfile, 
  onGoHome, // Destructured new prop
  products = [], 
  darkMode, 
  onToggleDarkMode 
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);

  // Get matching product names based on search
  const matchingProducts = useMemo(() => {
    if (products.length === 0) return [];
    
    if (!search) {
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 5);
    }
    
    const searchLower = (search ?? "").toLowerCase();
    const isSingleLetter = (search ?? "").length === 1;

    return products.filter((p) => {
      const title = (p.title ?? "").toString().toLowerCase();
      const brand = (p.brand ?? "").toString().toLowerCase();
      
      if (isSingleLetter) {
        return title.startsWith(searchLower) || brand.startsWith(searchLower);
      }
      return title.includes(searchLower) || brand.includes(searchLower);
    }).slice(0, 8); 
  }, [search, products]);

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        top: 0, left: 0, right: 0,
        backgroundColor: darkMode ? "rgba(10, 10, 10, 0.85)" : "rgba(255, 255, 255, 0.85)", 
        backdropFilter: "blur(20px) saturate(180%)", 
        borderBottom: darkMode ? "1px solid rgba(0, 217, 255, 0.2)" : "1px solid rgba(0,0,0,0.08)",
        boxShadow: darkMode ? "0 4px 30px rgba(0,0,0,0.5)" : "0 2px 10px rgba(0,0,0,0.05)",
        color: "text.primary",
        zIndex: 1201, 
        transition: "all 0.3s ease"
      }}
    >
      <Toolbar sx={{ py: 0.5, px: { xs: 1, sm: 2 } }}>
        
        {/* LOGO SECTION - Uses onGoHome to prevent reload */}
        <LogoContainer onClick={onGoHome}>
            <StorefrontIcon 
                className="logo-icon"
                sx={{ 
                    fontSize: 32, 
                    transition: 'all 0.3s ease',
                    color: 'text.primary'
                }} 
            />
            <Typography
            variant="h6"
            className="logo-text"
            noWrap
            component="div"
            sx={{ 
                display: { xs: "none", md: "block" }, 
                fontWeight: 800, 
                letterSpacing: "-0.5px", 
                background: darkMode 
                    ? "linear-gradient(45deg, #00d9ff 30%, #ffffff 90%)" 
                    : "linear-gradient(45deg, #0071e3 30%, #00d9ff 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% auto",
                transition: "background-position 0.5s ease",
            }}
            >
            Shop 'Til You Drop
            </Typography>
        </LogoContainer>

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: { xs: "center", sm: "flex-start" } }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon fontSize="small" />
            </SearchIconWrapper>
            <StyledInput
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            
            {showDropdown && matchingProducts.length > 0 && (
              <SearchDropdown elevation={4}>
                <List sx={{ py: 0 }}>
                  {!search && (
                    <ListItem sx={{ py: 1.5, px: 2, bgcolor: alpha('#000', 0.02) }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>SUGGESTED</Typography>
                    </ListItem>
                  )}
                  {matchingProducts.map((product) => (
                    <ListItem 
                      key={product.id}
                      onClick={() => { setSearch(product.title); setShowDropdown(false); }}
                      sx={{ 
                        py: 1.5, px: 2, cursor: "pointer", transition: "all 0.2s",
                        "&:hover": { bgcolor: "action.hover", pl: 3 }
                      }}
                    >
                      <ListItemText primary={product.title} secondary={product.brand} />
                    </ListItem>
                  ))}
                </List>
              </SearchDropdown>
            )}
          </Search>
        </Box>

        <Box sx={{ display: "flex", gap: 1.2, ml: 1, alignItems: 'center' }}>
          
          <Tooltip title="My Orders" TransitionComponent={Zoom} arrow>
            <NavIconButton onClick={onOpenOrders} size="medium" color="inherit">
                <ReceiptLongIcon fontSize="small" />
            </NavIconButton>
          </Tooltip>

          <Tooltip title="Filters" TransitionComponent={Zoom} arrow>
            <NavIconButton onClick={onOpenFilter} size="medium" color="inherit">
                <FilterListIcon fontSize="small" />
            </NavIconButton>
          </Tooltip>

          <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"} TransitionComponent={Zoom} arrow>
            <NavIconButton onClick={onToggleDarkMode} size="medium" color="inherit">
                {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </NavIconButton>
          </Tooltip>

          <Tooltip title="Cart" TransitionComponent={Zoom} arrow>
            <NavIconButton onClick={onOpenCart} size="medium" color="inherit">
                <Badge badgeContent={cartCount} color="error" sx={{ "& .MuiBadge-badge": { fontWeight: "bold" } }}>
                <ShoppingCartIcon fontSize="small" />
                </Badge>
            </NavIconButton>
          </Tooltip>

          {/* USER PROFILE - MOST RIGHT */}
          <Tooltip title="My Profile" TransitionComponent={Zoom} arrow>
            <IconButton 
                onClick={onOpenProfile} 
                sx={{ 
                    ml: 1,
                    p: 0.5,
                    border: '2px solid transparent',
                    transition: 'all 0.2s',
                    "&:hover": { 
                        borderColor: 'primary.main',
                        transform: 'scale(1.1)' 
                    }
                }}
            >
                <Avatar 
                    sx={{ 
                        width: 38, 
                        height: 38, 
                        bgcolor: 'primary.main',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #00d9ff, #0071e3)'
                    }}
                >
                    <PersonIcon sx={{ color: 'white' }} />
                </Avatar>
            </IconButton>
          </Tooltip>

        </Box>
      </Toolbar>
    </AppBar>
  );
}