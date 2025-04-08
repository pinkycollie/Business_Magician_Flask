import React from 'react';

const MVPSuccessStories: React.FC = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <i className="ri-home-smile-line text-primary text-xl"></i>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Airbnb</h4>
              <p className="text-xs text-slate-500">From MVP to Global Platform</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">Started as a simple website allowing the founders to rent out air mattresses in their apartment. Their MVP focused on solving one problem: helping people find affordable accommodations during conferences.</p>
          <div className="mt-4">
            <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1">
              Learn More <i className="ri-arrow-right-line"></i>
            </a>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <i className="ri-draft-line text-primary text-xl"></i>
            </div>
            <div>
              <h4 className="font-medium text-slate-900">DraftKings</h4>
              <p className="text-xs text-slate-500">Validating a Market Need</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">Started with a simple daily fantasy sports contest focused on a single sport. Their MVP validated the market demand for daily fantasy sports before expanding to multiple sports and betting options.</p>
          <div className="mt-4">
            <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1">
              Learn More <i className="ri-arrow-right-line"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MVPSuccessStories;
