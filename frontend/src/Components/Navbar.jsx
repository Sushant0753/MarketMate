import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Pages/Context/AuthContext'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
  
    const handleAuthAction = () => {
        if (isAuthenticated) {
            logout();
        }
    };

    return (
      <nav className="bg-[#090909] text-white p-4 relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">MarketMate</div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
  
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="hover:text-blue-500">Home</Link>
            <Link to="/email" className="hover:text-blue-500">Email Marketing</Link>
            <Link to="/social" className="hover:text-blue-500">Social Media</Link>
            {isAuthenticated ? (
              <button onClick={handleAuthAction} className="hover:text-blue-500">Logout</button>
            ) : (
              <Link to="/login" className="hover:text-blue-500">Login</Link>
            )}
          </div>
  
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-[#090909] md:hidden z-50">
              <div className="flex flex-col items-center space-y-4 p-4">
                <button onClick={() => {
                  window.location.href = '/';
                  setIsMenuOpen(false);
                }} className="hover:text-blue-500">Home</button>
                <button onClick={() => {
                  window.location.href = '/email';
                  setIsMenuOpen(false);
                }} className="hover:text-blue-500">Email Marketing</button>
                <button onClick={() => {
                  window.location.href = '/social';
                  setIsMenuOpen(false);
                }} className="hover:text-blue-500">Social Media</button>
                {isAuthenticated ? (
                  <button 
                    onClick={() => {
                      handleAuthAction();
                      setIsMenuOpen(false);
                    }} 
                    className="hover:text-blue-500"
                  >
                    Logout
                  </button>
                ) : (
                  <button onClick={() => {
                    window.location.href = '/login';
                    setIsMenuOpen(false);
                  }} className="hover:text-blue-500">Login</button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    );
};

export default Navbar;