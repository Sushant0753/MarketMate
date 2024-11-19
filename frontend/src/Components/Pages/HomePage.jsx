import React, { useState } from 'react';
import AnimatedGridBG from '../AnimatedGridBG';
import LoginPage from './LoginPage';

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleGetStarted = () => {
    setShowLogin(true);
  };

  if (showLogin) {
    return <LoginPage />;
  }

  return (
    <AnimatedGridBG>
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          {/* Green banner text */}
          <p className="text-emerald-400 text-lg mb-4 border-b border-emerald-400 inline-block pb-2">
            Community support, and thousands of builders - all on Discord.
          </p>
          
          {/* Main heading */}
          <h1 className="text-white text-6xl font-bold tracking-tight leading-tight mb-8">
            The Complete<br />
            Marketing Platform
          </h1>

          {/* Subheading */}
          <p className="text-gray-400 text-xl mb-8">
            Over 000,000 agents in production, powered by the latest LLMs.
          </p>

          {/* Call to action buttons */}
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleGetStarted} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center"
            >
              Get started for free
              <span className="ml-2">→</span>
            </button>
            <button className="border border-gray-700 hover:border-gray-600 text-white px-6 py-3 rounded-lg">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </AnimatedGridBG>
  );
};

export default HomePage;