import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface NavBarProps {
  onNavigate: (page: string) => void;
}

interface UserInfo {
  id: number;
  username: string;
  name: string;
  email: string;
}

const NavBar = ({ onNavigate }: NavBarProps) => {
  const [currentPath, setCurrentPath] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
      
      // Get user info from localStorage (adjust this based on your auth system)
      const userInfoData = JSON.parse(localStorage.getItem('userSession') || '{}');

      if (userInfoData && userInfoData.name != "") {
        try {
          const parsedUserInfo = userInfoData;
          setUserInfo(parsedUserInfo);
        } catch (error) {
          console.error('Error parsing user info:', error);
        }
      } else {
        router.push("/auth/login");
      }
    }
  }, []);

  // Auto-hide navbar on mobile when user scrolls or touches outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const sidebar = document.getElementById('sidebar');
      const toggleButton = document.getElementById('toggle-button');
      
      if (
        isOpen && 
        sidebar && 
        !sidebar.contains(target) && 
        toggleButton && 
        !toggleButton.contains(target) &&
        window.innerWidth < 1024
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen && window.innerWidth < 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  const menu = [
    { name: "Dashboard", url: "/", icon: "bi bi-grid" },
    { name: "Researches", url: "/~/researches", icon: "bi bi-search" },
    { name: "Comments", url: "/~/comments", icon: "bi bi-chat-dots" },
    { name: "Requests", url: "/~/requests", icon: "bi bi-hourglass-split" },
  ];

  const userActions = [
    { name: "Account", url: "/~/account", icon: "bi bi-person-gear" },
    { name: "Log out", url: "/~/account/logout", icon: "bi bi-box-arrow-left" },
  ];
  
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
  return (
    <>
      {/* Toggle Button - Mobile Only */}
      <button
        id="toggle-button"
        className="lg:hidden fixed top-4 right-4 z-50 text-2xl text-white bg-teal-800 bg-opacity-70 backdrop-blur-sm p-3 rounded-md shadow-md hover:bg-opacity-90 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`bi ${isOpen ? 'bi-x' : 'bi-list'}`}></i>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 backdrop-brightness-50 backdrop-blur-sm bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-screen w-72 max-h-screen overflow-y-auto
          bg-gradient-to-b from-teal-900 to-slate-900 
          bg-opacity-95 backdrop-blur-xl border-r border-teal-800/30 shadow-2xl 
          text-white p-4 flex flex-col z-40
          transition-transform duration-300 ease-in-out
          ${
            isOpen
              ? "translate-x-0"
              : "translate-x-[-100%] lg:translate-x-0"
          }`}
      >
        {/* Profile Section */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full flex items-center justify-center border-2 border-white/40 shadow-lg">
              <i className="bi bi-person text-white text-xl"></i>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base text-white/60 font-medium">Welcome</p>
            <h3 className="text-xl font-bold text-white truncate">
              {userInfo?.name}
            </h3>
            <p className="text-sm text-teal-400 font-semibold truncate">
              {maskEmail(String(userInfo?.email))}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <h2 className="text-base font-bold text-white/50 mb-3 uppercase tracking-wide border-t border-white/10 pt-3">
            Menu
          </h2>
          
          <ul className="space-y-1">
            {menu.map((tab, index) => (
              <li key={index}>
                <Link href={tab.url}>
                  <div
                    onClick={() => {
                      onNavigate(tab.name);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold cursor-pointer transition-all group
                      ${
                        pathname === tab.url
                          ? "bg-gradient-to-r from-teal-400/20 to-teal-500/20 text-white font-bold shadow-inner border border-teal-400/30"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <i className={`${tab.icon} text-xl ${pathname === tab.url ? 'text-teal-400' : 'group-hover:text-teal-300'}`}></i>
                    <span className="transition-all duration-300 truncate">{tab.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* User Actions */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <h3 className="text-base font-bold text-white/50 mb-3 uppercase tracking-wide">
              Settings
            </h3>
            <div className="space-y-1">
              {userActions.map((tab, index) => (
                <Link key={index} href={tab.url}>
                  <div
                    onClick={() => {
                      onNavigate(tab.name);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold cursor-pointer transition-all group
                      ${
                        pathname === tab.url
                          ? "bg-gradient-to-r from-teal-400/20 to-teal-500/20 text-white font-bold shadow-inner border border-teal-400/30"
                          : tab.name === 'Log out' 
                            ? "text-white/70 hover:bg-red-500/20 hover:text-red-300"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <i className={`${tab.icon} text-xl ${
                      pathname === tab.url ? 'text-teal-400' : 
                      tab.name === 'Log out' ? 'group-hover:text-red-300' : 'group-hover:text-teal-300'
                    }`}></i>
                    <span className="transition-all duration-300 truncate">{tab.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/10 flex-shrink-0">
          <div className="text-sm text-white/40 text-center">
            <p>&copy; {new Date().getFullYear()} <span className="text-white font-bold text-base">KRB</span></p>
            <p className="mt-1 font-medium">All rights reserved.</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavBar;