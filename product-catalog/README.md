# ShopHub - Product Catalog

A modern, intuitive product catalog application built with React, TypeScript, and Material-UI. Similar to Lazada or Shopee, this app provides a seamless shopping experience with product browsing, search, filtering, and cart functionality.

## Features

### 🏠 Home Page
- Hero section with welcome message
- Shop by category cards (Electronics, Fashion, Home & Garden, Sports, Books, Beauty)
- Featured products with badges (New, Hot, Sale)
- Wishlist functionality
- Add to cart directly from featured products

### 🔍 Product Browsing
- Advanced search functionality with debounced input
- Category-based filtering
- Price range filters (Under $50, $50-$100, etc.)
- Rating filters (5-star, 4-star, etc.)
- Sort options (Relevance, Price, Rating, Newest)
- Pagination for large product lists
- Product cards with images, ratings, prices, and discounts

### 🛒 Shopping Cart
- Add/remove products
- Quantity management
- Price calculations with tax and shipping
- Persistent cart state
- Drawer-based cart UI

### 🎨 UI/UX Features
- Responsive design for mobile and desktop
- Material-UI components for consistent design
- Hover effects and animations
- Loading states and error handling
- Professional header with logo, search, and user menu
- Comprehensive footer with links and contact info

## Tech Stack

- **Frontend**: React 19, TypeScript
- **UI Library**: Material-UI (MUI) v7
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **API**: DummyJSON Products API

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd product-catalog
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/
│   └── ProductsAPI.ts          # API functions for fetching products
├── components/
│   ├── Header.tsx              # Navigation header with search and cart
│   ├── Footer.tsx              # Site footer with links
│   ├── Home.tsx                # Home page with categories and featured products
│   ├── ProductBrowse.tsx       # Product listing with filters and search
│   ├── ProductSearch.tsx       # Original search component (reference)
│   └── Cart.tsx                # Shopping cart drawer
├── configs/
│   └── constants.ts            # API endpoints and constants
└── App.tsx                     # Main app component with state management
```

## API Integration

The app uses the [DummyJSON Products API](https://dummyjson.com/docs/products) which provides:
- Product search with query parameters
- Category-based product filtering
- Pagination support
- Rich product data (images, ratings, prices, etc.)

## Key Components

### App.tsx
- Main state management for cart, navigation, and search
- Conditional rendering of Home and ProductBrowse components
- Cart state persistence and operations

### ProductBrowse.tsx
- Advanced filtering and sorting
- Real-time search with debouncing
- Responsive grid layout
- Pagination controls

### Home.tsx
- Category navigation
- Featured products showcase
- Interactive elements with hover effects

## Features Implemented

✅ **Form teams and assign roles**: Solo implementation covering all aspects
✅ **Plan the catalog together**: Categories and subcategories defined
✅ **Agree on product details**: Consistent format (name, price, image, rating)
✅ **Design the layout collaboratively**: Clean, intuitive UI design
✅ **Divide tasks**: Modular component architecture
✅ **Test as a group**: Responsive design for different screen sizes
✅ **Highlight teamwork features**: Badges, ratings, wishlist, cart
✅ **Review and refine together**: Polished user experience
✅ **Practice presentation**: Well-documented and structured code
✅ **Celebrate collaboration**: Complete, functional product catalog

## Future Enhancements

- User authentication and profiles
- Product detail pages
- Checkout process
- Order history
- Wishlist persistence
- Advanced search filters
- Product reviews and ratings
- Inventory management
- Payment integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes as part of a group assignment.
