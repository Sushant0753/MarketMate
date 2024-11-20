import React, { useState } from 'react';
import AnimatedGridBG from '../AnimatedGridBG';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (isLogin) {
      // Login logic
      if (formData.email === 'user@example.com' && formData.password === 'password123') {
        // Successful login
        window.location.href = '/email';
      } else {
        setError('Invalid email or password');
      }
    } else {
      // Signup logic
      if (!formData.name) {
        setError('Name is required for signup');
        return;
      }
      // Simulate successful signup
      window.location.href = '/email';
    }
  };

  return (
    <AnimatedGridBG>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-gray-800/80  backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
          <h2 className="text-2xl text-white font-bold mb-6 text-center">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          
          {error && (
            <div className="bg-red-500/80 backdrop-blur-sm text-white p-3 rounded-lg mb-4 text-center text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
            )}
            <div className="space-y-1">
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-1">
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-medium transition-colors"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {isLogin 
                ? 'Need an account? Sign Up' 
                : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </AnimatedGridBG>
  );
};

export default LoginPage;