import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';

const EcosystemNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentService, setCurrentService] = useState('main');

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuth();
  }, []);

  const handleServiceNavigation = async (service) => {
    if (!isAuthenticated) {
      alert('Please log in to access this service.');
      return;
    }

    try {
      // Get SSO link to the selected service
      const response = await fetch('/api/get-service-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service }),
      });

      const data = await response.json();
      
      if (data.success) {
        // For internal navigation, use wouter
        if (service === 'main') {
          setCurrentService('main');
        } else {
          // For external services, redirect to the provided URL
          window.location.href = data.redirectUrl;
        }
      } else {
        console.error('Error getting service link:', data.error);
      }
    } catch (error) {
      console.error('Error navigating to service:', error);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">360 Magicians Ecosystem</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className={`p-4 rounded-md cursor-pointer transition-all hover:bg-blue-700 ${
            currentService === 'business' ? 'bg-blue-600' : 'bg-blue-500'
          }`}
          onClick={() => handleServiceNavigation('business')}
        >
          <h3 className="font-semibold text-lg">Business Magician</h3>
          <p className="text-sm text-gray-200 mt-1">
            Start or grow your business with expert guidance
          </p>
        </div>
        
        <div 
          className={`p-4 rounded-md cursor-pointer transition-all hover:bg-purple-700 ${
            currentService === 'job' ? 'bg-purple-600' : 'bg-purple-500'
          }`}
          onClick={() => handleServiceNavigation('job')}
        >
          <h3 className="font-semibold text-lg">Job Magician</h3>
          <p className="text-sm text-gray-200 mt-1">
            Find employment and advance your career
          </p>
        </div>
        
        <div 
          className={`p-4 rounded-md cursor-pointer transition-all hover:bg-green-700 ${
            currentService === 'vr4deaf' ? 'bg-green-600' : 'bg-green-500'
          }`}
          onClick={() => handleServiceNavigation('vr4deaf')}
        >
          <h3 className="font-semibold text-lg">VR4Deaf</h3>
          <p className="text-sm text-gray-200 mt-1">
            Specialized vocational rehabilitation services
          </p>
          <span className="inline-block px-2 py-1 bg-yellow-500 text-xs font-semibold rounded mt-2">
            PILOT PROGRAM
          </span>
        </div>
      </div>
      
      {!isAuthenticated && (
        <div className="mt-4 p-3 bg-yellow-600 rounded-md">
          <p className="text-sm">
            Please <Link href="/login"><a className="underline">log in</a></Link> to access all 360 Magicians services.
          </p>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <div className="inline-flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs">All services feature ASL support</span>
        </div>
      </div>
    </div>
  );
};

export default EcosystemNavigator;