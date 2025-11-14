
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
             <a href="#" className="flex items-center space-x-2">
               <svg className="h-8 w-auto text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C16.97 2 21 6.03 21 11C21 15.05 18.05 19.38 13.8 21.53C12.68 22.09 11.32 22.09 10.2 21.53C5.95 19.38 3 15.05 3 11C3 6.03 7.03 2 12 2ZM12 13.01C13.1 13.01 14 12.11 14 11.01C14 9.91 13.1 9.01 12 9.01C10.9 9.01 10 9.91 10 11.01C10 12.11 10.9 13.01 12 13.01Z"/>
              </svg>
              <span className="text-2xl font-extrabold text-white">NaijaGo</span>
            </a>
            <p className="text-gray-400 text-base">
              The future of transportation and logistics in Nigeria.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Services</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Ride</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Courier</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Business</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Careers</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Blog</a></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Privacy</a></li>
                  <li><a href="#" className="text-base text-gray-400 hover:text-white">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">&copy; {new Date().getFullYear()} NaijaGo Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
