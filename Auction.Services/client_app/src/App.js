import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import AuctionsPage from './components/pages/AuctionsPage';
import {ErrorProvider} from "./contexts/ErrorContext";
import {AuthProvider} from './contexts/AuthContext';
import AuctionViewPage from "./components/pages/AuctionViewPage";
import ProfilePage from "./components/pages/ProfilePage";
import DefaultPageLayout from "./components/DefaultPageLayout";
import CreateAuctionPage from "./components/pages/CreateAuctionPage";

const App = () => {
  return (
      <ErrorProvider>
          <AuthProvider>
              <Router>
                  <DefaultPageLayout>
                      <Routes>
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/register" element={<RegisterPage />} />
                          <Route path="/auctions" element={<AuctionsPage />} />
                          <Route path="/auctions/:auctionId" element={<AuctionViewPage />} />
                          <Route path="/auctions/new" element={<CreateAuctionPage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="" element={<AuctionsPage />} />
                      </Routes>
                  </DefaultPageLayout>
              </Router>
          </AuthProvider>
      </ErrorProvider>
  );
};

export default App;