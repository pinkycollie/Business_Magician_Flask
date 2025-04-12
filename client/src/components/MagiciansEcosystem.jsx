import React from 'react';
import { Link } from 'wouter';

/**
 * Simple ecosystem navigator component that doesn't rely on backend API calls
 */
const MagiciansEcosystem = () => {
  const services = [
    {
      id: 'business',
      name: 'Business Magician', 
      description: 'Start or grow your business with expert guidance',
      url: 'https://business.360magicians.com',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'job',
      name: 'Job Magician', 
      description: 'Find employment and advance your career',
      url: 'https://job.360magicians.com',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'vr4deaf',
      name: 'VR4Deaf', 
      description: 'Specialized vocational rehabilitation services',
      url: 'https://vr4deaf.360magicians.com',
      color: 'bg-green-500 hover:bg-green-600',
      isPilot: true
    }
  ];

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">360 Magicians Ecosystem</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {services.map((service) => (
          <div 
            key={service.id}
            className={`${service.color} p-4 rounded-md transition-all`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{service.name}</h3>
              {service.isPilot && (
                <span className="inline-block px-2 py-1 bg-yellow-500 text-xs font-semibold rounded">
                  PILOT
                </span>
              )}
            </div>
            <p className="text-sm text-gray-100 mt-1 mb-3">
              {service.description}
            </p>
            <a 
              href={service.url}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-3 py-1 bg-white text-gray-800 rounded text-sm font-medium"
            >
              Visit {service.id === 'vr4deaf' ? 'VR4Deaf' : service.name}
            </a>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-700 rounded-md">
        <h3 className="font-semibold mb-2">About the 360 Magicians Ecosystem</h3>
        <p className="text-sm text-gray-300">
          The 360 Magicians platform brings together specialized services for entrepreneurs and job seekers, 
          with a dedicated VR4Deaf pilot focusing on vocational rehabilitation. Each component is designed 
          to work independently while sharing resources and accessibility features.
        </p>
      </div>
      
      <div className="mt-4 text-center">
        <div className="inline-flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs">All services feature ASL support</span>
        </div>
      </div>
    </div>
  );
};

export default MagiciansEcosystem;