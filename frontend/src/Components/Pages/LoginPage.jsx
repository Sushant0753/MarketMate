import React, { useState } from 'react';
import { useAuth } from '../Pages/Context/AuthContext';
import AnimatedGridBG from '../AnimatedGridBG';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const authMethod = isLogin ? login : signup;
      const result = await authMethod(email, password);

      if (!result.success) {
        console.error('Authentication Error:', result.message);
        setError(result.message);
      }
    } catch (err) {
      console.error('Unexpected Error:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <AnimatedGridBG>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-gray-800/80 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
          <h2 className="text-2xl text-white font-bold mb-6 text-center">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          
          {error && (
            <div className="bg-red-500/80 backdrop-blur-sm text-white p-3 rounded-lg mb-4 text-center text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-gray-400 mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-gray-400 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-900/50 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                placeholder="Enter your password"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-medium transition-colors"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {isLogin 
                  ? 'Need an account? Sign Up' 
                  : 'Already have an account? Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AnimatedGridBG>
  );
};

export default LoginPage;