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

      <Alert severity="info" sx={{ mb: 4 }} icon={false}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Group Tasks
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Create an intuitive product catalog project (like{' '}
          <Typography
            component="a"
            href="https://www.lazada.com.ph/"
            target="_blank"
            rel="noreferrer"
            sx={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Lazada
          </Typography>
          {' '}or{' '}
          <Typography
            component="a"
            href="https://www.shopee.ph/"
            target="_blank"
            rel="noreferrer"
            sx={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Shopee
          </Typography>
          ).
        </Typography>

        <Box component="ul" sx={{ pl: 2, mb: 1 }}>
          <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
            <strong>Form teams and assign roles</strong>: Decide who will focus on design, data, coding, testing, and presentation.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
            <strong>Plan the catalog together</strong>: Brainstorm categories and subcategories (e.g., fashion, electronics, food) as a group.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
            <strong>Agree on product details</strong>: Standardize what information to show (name, price, image, rating) so everyone follows the same format.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
            <strong>Design the layout collaboratively</strong>: Sketch how the catalog should look on paper or whiteboard before coding.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
            <strong>Divide tasks</strong>: Some members build the navigation and search bar, others work on product cards, while others handle filters or promotions.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
            <strong>Test as a group</strong>: Each member tries the catalog on different devices (phone, laptop) and shares feedback.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
            <strong>Highlight teamwork features</strong>: Add elements like "best seller" badges or "flash sale" banners that make the catalog engaging.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
            <strong>Review and refine together</strong>: Discuss what feels intuitive, what's confusing, and adjust based on group consensus.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
            <strong>Practice presentation</strong>: Prepare to explain the catalog's design choices, teamwork process, and user experience improvements.
          </Typography>
          <Typography component="li" variant="body2">
            <strong>Celebrate collaboration</strong>: Recognize each member's contribution and reflect on what the group learned.
          </Typography>
        </Box>

        
        <Typography sx={{ fontWeight: 'bold', mt: 4, mb: 1 }}>
          Prerequisites for this task:
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 0 }}>
          <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
            Basic understanding of React and Material-UI.
          </Typography>
          <Typography component="li" variant="body2">
            Familiarity with fetching data from APIs using Axios or Fetch API.
          </Typography>
        </Box>

        <Typography sx={{ fontWeight: 'bold', mt: 4, mb: 1 }}>
          Dependencies for this task:
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 0 }}>
          <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
            Use <a href="https://dummyjson.com/docs/products" target="_blank" rel="noreferrer">dummyjson.com products API</a>
            for the dataset.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
            Use <a href="https://mui.com/material-ui/all-components/" target="_blank" rel="noreferrer">Material UI components</a> for building the UI.
          </Typography>
        </Box>
      </Alert>

      <Typography variant="body2" margin="auto" textAlign="center" width="75%" sx={{ mb: 4, fontStyle: 'italic' }}>
        Review the sample implementation below. Treat it as a reference guide and starting point only.<br/>
        Feel free to enhance and customize the product catalog to showcase your team's creativity and skills!
      </Typography>
      
      <ProductSearch />

    </Container>
  )
}

export default App
