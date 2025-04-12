import React from 'react';
import { Link } from 'wouter';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="flex items-center">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M18 3L34.5 13.5V22.5L18 33L1.5 22.5V13.5L18 3Z" stroke="currentColor" strokeWidth="3" fill="none"/>
                <path d="M18 33V22.5M18 22.5L34.5 13.5M18 22.5L1.5 13.5M18 3L34.5 13.5M18 3L1.5 13.5" stroke="currentColor" strokeWidth="3" fill="none"/>
              </svg>
              <span className="text-xl font-bold ml-2 font-heading text-slate-900">360 Business Magician</span>
            </div>
          </div>
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex space-x-8">
              <li>
                <Link href="/" className="text-slate-600 hover:text-primary font-medium">
                  Home
                </Link>
              </li>
              <li className="group relative">
                <Link href="/phases/idea" className="text-slate-600 hover:text-primary font-medium">
                  Business Lifecycle
                </Link>
                <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md py-2 hidden group-hover:block">
                  <div className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary cursor-pointer" onClick={() => window.location.href = '/phases/idea'}>
                    Idea Phase
                  </div>
                  <div className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary cursor-pointer" onClick={() => window.location.href = '/phases/build'}>
                    Build Phase
                  </div>
                  <div className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary cursor-pointer" onClick={() => window.location.href = '/phases/grow'}>
                    Grow Phase
                  </div>
                  <div className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary cursor-pointer" onClick={() => window.location.href = '/phases/manage'}>
                    Manage Phase
                  </div>
                </div>
              </li>
              <li>
                <Link href="/storage" className="text-slate-600 hover:text-primary font-medium">
                  Documents
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-slate-600 hover:text-primary font-medium">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/startup-pipeline" className="text-slate-600 hover:text-primary font-medium">
                  Startup Pipeline
                </Link>
              </li>
              <li>
                <Link href="/translation" className="text-slate-600 hover:text-primary font-medium">
                  Translation
                </Link>
              </li>
              <li>
                <Link href="/business-tools" className="text-slate-600 hover:text-primary font-medium">
                  Business Tools
                </Link>
              </li>
              <li>
                <Link href="/ecosystem" className="text-slate-600 hover:text-primary font-medium">
                  360 Magicians
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" className="p-2 rounded-full hover:bg-slate-100" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-slate-100" aria-label="Notifications">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
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
