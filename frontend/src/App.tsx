import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { Header } from "./components/layout/Header";
import { AgreementsSubNav } from "./components/layout/SubNav";
import { Dashboard } from "./components/dashboard/Dashboard";
import { LoginPage } from "./components/auth/LoginPage";
import { AgreementsList } from "./components/agreements/AgreementsList";
import { CreateAgreement } from "./components/agreements/CreateAgreement";
import { AgreementDetail } from "./components/agreements/AgreementDetail";

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner minHeight="100vh" />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Header />
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agreements"
        element={
          <ProtectedRoute>
            <Header />
            <AgreementsSubNav />
            <AgreementsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agreements/create"
        element={
          <ProtectedRoute>
            <Header />
            <AgreementsSubNav />
            <CreateAgreement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agreements/:id"
        element={
          <ProtectedRoute>
            <Header />
            <AgreementsSubNav />
            <AgreementDetail />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
