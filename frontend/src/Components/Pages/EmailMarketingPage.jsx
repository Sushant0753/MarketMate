import React from 'react';
import AnimatedGridBG from '../AnimatedGridBG';

const EmailMarketingPage = () => {
  const features = [
    {
      title: "Campaign Creation",
      description: "Design email campaigns using our intuitive drag-and-drop editor.",
      icon: "✉️"
    },
    {
      title: "Automation Triggers",
      description: "Set up automated email sends based on user behavior and time intervals.",
      icon: "⚡"
    },
    {
      title: "A/B Testing",
      description: "Optimize your campaigns with sophisticated split testing tools.",
      icon: "🔄"
    },
    {
      title: "Analytics & Reporting",
      description: "Track open rates, clicks, and conversions with detailed reports.",
      icon: "📊"
    }
  ];

  return (
    <AnimatedGridBG>
      <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Email Marketing Automation
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Create, automate, and optimize your email marketing campaigns
            </p>
          </div>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl hover:bg-gray-800/60 transition-all duration-300 border border-gray-700"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
                  {feature.title}
                </h2>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedGridBG>
  );
};

export default EmailMarketingPage;