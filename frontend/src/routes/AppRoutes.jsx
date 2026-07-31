import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { BuyerDashboardPage } from '../pages/BuyerDashboardPage';
import { FarmerDashboardPage } from '../pages/FarmerDashboardPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/login"
        element={
          <MainLayout>
            <LoginPage />
          </MainLayout>
        }
      />
      <Route
        path="/register"
        element={
          <MainLayout>
            <RegisterPage />
          </MainLayout>
        }
      />
      <Route
        path="/dashboard"
        element={<BuyerDashboardPage />}
      />
      <Route
        path="/farmer-dashboard"
        element={<FarmerDashboardPage />}
      />
      <Route
        path="/admin-dashboard"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/product/:productId"
        element={
          <MainLayout>
            <ProductDetailsPage />
          </MainLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <MainLayout>
            <CartPage />
          </MainLayout>
        }
      />
      <Route
        path="/checkout"
        element={
          <MainLayout>
            <CheckoutPage />
          </MainLayout>
        }
      />
      <Route
        path="*"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
    </Routes>
  );
};
