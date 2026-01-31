import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages (Allocated for next steps)
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateProduct from './pages/CreateProduct';
import Dashboard from './pages/Dashboard';
import Stock from './pages/Stock';
import Inward from './pages/Inward';
import Outward from './pages/Outward';
import Transfers from './pages/Transfers';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/products/new" element={<CreateProduct />} />
              <Route path="/inward" element={<Inward />} />
              <Route path="/outward" element={<Outward />} />
              <Route path="/transfers" element={<Transfers />} />
              <Route path="/reports" element={<div className='p-6'>Reports Feature Coming Soon</div>} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
