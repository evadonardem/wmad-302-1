import { useCallback, useEffect, useState, useRef } from "react";
import * as React from 'react';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "../configs/constants";
import {
    Badge,
    Box,
    Card,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    InputAdornment,
    Pagination,
    Paper,
    Rating,
    TextField,
    Tooltip,
    Typography,
    AppBar,
    MenuItem,
    Menu,
    Switch,
    Modal,
    Button
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Class, Discount, Inventory, Reviews, Search, Style, ShoppingCart, AccountCircle, Notifications, DarkMode, LightMode, DarkModeOutlined, LightModeOutlined, NotificationsOutlined, ShoppingCartOutlined, AccountCircleOutlined} from "@mui/icons-material";
import { SeachProducts } from "../api/ProductsAPI";
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import SideBar from './SideBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const usdFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

const ProductSearch = () => {

    const [products, setProducts] = useState([]);

    const [page, setPage] = useState(DEFAULT_PAGE);
    const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
    setAnchorEl(null);
  };

    const menuId = 'primary-search-account-menu';
    const isMenuOpen = Boolean(anchorEl);

    const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

    const [searchTerm, setSearchTerm] = useState('');
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearchProducts = useCallback(async (searchKey: string) => {
        const { page: updatedPage, perPage: updatePerPage, products, total, lastPage } = await SeachProducts({ searchKey, page, perPage });

        setProducts(products);
        setPage(updatedPage);
        setTotal(total);
        setPerPage(updatePerPage);
        setPages(lastPage);
        setIsLoading(false);
    }, [page, perPage]);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            await handleSearchProducts(searchTerm);
        };
        fetchProducts();
    }, [searchTerm, page, handleSearchProducts]);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [mode, setTheme] = useState(true);
    const customTheme = createTheme({
    palette: {
        mode: mode ? 'dark' : 'light'
    },
    components: {
        MuiAppBar: {
        styleOverrides: {
            root: {
            backgroundColor: mode ? '#e09508ff' : '#440d5eff',
            fontFamily: 'Helvetica',
            }
        },
        },
        MuiTextField: {
        styleOverrides: {
            root: {
            backgroundColor: mode ? '#212121' : '#ffffffff',
            fontFamily: 'Helvetica',
            }
        },
        },
        MuiCardMedia: {
           styleOverrides: {
            root: {
            backgroundColor: mode ? '#5e5e5eff' : '#ffffffff',
            fontFamily: 'Helvetica',
            borderRadius: 12,
            }   
        }, 
        },
        MuiModal: {
           styleOverrides: {
            root: {
            backgroundColor: mode ? '#5e5e5e54' : '#ffffffff',
            fontFamily: 'Helvetica',
            borderRadius: 12,
            }   
        }, 
        },
    }
    });

    const themeToggled = () => {
        if(mode) {
            setTheme(false);
        }
        else {
            setTheme(true);
        }
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        height : '45%',
        transform: 'translate(-50%, -50%)',
        width: 1200,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [item, addToCart] = useState(0);
    const cart = (name : string) => {
            addToCart(item + 1);
            alert(name + ' added to Cart')
    };

    return (
        <>
        <ThemeProvider theme={customTheme}>
            <CssBaseline />
                <Box>
                    <AppBar position="fixed">
                        <Toolbar>
                        <SideBar />
                        <Typography
                            fontWeight={'bold'}
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            Group 3 &nbsp; &nbsp; &nbsp; &nbsp; 
                        </Typography>
                            <TextField
                                size = "small"
                                sx = {{width: '70%'}}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    console.log(value);
                                    if (debounceTimer.current) {
                                        clearTimeout(debounceTimer.current);
                                    }
                                    debounceTimer.current = setTimeout(() => {
                                        setSearchTerm(value);
                                        setPage(1);
                                    }, 500);
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>,
                                    },
                                }}
                            />
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <IconButton color="inherit"  onClick={themeToggled}> 
                            {mode ? <DarkModeOutlined /> : <LightMode />}
                            </IconButton>
                            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                                <Badge badgeContent={item} color="error">
                                {mode ? <ShoppingCartOutlined /> : <ShoppingCart />}
                                </Badge>
                            </IconButton>
                            <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                            >
                            <Badge badgeContent={5} color="error">
                                {mode ? <NotificationsOutlined /> : <Notifications />}
                                
                            </Badge>
                            </IconButton>
                            <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                            >
                            {mode ? <AccountCircleOutlined /> : <AccountCircle />}
                            
                            </IconButton>
                        </Box>
                        </Toolbar>
                    </AppBar>
                    {renderMenu}
                </Box>

                    {!isLoading
                        ? <>
                            <Grid container spacing={4} sx={{ my: 12 }}>
                                {products.map(({
                                    id: productId,
                                    category,
                                    description,
                                    discountPercentage,
                                    price,
                                    rating,
                                    reviews,
                                    stock,
                                    tags,
                                    thumbnail,
                                    title,
                                    pic,
                                    meta: { qrCode }
                                }) => (
                                    <Grid key={`product-${productId}`} size={{
                                        xs: 12,
                                        sm: 6,
                                        md: 4,
                                        lg: 3,
                                    }}>
                                        <Card elevation={3} sx={{
                                            width: '105%',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'background-color 0.3s ease-in-out',
                                            '&:hover': {
                                                cursor : 'pointer',
                                                backgroundColor: mode ? 'warning.light' : 'success.light',
                                                backShadow: 6,
                                                transform: 'scale(1.02)',
                                            },
                                        }} >
                                            <CardMedia
                                                image={thumbnail}
                                                title={title}
                                                sx={{ height: 300 }}
                                                onClick={handleOpen}
                                            />
                                            <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                                                <Tooltip title={title}>
                                                    <Typography gutterBottom variant="h6" component="div" noWrap sx={{ fontWeight: 'bold' }}>
                                                        {title}
                                                    </Typography>
                                                </Tooltip>

                                                <Grid container spacing={2} >
                                                    <Grid display="flex" justifyContent="center" sx={{ flex: 1,  }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                            {discountPercentage > 0 && <>
                                                            <Typography display="flex" justifyContent="center" color="textDisabled" sx={{ fontWeight: 'bold', textDecoration: 'line-through' }}>
                                                                {usdFormatted.format(price)}
                                                            </Typography>
                                                            
                                                        </>}
                                                            {usdFormatted.format(price - (discountPercentage > 0 ? price * (discountPercentage / 100) : 0)) + "   "}
                                                            <Chip
                                                                label={` -${discountPercentage}%`}
                                                                color="error"
                                                                size="small"
                                                                icon={<Discount />}
                                                            />
                                                        </Typography>
                                                    </Grid>
                                                    {/* QR CODE */}
                                                    {/* <Grid sx={{ flex: 0.4 }}>
                                                        <Paper elevation={1}>
                                                            <img src={qrCode} width="100%" />
                                                        </Paper>
                                                    </Grid> */}
                                                </Grid>

                                                {/* <Divider sx={{ my: 2 }} />
                                                <Grid container alignItems="center" spacing={2} sx={{ my: 1 }}>
                                                    <Grid> */}
                                                        {/* icon={<Class />} */}
                                                        {/* <Chip  label={category} color="info" />
                                                    </Grid>
                                                    <Grid>
                                                        <Tooltip title={(tags as string[] || []).join(', ')} arrow>
                                                            <Badge badgeContent={stock || '0'} color={(stock || 0) > 0 ? 'success' : 'error'}>
                                                                <Inventory color="action" />
                                                            </Badge>
                                                        </Tooltip>
                                                    </Grid>
                                                    <Grid>
                                                        <Tooltip title={(tags as string[] || []).join(', ')} arrow>
                                                            <Badge badgeContent={(tags as string[] || []).length} color="secondary">
                                                                <Style color="action" />
                                                            </Badge>
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid> */}

                                                {/* <Divider sx={{ my: 2 }} />
                                                <Tooltip title={description}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                        }}
                                                    >
                                                        {description}
                                                    </Typography>
                                                </Tooltip> */}
                                                <Divider sx={{ my: 2 }} />
                                                <Tooltip title={`Rating: ${rating || 0}`}>
                                                    <Box display="flex" alignItems="center" gap={12}>
                                                        <Rating value={rating || 0} readOnly precision={0.01} />
                                                        {/* <Badge badgeContent={(reviews as string[] || []).length} color="info">
                                                            <Reviews color="action" />
                                                        </Badge> */}
                                                        <IconButton
                                                            onClick={() => cart(title)}
                                                        >
                                                            {mode ? <ShoppingCartOutlined /> : <ShoppingCart />}
                                                        </IconButton>
                                                    </Box>
                                                </Tooltip>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    
                                ))}
                                    <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    >
                                        <Box display={"flex"} margin={20}>
                                            <Box 
                                            display={"flex"} 
                                            justifyContent={"center"}
                                            height={200} 
                                            sx={modalStyle}>
                                                <Typography variant="h6" component="h2" sx={{ mr : 30, border : 12, padding: 12}} >
                                                    Product Image
                                                </Typography>
                                                <Typography variant="h6" component="h2" sx={{ ml : 30}}>
                                                    Product Name <br />
                                                    Product Description
                                                    <br />
                                                    <br />
                                                    <br />
                                                    <br />
                                                    <br />
                                                    <br />
                                                    <Button>
                                                        <Typography variant="h3" component="h2" sx={{bgcolor : 'warning.main', padding : 2, borderRadius : 4, color : 'white'}}>
                                                        Buy Now
                                                        </Typography>
                                                    </Button>
                                                </Typography>
                                                
                                                
                                            </Box>
                                            <Box textAlign={"center"}>
                                                <br />
                                                <Typography variant="h6" component="h2">
                                                    Currently Working on it
                                                    {/*  justifyContent={"center"} alignItems={"center"} */}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Modal>
                            </Grid>
                            
                            {pages > 1 && <Box alignContent="center" alignItems="center" display="flex" justifyContent="center" sx={{ my: 2 }}>
                                <Pagination page={page} count={pages} onChange={(_event, newPage) => setPage(newPage)} />
                                <Typography variant="caption">({total} items found.)</Typography>
                            </Box>}
                        </>
                        : <CircularProgress sx={{ display: 'block', margin: '30vh auto' }} />
                    }
            </ThemeProvider>
        </>
    );
};

export default ProductSearch;