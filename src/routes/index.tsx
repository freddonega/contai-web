import React from 'react';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/storage/authStorage';
import { DefaultLayout as Layout } from '@/layout/DefaultLayout';
import { ListCategories } from '@/pages/category/ListCategories';
import { CreateCategory } from '@/pages/category/CreateCategory';
import { CreateEntry } from '@/pages/entry/CreateEntry';
import { ListEntries } from '@/pages/entry/ListEntries';
import { CreateRecurringEntry } from '@/pages/recurringEntry/CreateRecurringEntry';
import { ListRecurringEntries } from '@/pages/recurringEntry/ListRecurringEntries';
import { ListPaymentTypes } from '@/pages/paymentType/ListPaymentTypes';
import { CreatePaymentType } from '@/pages/paymentType/CreatePaymentType';

export const AppRoutes = () => {
  const token = useAuthStore(state => state.token);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    return <Layout>{children}</Layout>;
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/" replace /> : <Register />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <ListCategories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories/edit/:id"
        element={
          <ProtectedRoute>
            <CreateCategory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories/create"
        element={
          <ProtectedRoute>
            <CreateCategory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/entries"
        element={
          <ProtectedRoute>
            <ListEntries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/entries/edit/:id"
        element={
          <ProtectedRoute>
            <CreateEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/entries/create"
        element={
          <ProtectedRoute>
            <CreateEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recurringEntries"
        element={
          <ProtectedRoute>
            <ListRecurringEntries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recurringEntries/edit/:id"
        element={
          <ProtectedRoute>
            <CreateRecurringEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recurringEntries/create"
        element={
          <ProtectedRoute>
            <CreateRecurringEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paymentTypes"
        element={
          <ProtectedRoute>
            <ListPaymentTypes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paymentTypes/edit/:id"
        element={
          <ProtectedRoute>
            <CreatePaymentType />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paymentTypes/create"
        element={
          <ProtectedRoute>
            <CreatePaymentType />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
