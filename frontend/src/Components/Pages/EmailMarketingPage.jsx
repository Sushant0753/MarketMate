import React, { useState } from 'react';
import AnimatedGridBG from '../AnimatedGridBG';
import { useAuth } from '../Pages/Context/AuthContext';
import axios from 'axios';

const Notification = ({ message, type }) => {
  return message ? (
    <div 
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg ${
        type === 'success' 
          ? 'bg-green-600 text-white' 
          : 'bg-red-600 text-white'
      }`}
    >
      {message}
    </div>
  ) : null;
};

const EmailMarketingPage = () => {
  const { logout } = useAuth();
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [emailForm, setEmailForm] = useState({
    recipients: '',
    subject: '',
    body: ''
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const handleEmailSend = async (e) => {
    e.preventDefault();
    
    const recipientsList = emailForm.recipients
      .split(',')
      .map(recipient => recipient.trim())
      .filter(recipient => recipient !== '');

    try {
      const response = await axios.post('https://marketmate.vercel.app/send_email', {
        recipients: recipientsList,
        subject: emailForm.subject,
        body: emailForm.body
      });

      showNotification(response.data.message);
      
      // Reset form
      setEmailForm({
        recipients: '',
        subject: '',
        body: ''
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send email';
      showNotification(errorMessage, 'error');
    }
  };

  return (
    <AnimatedGridBG>
      <Notification message={notification.message} type={notification.type} />
      <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Email Marketing Dashboard
            </h1>
            <button 
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>

          <form onSubmit={handleEmailSend} className="w-full max-w-xl mx-auto bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Send Email Campaign
            </h2>
            <div className="mb-4">
              <label htmlFor="recipients" className="block text-gray-400 mb-2">
                Recipients (comma-separated emails)
              </label>
              <input
                type="text"
                id="recipients"
                value={emailForm.recipients}
                onChange={(e) => setEmailForm({...emailForm, recipients: e.target.value})}
                className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none"
                placeholder="john@example.com, jane@example.com"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-400 mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none"
                placeholder="Email Campaign Subject"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="body" className="block text-gray-400 mb-2">Email Body</label>
              <textarea
                id="body"
                value={emailForm.body}
                onChange={(e) => setEmailForm({...emailForm, body: e.target.value})}
                className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none h-32"
                placeholder="Write your email content here..."
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300"
            >
              Send Email Campaign
            </button>
          </form>
        </div>
      </div>
    </AnimatedGridBG>
  );
};

export default EmailMarketingPage;