"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface TopBarProps {
  pageTitle: string;
}

interface UserInfo {
  id: number;
  username: string;
  name: string;
  email: string;
}

const TopBar = ({ pageTitle }: TopBarProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const pathname = usePathname();

  // Get current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get user info
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfoData = localStorage.getItem('userSession');
      if (userInfoData) {
        try {
          const parsedUserInfo = JSON.parse(userInfoData);
          setUserInfo(parsedUserInfo);
        } catch (error) {
          console.error('Error parsing user info:', error);
        }
      }
    }
  }, []);

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ name: 'Dashboard', path: '/' }];
    
    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      let name = segment.replace('w-page', '').replace('-', ' ');
      name = name.charAt(0).toUpperCase() + name.slice(1);
      breadcrumbs.push({ name, path: currentPath });
    });

    return breadcrumbs;
  };

  const maskEmail = (email:string) => {
    if (!email || !email.includes('@')) {
      return email;
    }
    
    const [localPart, domain] = email.split('@');
    
    if (localPart.length <= 3) {
      // For very short local parts, show first char + ***
      return localPart[0] + '***' + '@' + domain;
    } else {
      // Show first 3 chars + *** + last char before @
      const firstPart = localPart.substring(0, 3);
      const lastChar = localPart[localPart.length - 1];
      return firstPart + '***' + lastChar + '@' + domain;
    }
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left Section - Page Title & Breadcrumbs */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.path} className="flex items-center">
                {index > 0 && <i className="bi bi-chevron-right mx-2 text-xs"></i>}
                <span className={index === breadcrumbs.length - 1 ? 'text-teal-600 font-medium' : 'hover:text-teal-600 cursor-pointer'}>
                  {breadcrumb.name}
                </span>
              </div>
            ))}
          </div>
          
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="bi bi-search text-gray-400 text-lg"></i>
            </div>
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i className="bi bi-x text-gray-400 hover:text-gray-600 text-lg"></i>
              </button>
            )}
          </div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center space-x-3 lg:space-x-4">
          {/* Time Display */}
          <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600 bg-gray-50/80 px-3 py-2 rounded-lg">
            <i className="bi bi-clock text-teal-500"></i>
            <span className="font-medium">{currentTime}</span>
          </div>

          {/* Mobile Search Button */}
          <button className="md:hidden p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all">
            <i className="bi bi-search text-xl"></i>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
            >
              <i className="bi bi-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">New research submitted</p>
                          <p className="text-sm text-gray-500 truncate">Research #R-2024-{index + 1} has been submitted for review</p>
                          <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-100">
                  <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-all"
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <i className="bi bi-person text-white text-lg"></i>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900 truncate max-w-32">
                  {userInfo?.name || 'User'}
                </p>
                <p className="text-xs text-teal-600 truncate max-w-32">
                  {maskEmail(String(userInfo?.email)) || 'Team Member'}
                </p>
              </div>
              <i className="bi bi-chevron-down text-gray-400 text-sm hidden lg:block"></i>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
                      <i className="bi bi-person text-white text-xl"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {userInfo?.name || 'User'}
                      </p>
                      <p className="text-xs text-teal-600 truncate">
                        {userInfo?.email || 'Team Member'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <a href="/w-page/account" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <i className="bi bi-person-gear text-teal-500"></i>
                    <span>Profile Settings</span>
                  </a>
                  <a href="/w-page/preferences" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <i className="bi bi-gear text-teal-500"></i>
                    <span>Preferences</span>
                  </a>
                  <div className="border-t border-gray-100 my-2"></div>
                  <a href="/w-page/account/logout" className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <i className="bi bi-box-arrow-left"></i>
                    <span>Sign Out</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="bi bi-search text-gray-400"></i>
          </div>
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all placeholder-gray-400"
          />
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default TopBar;