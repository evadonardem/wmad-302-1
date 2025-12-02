import { useCallback, useEffect, useState, useRef } from "react";
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
    Typography
} from "@mui/material";
import { Class, Discount, Inventory, Reviews, Search, Style } from "@mui/icons-material";
import { SeachProducts } from "../api/ProductsAPI";

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

    return (
        <>
            <TextField
                fullWidth
                onChange={(e) => {
                    const value = e.target.value;
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

            {!isLoading
                ? <>
                    {pages > 1 && <Box alignContent="center" alignItems="center" display="flex" justifyContent="center" sx={{ my: 2 }}>
                        <Pagination page={page} count={pages} onChange={(_event, newPage) => setPage(newPage)} />
                        <Typography variant="caption">({total} items found.)</Typography>
                    </Box>}
                    <Grid container spacing={2} sx={{ my: 2 }}>
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
                            meta: { qrCode }
                        }) => (
                            <Grid key={`product-${productId}`} size={{
                                xs: 12,
                                sm: 6,
                                md: 4,
                                lg: 3,
                            }}>
                                <Card elevation={3} sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'background-color 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: 'secondary.light',
                                        backShadow: 6,
                                        transform: 'scale(1.02)',
                                    },
                                }}>
                                    <CardMedia
                                        image={thumbnail}
                                        title={title}
                                        sx={{ height: 300 }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                                        <Tooltip title={title}>
                                            <Typography gutterBottom variant="h6" component="div" noWrap sx={{ fontWeight: 'bold' }}>
                                                {title}
                                            </Typography>
                                        </Tooltip>

                                        <Grid container spacing={2}>
                                            <Grid sx={{ flex: 0.6 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                    {usdFormatted.format(price - (discountPercentage > 0 ? price * (discountPercentage / 100) : 0))}
                                                </Typography>


                                                {discountPercentage > 0 && <>
                                                    <Typography color="textDisabled" sx={{ fontWeight: 'bold', textDecoration: 'line-through' }}>
                                                        {usdFormatted.format(price)}
                                                    </Typography>
                                                    <Chip
                                                        label={`-${discountPercentage}%`}
                                                        color="error"
                                                        size="small"
                                                        icon={<Discount />}
                                                    />
                                                </>}
                                            </Grid>
                                            <Grid sx={{ flex: 0.4 }}>
                                                <Paper elevation={1}>
                                                    <img src={qrCode} width="100%" />
                                                </Paper>
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 2 }} />
                                        <Grid container alignItems="center" spacing={2} sx={{ my: 1 }}>
                                            <Grid>
                                                <Chip icon={<Class />} label={category} color="secondary" />
                                            </Grid>
                                            <Grid>
                                                <Badge badgeContent={stock || '0'} color={(stock || 0) > 0 ? 'success' : 'error'}>
                                                    <Inventory color="action" />
                                                </Badge>
                                            </Grid>
                                            <Grid>
                                                <Tooltip title={(tags as string[] || []).join(', ')} arrow>
                                                    <Badge badgeContent={(tags as string[] || []).length} color="secondary">
                                                        <Style color="action" />
                                                    </Badge>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 2 }} />
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
                                        </Tooltip>
                                        <Divider sx={{ my: 2 }} />
                                        <Tooltip title={`Rating: ${rating || 0}`}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Rating value={rating || 0} readOnly precision={0.01} />
                                                <Badge badgeContent={(reviews as string[] || []).length} color="info">
                                                    <Reviews color="action" />
                                                </Badge>
                                            </Box>
                                        </Tooltip>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    {pages > 1 && <Box alignContent="center" alignItems="center" display="flex" justifyContent="center" sx={{ my: 2 }}>
                        <Pagination page={page} count={pages} onChange={(_event, newPage) => setPage(newPage)} />
                        <Typography variant="caption">({total} items found.)</Typography>
                    </Box>}
                </>
                : <CircularProgress sx={{ display: 'block', margin: '30vh auto' }} />
            }
        </>
    );
};

export default ProductSearch;