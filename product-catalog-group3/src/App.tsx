import {
  Alert,
  Box,
  Container,
  Typography
} from "@mui/material";
import ProductSearch from "./components/ProductSearch";

function App() {
  return (

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <ProductSearch />
      </Container>
    
  )
}

export default App
