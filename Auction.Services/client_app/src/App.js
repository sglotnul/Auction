import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import AuctionsPage from './components/pages/AuctionsPage';
import {AuthProvider} from './contexts/AuthContext';
import AuctionViewPage from "./components/pages/AuctionViewPage";

const App = () => {
  return (
      <AuthProvider>
          <Router>
              <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/auctions" element={<AuctionsPage />} />
                  <Route path="/auctions/:auctionId" element={<AuctionViewPage />} />
                  <Route path="" element={<AuctionsPage />} />
              </Routes>
          </Router>
      </AuthProvider>
  );
};

export default App;