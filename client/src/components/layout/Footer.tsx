import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg width="30" height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M18 3L34.5 13.5V22.5L18 33L1.5 22.5V13.5L18 3Z" stroke="currentColor" strokeWidth="3" fill="none"/>
                <path d="M18 33V22.5M18 22.5L34.5 13.5M18 22.5L1.5 13.5M18 3L34.5 13.5M18 3L1.5 13.5" stroke="currentColor" strokeWidth="3" fill="none"/>
              </svg>
              <span className="text-lg font-bold">360 Business Magician</span>
            </div>
            <p className="text-slate-400 text-sm">Complete business lifecycle management platform with deaf-first founder support</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Business Lifecycle</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/phases/idea"><a className="hover:text-white">Idea Generation</a></Link></li>
              <li><Link href="/phases/build"><a className="hover:text-white">Business Build</a></Link></li>
              <li><Link href="/phases/grow"><a className="hover:text-white">Growth Strategies</a></Link></li>
              <li><Link href="/phases/manage"><a className="hover:text-white">Business Management</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white">ASL Business Videos</a></li>
              <li><a href="#" className="hover:text-white">SBA Integration</a></li>
              <li><a href="#" className="hover:text-white">VR Services</a></li>
              <li><a href="#" className="hover:text-white">AI Business Tools</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Accessibility</a></li>
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">ASL Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} 360 Business Magician. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-white">
              <i className="ri-twitter-x-line text-lg"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-white">
              <i className="ri-facebook-circle-line text-lg"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-white">
              <i className="ri-linkedin-box-line text-lg"></i>
            </a>
            <a href="#" className="text-slate-400 hover:text-white">
              <i className="ri-youtube-line text-lg"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
