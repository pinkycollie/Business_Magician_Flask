import React from 'react';
import { Link } from 'wouter';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <a className="flex items-center gap-2">
              <div className="flex items-center">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M18 3L34.5 13.5V22.5L18 33L1.5 22.5V13.5L18 3Z" stroke="currentColor" strokeWidth="3" fill="none"/>
                  <path d="M18 33V22.5M18 22.5L34.5 13.5M18 22.5L1.5 13.5M18 3L34.5 13.5M18 3L1.5 13.5" stroke="currentColor" strokeWidth="3" fill="none"/>
                </svg>
                <span className="text-xl font-bold ml-2 font-heading text-slate-900">360 Business Magician</span>
              </div>
            </a>
          </Link>
          <div className="flex items-center gap-2">
            <button type="button" className="p-2 rounded-full hover:bg-slate-100" aria-label="Search">
              <i className="ri-search-line text-xl"></i>
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-slate-100" aria-label="Notifications">
              <i className="ri-notification-3-line text-xl"></i>
            </button>
            <div className="relative ml-2">
              <button type="button" className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">BM</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
