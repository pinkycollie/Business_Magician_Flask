import React from 'react';
import MagiciansEcosystem from '../components/MagiciansEcosystem';

const EcosystemPage = () => {
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
        
        <MagiciansEcosystem />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 border-t-4 border-blue-500">
            <h2 className="text-xl font-bold mb-3">Business Magician</h2>
            <p className="text-gray-700">
              Dedicated to supporting deaf entrepreneurs through the complete 
              business lifecycle - from idea generation to building, growing,
              and managing a business.
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 border-t-4 border-purple-500">
            <h2 className="text-xl font-bold mb-3">Job Magician</h2>
            <p className="text-gray-700">
              Helps deaf job seekers find, secure, and advance in employment 
              opportunities through job matching, skills development, and 
              workplace accommodation guidance.
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 border-t-4 border-green-500">
            <h2 className="text-xl font-bold mb-3">VR4Deaf Pilot</h2>
            <p className="text-gray-700">
              Provides specialized vocational rehabilitation services following
              the standard 5-step VR process, with particular focus on the unique
              needs of deaf and hard of hearing clients.
            </p>
          </div>
        </div>
        
        <div className="mt-10 p-6 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">VR Process</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li className="text-gray-700"><span className="font-semibold">Application and Intake:</span> Initial contact, information gathering, and needs assessment.</li>
            <li className="text-gray-700"><span className="font-semibold">Eligibility Determination:</span> Evaluation and assessment of qualification for VR services.</li>
            <li className="text-gray-700"><span className="font-semibold">Individualized Plan for Employment (IPE):</span> Developing a personalized roadmap for success.</li>
            <li className="text-gray-700"><span className="font-semibold">Service Provision:</span> Implementation of training, counseling, and support services.</li>
            <li className="text-gray-700"><span className="font-semibold">Employment and Follow-Up:</span> Job placement, retention support, and ongoing assistance.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default EcosystemPage;