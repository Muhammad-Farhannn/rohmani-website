import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';

// Admin Pages
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminLogin from './pages/admin/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<div className="p-8">Settings Page Coming Soon</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
