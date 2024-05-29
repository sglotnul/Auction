import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import AuctionsPage from './components/pages/AuctionsPage';
import {ErrorProvider} from "./contexts/ErrorContext";
import {AuthProvider} from './contexts/AuthContext';
import AuctionViewPage from "./components/pages/AuctionViewPage";
import DefaultPageLayout from "./components/DefaultPageLayout";
import AuctionCreatePage from "./components/pages/AuctionCreatePage";
import AuctionEditPage from "./components/pages/AuctionEditPage";
import ProfilePage from "./components/pages/ProfilePage";
import AdminPage from "./components/admin/AdminPage";

const App = () => {
  return (
      <ErrorProvider>
      <AuthProvider>
          <Router>
              <DefaultPageLayout>
                  <Routes>
                      <Route path="/admin/*" element={<AdminPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/profile/:userName" element={<ProfilePage />} />
                      <Route path="/auctions" element={<AuctionsPage />} />
                      <Route path="/auctions/:auctionId" element={<AuctionViewPage />} />
                      <Route path="/auctions/:auctionId/edit" element={<AuctionEditPage />} />
                      <Route path="/auctions/new" element={<AuctionCreatePage />} />
                      <Route path="*" element={<Navigate to="/auctions" />} />
                  </Routes>
              </DefaultPageLayout>
          </Router>
      </AuthProvider>
      </ErrorProvider>
  );
};

export default App;