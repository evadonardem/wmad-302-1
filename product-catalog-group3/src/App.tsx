import {
  Alert,
  Box,
  Container,
  Typography
} from "@mui/material";
import ProductSearch from "./components/ProductSearch";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const customTheme = createTheme({
  palette: {
    // You can set the overall mode (light or dark)
    mode: 'dark', 
    
    
    background: {
      default: '#212121'
    },
  },
  // components: {
  //   // the component name defined in the `name` parameter
  //   // of the `styled` API
  //   MuiCard: {
  //     styleOverrides: {
  //       // the slot name defined in the `slot` and `overridesResolver` parameters
  //       // of the `styled` API
  //       root: {
  //         backgroundColor: '#121212',
  //       }
  //     },
  //   },
  // }
});

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <ProductSearch />
      </Container>
    </ThemeProvider>
  )
}

export default App
