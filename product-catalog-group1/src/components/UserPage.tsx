import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Grid, // In MUI v6, this defaults to Grid2
  Paper,
  Button,
  IconButton,
  TextField,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Fade,
  Grow,
  Zoom,
  Snackbar,
  Alert,
  useTheme,
  Divider,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { alpha } from '@mui/material/styles';

// --- Types ---
interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
  };
}

interface UserPageProps {
  onBack: () => void;
  darkMode: boolean;
}

const UserPage: React.FC<UserPageProps> = ({ onBack, darkMode }) => {
  const theme = useTheme();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  // Fetch User Data
  useEffect(() => {
    fetch('https://dummyjson.com/users/1') // Fetching a specific dummy user
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    setSnackbarMsg("Profile updated successfully!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarMsg("Copied to clipboard!");
  };

  // --- Render Helpers ---
  const glassEffect = {
    bgcolor: darkMode ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
    boxShadow: darkMode ? 'none' : '0 8px 32px rgba(0,0,0,0.05)',
    borderRadius: 4
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 4 }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 12 }}>
      {/* --- Header / Navigation --- */}
      <Grow in={true} timeout={400}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={onBack} sx={{ mr: 2, bgcolor: theme.palette.action.hover }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight={800}>My Profile</Typography>
          <Box flexGrow={1} />
          <Button 
            variant={isEditing ? "contained" : "outlined"} 
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            color={isEditing ? "success" : "primary"}
            sx={{ borderRadius: 8, textTransform: 'none', fontWeight: 600 }}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </Box>
      </Grow>

      <Grid container spacing={4}>
        {/* --- LEFT COLUMN: ID Card --- */}
        {/* FIX: Changed from 'item xs={12}' to 'size={{ xs: 12, ... }}' */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Zoom in={true} timeout={600}>
            <Paper sx={{ ...glassEffect, p: 4, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <Box 
                    sx={{ 
                        position: 'absolute', top: 0, left: 0, right: 0, height: 100, 
                        background: 'linear-gradient(135deg, #00d9ff 0%, #0071e3 100%)',
                        zIndex: 0
                    }} 
                />
                
                <Box position="relative" zIndex={1} mt={4}>
                    <Box position="relative" display="inline-block">
                        <Avatar 
                            src={user?.image} 
                            sx={{ width: 120, height: 120, border: `4px solid ${theme.palette.background.paper}`, boxShadow: 3, mb: 2 }} 
                        />
                        <IconButton 
                            size="small" 
                            sx={{ position: 'absolute', bottom: 15, right: 0, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                        >
                            <PhotoCameraIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    
                    <Typography variant="h5" fontWeight={700}>
                        {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        @{user?.username} • {user?.company.title}
                    </Typography>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Stack spacing={2} alignItems="flex-start">
                         <Box display="flex" alignItems="center" gap={2} width="100%">
                            <EmailIcon color="action" />
                            <Typography variant="body2" noWrap sx={{ flexGrow: 1, textAlign: 'left' }}>{user?.email}</Typography>
                            <IconButton size="small" onClick={() => copyToClipboard(user?.email || "")}><ContentCopyIcon fontSize="small" /></IconButton>
                         </Box>
                         <Box display="flex" alignItems="center" gap={2} width="100%">
                            <PhoneIcon color="action" />
                            <Typography variant="body2" sx={{ flexGrow: 1, textAlign: 'left' }}>{user?.phone}</Typography>
                         </Box>
                         <Box display="flex" alignItems="center" gap={2} width="100%">
                            <HomeIcon color="action" />
                            <Typography variant="body2" sx={{ textAlign: 'left' }}>{user?.address.city}, {user?.address.state}</Typography>
                         </Box>
                    </Stack>
                </Box>
            </Paper>
          </Zoom>
        </Grid>

        {/* --- RIGHT COLUMN: Details --- */}
        {/* FIX: Changed from 'item xs={12}' to 'size={{ xs: 12, ... }}' */}
        <Grid size={{ xs: 12, md: 8 }}>
            <Grow in={true} timeout={800}>
                <Paper sx={{ ...glassEffect, minHeight: 500 }}>
                    <Tabs 
                        value={activeTab} 
                        onChange={(_, v) => setActiveTab(v)} 
                        variant="fullWidth"
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab icon={<HomeIcon />} label="Personal" iconPosition="start" sx={{ minHeight: 60 }} />
                        <Tab icon={<AccountBalanceWalletIcon />} label="Payment" iconPosition="start" sx={{ minHeight: 60 }} />
                        <Tab icon={<SecurityIcon />} label="Security" iconPosition="start" sx={{ minHeight: 60 }} />
                    </Tabs>

                    <Box p={4}>
                        {/* TAB 0: Personal Info */}
                        {activeTab === 0 && (
                            <Fade in={activeTab === 0}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField 
                                            fullWidth label="First Name" variant="outlined" 
                                            defaultValue={user?.firstName} disabled={!isEditing}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField 
                                            fullWidth label="Last Name" variant="outlined" 
                                            defaultValue={user?.lastName} disabled={!isEditing}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField 
                                            fullWidth label="Birth Date" type="date"
                                            defaultValue={user?.birthDate} disabled={!isEditing}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField 
                                            fullWidth label="Gender" 
                                            defaultValue={user?.gender} disabled={!isEditing}
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField 
                                            fullWidth label="Address" multiline rows={2}
                                            defaultValue={`${user?.address.address}, ${user?.address.city}, ${user?.address.state} ${user?.address.postalCode}`} 
                                            disabled={!isEditing}
                                        />
                                    </Grid>
                                </Grid>
                            </Fade>
                        )}

                        {/* TAB 1: Payment (Credit Card Visual) */}
                        {activeTab === 1 && (
                            <Fade in={activeTab === 1}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Box 
                                        sx={{
                                            width: 340, height: 210, borderRadius: 4, p: 3, mb: 4,
                                            background: 'linear-gradient(120deg, #1a1a1a, #4a4a4a)',
                                            color: 'white', position: 'relative', boxShadow: 6,
                                            transition: 'transform 0.3s',
                                            '&:hover': { transform: 'scale(1.05) rotateY(5deg)' }
                                        }}
                                    >
                                        <Box display="flex" justifyContent="space-between" mb={4}>
                                            <Typography variant="h6" sx={{ opacity: 0.8, fontStyle: 'italic' }}>{user?.bank.cardType}</Typography>
                                            <AccountBalanceWalletIcon />
                                        </Box>
                                        <Typography variant="h5" sx={{ letterSpacing: 4, mb: 4, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                            •••• •••• •••• {user?.bank.cardNumber.slice(-4)}
                                        </Typography>
                                        <Box display="flex" justifyContent="space-between" mt="auto">
                                            <Box>
                                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Card Holder</Typography>
                                                <Typography variant="body1">{user?.firstName.toUpperCase()} {user?.lastName.toUpperCase()}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Expires</Typography>
                                                <Typography variant="body1">{user?.bank.cardExpire}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Button variant="outlined" color="inherit">Add New Method</Button>
                                </Box>
                            </Fade>
                        )}

                        {/* TAB 2: Security */}
                        {activeTab === 2 && (
                            <Fade in={activeTab === 2}>
                                <Stack spacing={3}>
                                     <TextField
                                        fullWidth label="Username"
                                        defaultValue={user?.username} disabled
                                     />
                                     <TextField
                                        fullWidth label="Password"
                                        type={showPassword ? "text" : "password"}
                                        defaultValue="secretpassword123"
                                        disabled={!isEditing}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                     />
                                     <Box sx={{ p: 2, bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 2, border: `1px solid ${theme.palette.error.main}` }}>
                                        <Typography color="error" fontWeight="bold" gutterBottom>Danger Zone</Typography>
                                        <Button color="error" variant="contained" size="small">Delete Account</Button>
                                     </Box>
                                </Stack>
                            </Fade>
                        )}
                    </Box>
                </Paper>
            </Grow>
        </Grid>
      </Grid>

      <Snackbar 
        open={!!snackbarMsg} 
        autoHideDuration={3000} 
        onClose={() => setSnackbarMsg("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>{snackbarMsg}</Alert>
      </Snackbar>
    </Container>
  );
};

export default UserPage;