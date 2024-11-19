import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SocialMediaPage from './Components/Pages/SocialMediaPage';
import EmailMarketingPage from './Components/Pages/EmailMarketingPage';
import HomePage from './Components/Pages/HomePage';
import LoginPage from './Components/Pages/LoginPage';
import CommunityPage from './Components/Pages/CommunityPage';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/email" element={<EmailMarketingPage />} />
            <Route path="/social" element={<SocialMediaPage />} />
            {/* <Route path="/community" element={<CommunityPage />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
