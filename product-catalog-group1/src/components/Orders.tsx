import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
  Button,
  Divider,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Collapse,
  Grow,
  stepConnectorClasses,
  styled,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel'; 
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SearchOffIcon from '@mui/icons-material/SearchOff';

// --- Types ---
interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'To Ship' | 'To Receive' | 'Completed' | 'Cancelled';
}

interface OrdersProps {
  orders: Order[];
  darkMode: boolean;
  onBack: () => void;
  onCancelOrder: (orderId: string) => void;
}

// --- Helper Functions ---
const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  switch(status) {
    case 'To Ship': return 'warning';
    case 'To Receive': return 'info';
    case 'Completed': return 'success';
    case 'Cancelled': return 'error';
    default: return 'default';
  }
};

const getActiveStep = (status: string) => {
  switch(status) {
      case 'To Ship': return 1;
      case 'To Receive': return 2;
      case 'Completed': return 4;
      case 'Cancelled': return 0;
      default: return 0;
  }
};

const steps = ['Placed', 'Packed', 'Shipped', 'Delivered'];

// --- Styled Components ---
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.95rem',
  marginRight: theme.spacing(1),
  borderRadius: '50px',
  minHeight: 44,
  padding: '6px 24px',
  color: theme.palette.text.secondary,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 1,
  '&.Mui-selected': {
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
    boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.4)}`,
  },
  '&:hover': {
     backgroundColor: alpha(theme.palette.primary.main, 0.1),
  }
}));

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 22 },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: theme.palette.mode === 'dark' 
        ? 'linear-gradient( 95deg, #00d9ff 0%, #0071e3 100%)'
        : 'linear-gradient( 95deg, #0071e3 0%, #00d9ff 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: theme.palette.mode === 'dark' 
        ? 'linear-gradient( 95deg, #00d9ff 0%, #0071e3 100%)'
        : 'linear-gradient( 95deg, #0071e3 0%, #00d9ff 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 44,
  height: 44,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient( 136deg, #00d9ff 0%, #0071e3 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    transform: 'scale(1.1)',
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient( 136deg, #00d9ff 0%, #0071e3 100%)',
  }),
}));

function ColorlibStepIcon(props: any) {
  const { active, completed, className } = props;
  const icons: { [index: string]: React.ReactElement } = {
    1: <ReceiptIcon fontSize="small" />,
    2: <Inventory2OutlinedIcon fontSize="small" />,
    3: <LocalShippingIcon fontSize="small" />,
    4: <CheckCircleIcon fontSize="small" />,
  };
  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

// --- Main Component ---
// FIX: Removed ': React.FC<OrdersProps>' which causes conflicts with React.memo
const Orders = React.memo(({ orders, darkMode, onBack, onCancelOrder }: OrdersProps) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Confirmation Dialog State
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const tabs = ["All", "To Ship", "To Receive", "Completed", "Cancelled"];

  // Memoize filtered orders to prevent recalculation on every render
  const filteredOrders = useMemo(() => {
    return activeTab === 0 
      ? orders 
      : orders.filter(o => o.status === tabs[activeTab]);
  }, [orders, activeTab]);

  const handleExpandClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Handle opening the confirmation dialog
  const initiateCancel = (id: string) => {
    setSelectedOrderId(id);
    setCancelDialogOpen(true);
  };

  // Confirm cancellation
  const confirmCancel = () => {
    if (selectedOrderId) {
        onCancelOrder(selectedOrderId);
    }
    setCancelDialogOpen(false);
    setSelectedOrderId(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 12 }}>
      <Grow in={true}>
        <Box display="flex" alignItems="center" mb={3}>
            <IconButton onClick={onBack} sx={{ mr: 2, bgcolor: theme.palette.action.hover }}>
            <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight={800}>My Orders</Typography>
        </Box>
      </Grow>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={{ '& .MuiTabs-flexContainer': { gap: 1 } }}
          >
            {tabs.map((tab) => (
                <StyledTab key={tab} label={tab} />
            ))}
          </Tabs>
      </Box>

      <Box key={activeTab}>
          <Stack spacing={3}>
            {filteredOrders.length === 0 ? (
                <Grow in={true} timeout={500}>
                    <Box textAlign="center" py={8} sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderRadius: 4, border: `1px dashed ${theme.palette.divider}` }}>
                        <SearchOffIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" fontWeight={600}>No "{tabs[activeTab]}" orders found</Typography>
                    </Box>
                </Grow>
            ) : (
            filteredOrders.map((order) => (
                // FIX: Changed dynamic timeout to fixed timeout for speed
                <Grow in={true} timeout={500} key={order.id}>
                    <Card sx={{ 
                        borderRadius: 4,
                        bgcolor: darkMode ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                        boxShadow: darkMode ? 'none' : '0 4px 20px rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.01)' }
                    }}>
                    <Box sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h6" fontWeight={800}>Order #{order.id}</Typography>
                            <Typography variant="caption" color="text.secondary">{order.date} • {order.items.length} Items</Typography>
                        </Box>
                        <Chip label={order.status} color={getStatusColor(order.status)} variant={darkMode ? "outlined" : "filled"} sx={{ fontWeight: 700, borderRadius: 2 }} />
                    </Box>

                    {order.status !== 'Cancelled' && (
                        <Box sx={{ p: 3, display: { xs: 'none', md: 'block' } }}>
                            <Stepper alternativeLabel activeStep={getActiveStep(order.status)} connector={<ColorlibConnector />}>
                                {steps.map((label) => (
                                <Step key={label}><StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel></Step>
                                ))}
                            </Stepper>
                        </Box>
                    )}

                    <CardContent>
                        <Stack spacing={2}>
                            {order.items.map((item) => (
                                <Box key={item.id} display="flex" gap={2} alignItems="center">
                                    <CardMedia component="img" image={item.thumbnail} sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: theme.palette.action.hover, objectFit: 'contain', border: `1px solid ${theme.palette.divider}` }} />
                                    <Box flexGrow={1}>
                                        <Typography variant="subtitle2" fontWeight={700}>{item.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
                                    </Box>
                                    <Typography variant="subtitle2" fontWeight={700}>₱{(item.price * item.quantity).toLocaleString()}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </CardContent>
                    
                    <Divider />
                    
                    <Box p={2} display="flex" justifyContent="space-between" alignItems="center" bgcolor={theme.palette.action.hover}>
                         <Button onClick={() => handleExpandClick(order.id)} endIcon={expandedId === order.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} sx={{ textTransform: 'none', color: 'text.secondary' }}>
                            {expandedId === order.id ? "Hide Timeline" : "Track Order"}
                         </Button>
                         
                         {/* ACTIONS */}
                         <Box display="flex" gap={1}>
                            {order.status === 'To Ship' && (
                                <Button 
                                    color="error" 
                                    variant="outlined"
                                    onClick={() => initiateCancel(order.id)}
                                    sx={{ borderRadius: 8, textTransform: 'none', fontWeight: 600, px: 3 }}
                                >
                                    Cancel Order
                                </Button>
                            )}
                            <Typography variant="subtitle1" fontWeight={800} sx={{ ml: 2, alignSelf: 'center' }}>Total: ₱{order.total.toLocaleString()}</Typography>
                         </Box>
                    </Box>

                    <Collapse in={expandedId === order.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 3, bgcolor: theme.palette.background.paper }}>
                            <Typography variant="subtitle2" gutterBottom>Detailed Timeline</Typography>
                            <Stack spacing={2} sx={{ pl: 2, borderLeft: `2px solid ${theme.palette.divider}` }}>
                                <Box position="relative">
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main', position: 'absolute', left: -21, top: 5 }} />
                                    <Typography variant="body2" fontWeight={600}>
                                        {order.status === 'Cancelled' ? 'Order Cancelled by User' : order.status === 'Completed' ? 'Package Delivered' : 'Processing at Hub'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">Today</Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Collapse>
                    </Card>
                </Grow>
            ))
            )}
          </Stack>
      </Box>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Cancel Order?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} sx={{ fontWeight: 600, color: 'text.secondary' }}>No, Keep it</Button>
          <Button onClick={confirmCancel} color="error" variant="contained" sx={{ borderRadius: 6, fontWeight: 600 }}>Yes, Cancel Order</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
});

export default Orders;