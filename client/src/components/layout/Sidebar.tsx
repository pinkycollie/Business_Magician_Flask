import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';

interface LifecyclePhase {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [location] = useLocation();
  
  const { data: phases, isLoading } = useQuery<LifecyclePhase[]>({
    queryKey: ['/api/lifecycle-phases'],
  });

  // Get active phase from URL
  const activePath = location.split('/').pop() || '';

  const getPhaseIcon = (slug: string) => {
    switch (slug) {
      case 'idea':
        return 'ri-lightbulb-flash-line';
      case 'build':
        return 'ri-hammer-line';
      case 'grow':
        return 'ri-line-chart-line';
      case 'manage':
        return 'ri-settings-5-line';
      default:
        return 'ri-question-line';
    }
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-20 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <Link href="/">
            <a className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-sidebar-primary">
                <path d="M18 3L34.5 13.5V22.5L18 33L1.5 22.5V13.5L18 3Z" stroke="currentColor" strokeWidth="3" fill="none"/>
                <path d="M18 33V22.5M18 22.5L34.5 13.5M18 22.5L1.5 13.5M18 3L34.5 13.5M18 3L1.5 13.5" stroke="currentColor" strokeWidth="3" fill="none"/>
              </svg>
              <span className="text-lg font-bold text-sidebar-foreground">360 Business</span>
            </a>
          </Link>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-sidebar-foreground hover:bg-sidebar-accent/10 md:hidden"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            <Link href="/">
              <a className={`flex items-center px-3 py-2 rounded-md ${location === '/' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/10'}`}>
                <i className="ri-home-line mr-3 text-lg"></i>
                <span>Dashboard</span>
              </a>
            </Link>
          </div>

          <div className="mt-6">
            <h3 className="px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              Business Lifecycle
            </h3>
            <div className="mt-2 space-y-1">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center px-3 py-2 animate-pulse">
                    <div className="w-5 h-5 mr-3 bg-sidebar-accent/20 rounded-full"></div>
                    <div className="h-4 bg-sidebar-accent/20 rounded w-24"></div>
                  </div>
                ))
              ) : (
                phases?.map(phase => (
                  <Link key={phase.id} href={`/phases/${phase.slug}`}>
                    <a className={`flex items-center px-3 py-2 rounded-md ${activePath === phase.slug ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/10'}`}>
                      <i className={`${getPhaseIcon(phase.slug)} mr-3 text-lg`}></i>
                      <span>{phase.name}</span>
                    </a>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              Resources
            </h3>
            <div className="mt-2 space-y-1">
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/10">
                <i className="ri-sign-language-line mr-3 text-lg"></i>
                <span>ASL Videos</span>
              </a>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/10">
                <i className="ri-government-line mr-3 text-lg"></i>
                <span>SBA Resources</span>
              </a>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/10">
                <i className="ri-user-voice-line mr-3 text-lg"></i>
                <span>VR Services</span>
              </a>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border p-4">
          <a href="#" className="flex items-center px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/10">
            <i className="ri-settings-3-line mr-3 text-lg"></i>
            <span>Settings</span>
          </a>
          <a href="#" className="flex items-center px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/10">
            <i className="ri-question-line mr-3 text-lg"></i>
            <span>Help & Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
