import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from './components/Header';
import Home from './components/Home';
import ProductBrowse from './components/ProductBrowse';
import Cart from './components/Cart';
import Footer from './components/Footer';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['Featured', 'All Products']);

  useEffect(() => {
    fetch('https://dummyjson.com/products/categories')
      .then(res => res.json())
      .then(data => {
        const categoryNames = data.map((cat: any) => {
          if (typeof cat === 'string') return cat;
          return cat.name || cat.slug || cat;
        });
        setCategories(['Featured', 'All Products', ...categoryNames]);
      })
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  const handleAddToCart = (product: any) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          image: product.images ? (product.images.length > 0 ? product.images[0] : '') : (product.image || '')
        }
      ];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    if (categoryName === 'Featured') {
      setCurrentPage('home');
    } else {
      setCurrentPage('browse');
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (searchValue: string) => {
    setSearchTerm(searchValue);
    if (searchValue.trim()) {
      setCurrentPage('browse');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Header
        cartCount={cartItems.length}
        onCartClick={() => setCartOpen(!cartOpen)}
        onSearchChange={handleSearchChange}
        onNavigate={handleNavigate}
        selectedCategory={selectedCategory}
        categories={categories}
        onCategoryChange={handleCategoryChange}
      />

      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {currentPage === 'home' && (
        <Home
          onCategoryChange={handleCategoryChange}
          onAddToCart={handleAddToCart}
        />
      )}

      {currentPage === 'browse' && (
        <ProductBrowse
          searchTerm={searchTerm}
          categoryName={selectedCategory}
          onAddToCart={handleAddToCart}
        />
      )}

      <Footer />
    </Box>
  );
}

export default App;
