import React from 'react';
import AnimatedGridBG from '../AnimatedGridBG';

const CommunityPage = () => {
  const testimonials = [
    {
      username: "@SarahD",
      avatarInitial: "S",
      avatarColor: "bg-emerald-500",
      content: "The unlimited features and integrations available are incredible. Perfect for any workflow you want to implement - from basic automations to complex processes.",
    },
    {
      username: "@MikeR",
      avatarInitial: "M",
      avatarColor: "bg-blue-500",
      content: "The platform manages to be both accessible for beginners and powerful enough for advanced users. The community support is outstanding.",
    },
    {
      username: "@AlexK",
      avatarInitial: "A",
      avatarColor: "bg-purple-500",
      content: "Deployment efficiency is amazing. Got my first project up and running in minutes. The platform's optimization features are truly impressive.",
    },
    {
      username: "@JennyL",
      avatarInitial: "J",
      avatarColor: "bg-pink-500",
      content: "The community is incredibly supportive. Whether you're troubleshooting or sharing ideas, there's always someone ready to help.",
    },
    {
      username: "@DavidM",
      avatarInitial: "D",
      avatarColor: "bg-orange-500",
      content: "As a no-code enthusiast, I found the interface intuitive and powerful. The visual builder makes complex automation accessible.",
    },
    {
      username: "@CarolF",
      avatarInitial: "C",
      avatarColor: "bg-teal-500",
      content: "The integration capabilities are game-changing. Connecting with other platforms is seamless and the automation possibilities are endless.",
    },
    {
      username: "@RobertP",
      avatarInitial: "R",
      avatarColor: "bg-red-500",
      content: "From simple chatbots to complex AI implementations, the platform scales beautifully. The documentation and community resources are invaluable.",
    },
    {
      username: "@LisaT",
      avatarInitial: "L",
      avatarColor: "bg-indigo-500",
      content: "The platform's AI capabilities are cutting-edge. The way they've implemented generative AI support is revolutionary.",
    }
  ];

  return (
    <AnimatedGridBG>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-20">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gray-800/50 rounded-full">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-8 h-8 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Join the largest building community
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              A supportive network that shares ideas, troubleshoots issues, and fosters collaboration.
            </p>
            <button className="mt-8 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors duration-200">
              Join our Discord
            </button>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/40 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 ${testimonial.avatarColor} rounded-full flex items-center justify-center font-medium text-white`}>
                    {testimonial.avatarInitial}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-300">
                      {testimonial.username}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {testimonial.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedGridBG>
  );
};

export default CommunityPage;