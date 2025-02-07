import Profile from "../components/app/Profile";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface NavBarProps {
  menuCollapsed: boolean;
  toggleMenu: () => void;
  onNavigate: (page: string) => void; // Add onNavigate prop to trigger page change
}


const NavBar = ({ menuCollapsed, toggleMenu, onNavigate }: NavBarProps) => {
  const [currentPath, setCurrentPath] = useState(""); // Use state to track current path

  const pathname = usePathname();


  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname); // Get current pathname from window object
    }
  }, []);

  const menu = [
    { name: "Dashboard", url: "/", icon: "bi bi-grid" },
    { name: "Researches", url: "/w-page/researches", icon: "bi bi-search" },
    { name: "Comments", url: "/w-page/comments", icon: "bi bi-chat-dots" },
  ];
 
  const others = [
    { name: "Account", url: "/w-page/account", icon: "bi bi-person" },
    { name: "Feedback", url: "/w-page/account/feedback", icon: "bi bi-chat" },
    { name: "Log out", url: "/w-page/account/logout", icon: "bi bi-box-arrow-left" },
  ];
 
  return (
    <>
      <Profile menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <div className={`navbar-container max-h-[80vh] overflow-hidden mx-2 mt-3`}>
        <h4 className={`${menuCollapsed ? 'hidden ' : ' '}text-gray-200 text-md border-t py-2 mt-3-md`}>MENU</h4>
        <div className="py-1 flex flex-col">
          {menu.map((tab, index) => (
            <Link
              key={index}
              href={tab.url}
              onClick={() => onNavigate(tab.name)} // Update the page name on navigation
              className={`flex items-center ${menuCollapsed ? 'p-2 justify-center' : 'py-2 px-3' } text-gray-50 text-sm rounded-md font-normal hover:bg-slate-100 hover:text-gray-900 transition-all duration-200 ${
                pathname === tab.url ? 'bg-slate-300 text-gray-900' : ''
              }`}
            >
              <i className={`${tab.icon} mr-2 text-xl transition-all duration-300 hover:text-sky-500`}></i>
              <span className={`${menuCollapsed ? 'hidden ' : 'block sm:block md:block lg:block'} transition-all duration-300 `}>
                {tab.name}
              </span>
            </Link>
          ))}
        </div>
        
        <h4 className={`${menuCollapsed ? 'hidden ' : ' '}text-gray-200 text-md border-t py-2 mt-3-md`}>SETTINGS</h4>
        <div className="py-1 flex flex-col">
          {others.map((tab, index) => (
            <Link
              key={index}
              href={tab.url}
              onClick={() => onNavigate(tab.name)} // Update the page name on navigation
              className={`flex items-center ${menuCollapsed ? 'p-2 justify-center' : 'py-2 px-3' } text-gray-50 text-sm rounded-md font-normal hover:bg-slate-100 hover:text-gray-900 transition-all duration-200 ${
                pathname === tab.url ? 'bg-slate-300 text-gray-900' : ''
              }`}
            >
              <i className={`${tab.icon} mr-2 text-xl transition-all duration-300 hover:text-sky-500`}></i>
              <span className={`${menuCollapsed ? 'hidden ' : 'block sm:block md:block lg:block'} transition-all duration-300 `}>
                {tab.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default NavBar;
