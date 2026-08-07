import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { BuyerDashboardPage } from '../pages/BuyerDashboardPage';
import { FarmerDashboardPage } from '../pages/FarmerDashboardPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage';
import { TermsOfServicePage } from '../pages/TermsOfServicePage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderDetailsPage } from '../pages/OrderDetailsPage';
import { PaymentCallbackPage } from '../pages/PaymentCallbackPage';
import { OAuthCallbackPage } from '../pages/OAuthCallbackPage';
import { OrderSuccessPage } from '../pages/OrderSuccessPage';
import { PaymentFailedPage } from '../pages/PaymentFailedPage';
import ProtectedRoute from "../components/ProtectedRoute";
import { ErrorBoundary } from "../components/ErrorBoundary";



export const AppRoutes = () => {
  return (
    <ErrorBoundary>
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
        path="/forgot-password"
        element={
          <MainLayout>
            <ForgotPasswordPage />
          </MainLayout>
        }
      />
      <Route
        path="/reset-password"
        element={
          <MainLayout>
            <ResetPasswordPage />
          </MainLayout>
        }
      />
      <Route
        path="/oauth/callback"
        element={
          <MainLayout>
            <OAuthCallbackPage />
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
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsersPage />
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
        path="/products"
        element={
          <MainLayout>
            <ProductsPage />
          </MainLayout>
        }
      />
      <Route
        path="/categories"
        element={
          <MainLayout>
            <CategoriesPage />
          </MainLayout>
        }
      />
      <Route
        path="/about"
        element={
          <MainLayout>
            <AboutPage />
          </MainLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <MainLayout>
            <ContactPage />
          </MainLayout>
        }
      />
      <Route
        path="/privacy"
        element={
          <MainLayout>
            <PrivacyPolicyPage />
          </MainLayout>
        }
      />
      <Route
        path="/terms"
        element={
          <MainLayout>
            <TermsOfServicePage />
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
        path="/payment/callback"
        element={
          <ProtectedRoute allowedRoles={["buyer"]}>
            <PaymentCallbackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order/success"
        element={
          <ProtectedRoute allowedRoles={["buyer"]}>
            <OrderSuccessPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order/failed"
        element={
          <ProtectedRoute allowedRoles={["buyer"]}>
            <PaymentFailedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:orderId"
        element={
          <ProtectedRoute allowedRoles={["buyer"]}>
            <OrderDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/catalog"
        element={
          <ProtectedRoute allowedRoles={["buyer"]}>
            <BuyerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRoles={["buyer"]}>
            <BuyerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute allowedRoles={["buyer"]}>
            <BuyerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRoles={["buyer"]}>
            <BuyerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["buyer"]}>
            <BuyerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/crops"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <FarmerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/orders"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <FarmerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/analytics"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <FarmerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/wallet"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <FarmerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer/profile"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <FarmerDashboardPage />
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
    </ErrorBoundary>
  );
};