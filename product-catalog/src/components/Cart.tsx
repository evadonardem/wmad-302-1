import {
  Drawer,
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  IconButton
} from "@mui/material";
import { Close, Delete, Add, Remove } from "@mui/icons-material";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

export default function Cart({
  open,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem
}: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Shopping Cart
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Divider />

        {/* Items */}
        <List sx={{ flex: 1, overflow: 'auto' }}>
          {items.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">Your cart is empty</Typography>
            </Box>
          ) : (
            items.map((item) => (
              <ListItem
                key={item.id}
                sx={{ py: 2, display: 'flex', gap: 2, borderBottom: '1px solid #eee' }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                />

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#FF6B6B', fontWeight: 'bold', mt: 0.5 }}>
                    ${item.price.toFixed(2)}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">{item.quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <IconButton
                  size="small"
                  onClick={() => onRemoveItem(item.id)}
                  sx={{ color: '#FF6B6B' }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </ListItem>
            ))
          )}
        </List>

        {items.length > 0 && (
          <>
            <Divider />

            {/* Summary */}
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Shipping</Typography>
                <Typography variant="body2" sx={{ color: shipping === 0 ? '#4CAF50' : '#666' }}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2">${tax.toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF6B6B' }}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#FF6B6B',
                  '&:hover': { backgroundColor: '#FF5252' },
                  fontWeight: 'bold',
                  mb: 1
                }}
              >
                Checkout
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={onClose}
                sx={{ textTransform: 'none' }}
              >
                Continue Shopping
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
