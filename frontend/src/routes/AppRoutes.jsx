import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import ProtectedRoute from "../components/ProtectedRoute";


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
        element={
          <ProtectedRoute allowedRoles={["buyer"]}>
            <BuyerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer-dashboard"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <FarmerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
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
          <ProtectedRoute allowedRoles={["buyer"]}>
            <CheckoutPage />
          </ProtectedRoute>
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
