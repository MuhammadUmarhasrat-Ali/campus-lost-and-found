import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import HomePage from '../pages/HomePage';
import BrowseItemsPage from '../pages/BrowseItemsPage';
import ItemDetailsPage from '../pages/ItemDetailsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

import DashboardPage from '../pages/DashboardPage';
import ReportLostPage from '../pages/ReportLostPage';
import ReportFoundPage from '../pages/ReportFoundPage';
import EditItemPage from '../pages/EditItemPage';
import MyPostsPage from '../pages/MyPostsPage';
import ContactRequestsPage from '../pages/ContactRequestsPage';
import ProfilePage from '../pages/ProfilePage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowseItemsPage />} />
        <Route path="/items/:id" element={<ItemDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected Student Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-lost"
          element={
            <ProtectedRoute>
              <ReportLostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-found"
          element={
            <ProtectedRoute>
              <ReportFoundPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-item/:id"
          element={
            <ProtectedRoute>
              <EditItemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-posts"
          element={
            <ProtectedRoute>
              <MyPostsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact-requests"
          element={
            <ProtectedRoute>
              <ContactRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Administrator Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

