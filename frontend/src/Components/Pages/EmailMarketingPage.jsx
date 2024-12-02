import React, { useState } from 'react';
import AnimatedGridBG from '../AnimatedGridBG';
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
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [emailForm, setEmailForm] = useState({
    companyName: '',
    purpose: '',
    triggerType: 'manual',
    additionalDetails: '',
    recipients: [],
    subject: '',
    body: ''
  });

  // Predefined company options
  const companyOptions = [
    'Tech Innovations Inc.',
    'Global Marketing Solutions',
    'E-commerce Dynamics',
    'Startup Accelerator',
    'Other'
  ];

  // Predefined purpose options
  const purposeOptions = [
    'Product Launch',
    'Seasonal Promotion',
    'Customer Retention',
    'Feedback Collection',
    'Partnership Announcement',
    'Other'
  ];

  const triggerTypeOptions = [
    { value: 'manual', label: 'Manual Send' },
    { value: 'subscription', label: 'New Subscription' },
    { value: 'cart_abandoned', label: 'Abandoned Cart' },
    { value: 'welcome', label: 'Welcome Email' },
    { value: 'reengagement', label: 'Re-engagement' }
  ];

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const handleNextTab = () => {
    // Validate first tab inputs before moving to next tab
    if (!emailForm.companyName || !emailForm.purpose) {
      showNotification('Please select company and purpose', 'error');
      return;
    }
    setActiveTab(prevTab => Math.min(prevTab + 1, 2));
  };

  const handlePreviousTab = () => {
    setActiveTab(prevTab => Math.max(prevTab - 1, 0));
  };
  

  const handleEmailGeneration = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://127.0.0.1:5000/generate_email', {
        companyName: emailForm.companyName,
        purpose: emailForm.purpose,
        triggerType: emailForm.triggerType,
        additionalDetails: emailForm.additionalDetails
      });

      showNotification('Email template generated successfully');
      
      // Update form with generated email details
      const generatedEmail = response.data.generated_email || '';
    
      // Try to separate subject and body (you might need to adjust this logic)
      const emailParts = generatedEmail.split('\n\n');
      const subject = emailParts.length > 0 ? emailParts[0] : '';
      const body = emailParts.length > 1 ? emailParts.slice(1).join('\n\n') : generatedEmail;
      
      // Update form with generated email details
      setEmailForm(prev => ({
        ...prev,
        subject: subject,
        body: body
      }));
      
      // Move to final tab
      setActiveTab(2);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to generate email';
      showNotification(errorMessage, 'error');
    }
  };

  const handleFinalSend = async (e) => {
    e.preventDefault();
    
    // Validate recipients
    if (!emailForm.recipients || emailForm.recipients.length === 0) {
      showNotification('Please enter at least one recipient email', 'error');
      return;
    }
    
    try {
      const response = await axios.post('https://marketmate.vercel.app/send_email', {
        ...emailForm
      });

      showNotification(response.data.message);
      
      // Reset form
      setEmailForm({
        companyName: '',
        purpose: '',
        triggerType: 'manual',
        additionalDetails: '',
        recipients: [], // Reset recipients
        subject: '',
        body: ''
      });

      // Reset to first tab
      setActiveTab(0);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send email';
      showNotification(errorMessage, 'error');
    }
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 0:
        return (
          <div>
            <div className="mb-4">
              <label htmlFor="companyName" className="block text-gray-400 mb-2">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                value={emailForm.companyName}
                onChange={(e) => setEmailForm({...emailForm, companyName: e.target.value})}
                className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none"
                placeholder="Enter your company name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="predefinedCompany" className="block text-gray-400 mb-2">
                Or Select from Predefined Companies
              </label>
              <select
                id="predefinedCompany"
                value={emailForm.companyName}
                onChange={(e) => setEmailForm({...emailForm, companyName: e.target.value})}
                className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none"
              >
                <option value="">Select a Company</option>
                {companyOptions.map((company) => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="purpose" className="block text-gray-400 mb-2">
                Email Purpose
              </label>
              <select
                id="purpose"
                value={emailForm.purpose}
                onChange={(e) => setEmailForm({...emailForm, purpose: e.target.value})}
                className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none"
                required
              >
                <option value="">Select Email Purpose</option>
                {purposeOptions.map((purpose) => (
                  <option key={purpose} value={purpose}>{purpose}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleNextTab}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 mt-4"
            >
              Next
            </button>
          </div>
        );
      case 1:
        return (
          <div>
            <div className="mb-4">
              <label htmlFor="triggerType" className="block text-gray-400 mb-2">
                Email Trigger Type
              </label>
              <select
                id="triggerType"
                value={emailForm.triggerType}
                onChange={(e) => setEmailForm({...emailForm, triggerType: e.target.value})}
                className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none"
              >
                {triggerTypeOptions.map((trigger) => (
                  <option key={trigger.value} value={trigger.value}>
                    {trigger.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="recipients" className="block text-gray-400 mb-2">
                Recipients Email Addresses (comma-separated)
              </label>
              <input
                type="text"
                id="recipients"
                value={emailForm.recipients.join(', ')}
                onChange={(e) => setEmailForm({
                  ...emailForm, 
                  recipients: e.target.value.split(',').map(email => email.trim())
                })}
                className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none"
                placeholder="Enter recipient email addresses"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="additionalDetails" className="block text-gray-400 mb-2">
                Additional Context/Details
              </label>
              <textarea
                id="additionalDetails"
                value={emailForm.additionalDetails}
                onChange={(e) => setEmailForm({...emailForm, additionalDetails: e.target.value})}
                className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none h-32"
                placeholder="Provide any additional context for email generation..."
              />
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={handlePreviousTab}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-300"
              >
                Previous
              </button>
              <button 
                onClick={handleEmailGeneration}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-300"
              >
                Generate Email Template
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-400 mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none"
                placeholder="Email Subject"
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
                placeholder="Email Body"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={handlePreviousTab}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-300"
              >
                Previous
              </button>
              <button 
                onClick={handleFinalSend}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300"
              >
                Send Email
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatedGridBG>
      <Notification message={notification.message} type={notification.type} />
      <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-6xl">
          <h1 className="text-3xl font-bold text-white mb-8">
            Email Marketing Automation
          </h1>

          <div className="w-full max-w-xl mx-auto bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl">
            {/* Tab Navigation */}
            <div className="flex mb-6">
              {['Company & Purpose', 'Trigger & Context', 'Email Preview'].map((tab, index) => (
                <button
                  key={tab}
                  className={`flex-1 py-2 px-4 ${
                    activeTab === index 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-400'
                  } ${index === 0 ? 'rounded-l-lg' : ''} ${index === 2 ? 'rounded-r-lg' : ''}`}
                  onClick={() => setActiveTab(index)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Dynamic Tab Content */}
            <form>
              {renderTabContent()}
            </form>
          </div>
        </div>
      </div>
    </AnimatedGridBG>
  );
};

export default EmailMarketingPage;