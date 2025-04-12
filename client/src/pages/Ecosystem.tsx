import React from 'react';

/**
 * Simple ecosystem page for 360 Magicians
 */
const Ecosystem: React.FC = () => {
  const services = [
    {
      id: 'business',
      name: 'Business Magician', 
      description: 'Start or grow your business with expert guidance',
      url: 'https://business.360magicians.com',
      color: 'bg-blue-500 hover:bg-blue-600',
      features: [
        'Business idea generation',
        'Formation documents',
        'Growth strategies',
        'Financial planning'
      ]
    },
    {
      id: 'job',
      name: 'Job Magician', 
      description: 'Find employment and advance your career',
      url: 'https://job.360magicians.com',
      color: 'bg-purple-500 hover:bg-purple-600',
      features: [
        'Resume building',
        'Job matching',
        'Interview preparation',
        'Career advancement'
      ]
    },
    {
      id: 'vr4deaf',
      name: 'VR4Deaf', 
      description: 'Specialized vocational rehabilitation services',
      url: 'https://vr4deaf.360magicians.com',
      color: 'bg-green-500 hover:bg-green-600',
      isPilot: true,
      features: [
        'VR application assistance',
        'Eligibility determination',
        'IPE development',
        'Service provision',
        'Employment support'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">360 Magicians Ecosystem</h1>
        
        <div className="mb-8">
          <p className="text-lg text-gray-700 mb-4">
            The 360 Magicians platform evolves through three specialized components, 
            starting with Business and Job Magicians, and introducing the VR4Deaf 
            pilot for comprehensive vocational rehabilitation services.
          </p>
          
          <p className="text-lg text-gray-700">
            Each component is independently accessible while sharing a common foundation
            of accessibility features, ASL resources, and user support systems.
          </p>
        </div>
        
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Ecosystem Navigation</h2>
          
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
          
          <div className="mt-4 text-center">
            <div className="inline-flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs">All services feature ASL support</span>
            </div>
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`bg-white shadow-md rounded-lg p-6 border-t-4 ${
                service.id === 'business' ? 'border-blue-500' :
                service.id === 'job' ? 'border-purple-500' :
                'border-green-500'
              }`}
            >
              <h2 className="text-xl font-bold mb-3">{service.name}</h2>
              <p className="text-gray-700 mb-4">
                {service.description}
              </p>
              
              <h3 className="font-medium text-gray-800 mb-2">Key Features:</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-gray-100 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">VR Process</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li className="text-gray-700"><span className="font-semibold">Application and Intake:</span> Initial contact, information gathering, and needs assessment.</li>
            <li className="text-gray-700"><span className="font-semibold">Eligibility Determination:</span> Evaluation and assessment of qualification for VR services.</li>
            <li className="text-gray-700"><span className="font-semibold">Individualized Plan for Employment (IPE):</span> Developing a personalized roadmap for success.</li>
            <li className="text-gray-700"><span className="font-semibold">Service Provision:</span> Implementation of training, counseling, and support services.</li>
            <li className="text-gray-700"><span className="font-semibold">Employment and Follow-Up:</span> Job placement, retention support, and ongoing assistance.</li>
          </ol>
        </div>
        
        <div className="bg-gray-700 text-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-3">About the 360 Magicians Ecosystem</h2>
          <p className="text-gray-300">
            The 360 Magicians platform brings together specialized services for entrepreneurs and job seekers, 
            with a dedicated VR4Deaf pilot focusing on vocational rehabilitation. Each component is designed 
            to work independently while sharing resources and accessibility features.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-3 rounded">
              <h3 className="font-medium mb-2 text-blue-300">Business Magician</h3>
              <p className="text-sm text-gray-400">Empowering deaf entrepreneurs through the complete business lifecycle</p>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <h3 className="font-medium mb-2 text-purple-300">Job Magician</h3>
              <p className="text-sm text-gray-400">Connecting deaf professionals with employment opportunities</p>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <h3 className="font-medium mb-2 text-green-300">VR4Deaf Pilot</h3>
              <p className="text-sm text-gray-400">Specialized vocational rehabilitation for deaf individuals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ecosystem;