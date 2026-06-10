import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import AddProduct from './pages/farmer/AddProduct';
import ManageOrders from './pages/farmer/ManageOrders';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import ProductDetail from './pages/buyer/ProductDetail';
import MyOrders from './pages/buyer/MyOrders';
import AdminDashboard from './pages/admin/AdminDashboard';
import EditProduct from './pages/farmer/EditProduct';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* Farmer Routes */}
          <Route path="/farmer/dashboard" element={
            <ProtectedRoute role="farmer"><FarmerDashboard /></ProtectedRoute>
          } />
          <Route path="/farmer/add-product" element={
            <ProtectedRoute role="farmer"><AddProduct /></ProtectedRoute>
          } />
          <Route path="/farmer/orders" element={
            <ProtectedRoute role="farmer"><ManageOrders /></ProtectedRoute>
          } />

          {/* Buyer Routes */}
          <Route path="/buyer/dashboard" element={
            <ProtectedRoute role="buyer"><BuyerDashboard /></ProtectedRoute>
          } />
          <Route path="/buyer/product/:id" element={
            <ProtectedRoute role="buyer"><ProductDetail /></ProtectedRoute>
          } />
          <Route path="/buyer/orders" element={
            <ProtectedRoute role="buyer"><MyOrders /></ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/farmer/edit-product/:id" element={
  <ProtectedRoute role="farmer"><EditProduct /></ProtectedRoute>
} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;