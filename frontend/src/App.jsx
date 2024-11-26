import React from 'react';
import SocialMediaPage from './Components/Pages/SocialMediaPage';
import EmailMarketingPage from './Components/Pages/EmailMarketingPage';
import HomePage from './Components/Pages/HomePage';
import LoginPage from './Components/Pages/LoginPage';
import CommunityPage from './Components/Pages/CommunityPage';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './Components/Pages/Context/AuthContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/email" element={<EmailMarketingPage />} />
              <Route path="/social" element={<SocialMediaPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
