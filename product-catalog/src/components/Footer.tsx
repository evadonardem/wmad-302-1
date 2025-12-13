import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  Stack,
  Divider
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn
} from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a1a1a',
        color: '#fff',
        py: 6,
        mt: 8
      }}
    >
      <Container>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* About */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              About ShopHub
            </Typography>
            <Typography variant="body2" sx={{ color: '#bbb', mb: 2 }}>
              Your one-stop shop for everything. Premium products, great prices, and excellent customer service.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Facebook sx={{ cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }} />
              <Twitter sx={{ cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }} />
              <Instagram sx={{ cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }} />
              <LinkedIn sx={{ cursor: 'pointer', '&:hover': { color: '#FF6B6B' } }} />
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="none" sx={{ color: '#bbb', '&:hover': { color: '#FF6B6B' } }}>
                Home
              </Link>
              <Link href="#" underline="none" sx={{ color: '#bbb', '&:hover': { color: '#FF6B6B' } }}>
                Shop All Products
              </Link>
              <Link href="#" underline="none" sx={{ color: '#bbb', '&:hover': { color: '#FF6B6B' } }}>
                Best Sellers
              </Link>
              <Link href="#" underline="none" sx={{ color: '#bbb', '&:hover': { color: '#FF6B6B' } }}>
                New Arrivals
              </Link>
              <Link href="#" underline="none" sx={{ color: '#bbb', '&:hover': { color: '#FF6B6B' } }}>
                Sale
              </Link>
            </Stack>
          </Grid>

          {/* Customer Service */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Customer Service
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="none" sx={{ color: '#bbb', '&:hover': { color: '#FF6B6B' } }}>
                Contact Us
              </Link>
              <Link href="#" underline="none" sx={{ color: '#bbb', '&:hover': { color: '#FF6B6B' } }}>
                Shipping Info
              </Link>
              <Link href="#" underline="none" sx={{ color: '#bbb', '&:hover': { color: '#FF6B6B' } }}>
                Returns
              </Link>
              <Link href="#" underline="none" sx={{ color: '#bbb', '&:hover': { color: '#FF6B6B' } }}>
                FAQ
              </Link>
              <Link href="#" underline="none" sx={{ color: '#bbb', '&:hover': { color: '#FF6B6B' } }}>
                Track Order
              </Link>
            </Stack>
          </Grid>

          {/* Newsletter */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: '#bbb', mb: 2 }}>
              Subscribe to get special offers and updates!
            </Typography>
            <Stack spacing={1}>
              <TextField
                size="small"
                placeholder="Your email"
                variant="outlined"
                sx={{
                  backgroundColor: '#fff',
                  '& .MuiOutlinedInput-root': {
                    color: '#333'
                  }
                }}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#FF6B6B',
                  '&:hover': { backgroundColor: '#FF5252' }
                }}
              >
                Subscribe
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: '#444' }} />

        {/* Contact Info */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Phone sx={{ color: '#FF6B6B' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Phone
                </Typography>
                <Typography variant="body2" sx={{ color: '#bbb' }}>
                  1-800-SHOP-HUB
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Email sx={{ color: '#FF6B6B' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Email
                </Typography>
                <Typography variant="body2" sx={{ color: '#bbb' }}>
                  support@shophub.com
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <LocationOn sx={{ color: '#FF6B6B' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Address
                </Typography>
                <Typography variant="body2" sx={{ color: '#bbb' }}>
                  123 Shopping Street, Commerce City
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: '#444' }} />

        {/* Bottom */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ color: '#999' }}>
              © 2025 ShopHub. All rights reserved.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Stack direction="row" spacing={2} sx={{ justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Link href="#" underline="none" sx={{ color: '#bbb', '&:hover': { color: '#FF6B6B' } }}>
                Privacy Policy
              </Link>
              <Link href="#" underline="none" sx={{ color: '#bbb', '&:hover': { color: '#FF6B6B' } }}>
                Terms of Service
              </Link>
              <Link href="#" underline="none" sx={{ color: '#bbb', '&:hover': { color: '#FF6B6B' } }}>
                Sitemap
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
