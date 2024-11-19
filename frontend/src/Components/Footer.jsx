import React from 'react'

const Footer = () => {
    return (
      <footer className="bg-[#090909] text-white py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-lg font-bold mb-4 md:mb-0">MarketMate</div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-500">About</a>
            <a href="#" className="hover:text-blue-500">Contact</a>
            <a href="#" className="hover:text-blue-500">Privacy</a>
          </div>
        </div>
      </footer>
    );
};

export default Footer