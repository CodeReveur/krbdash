"use client";
import { useState, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import NavBar from "./pages/navBar";
import TopBar from "./components/app/TopBar";
import "../app/styles/globals.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

interface RootLayoutProps {
  children: ReactNode;
}

const manipulateUrl = (url: string) => {
  // Remove the '/i/' prefix
  if (url.startsWith('/i/')) {
    url = url.replace('/i/', '');
  } else if (url.startsWith('/w-page/')) {
    url = url.replace('/w-page/', '');
  } else {
    url = "dashboard"; 
  }

  // Capitalize the first letter of the remaining word
  const capitalized = url.charAt(0).toUpperCase() + url.slice(1);
  return capitalized;
};

const hideNav = (url: string): boolean => {
  return url.startsWith('/auth');
};

export default function RootLayout({ children }: RootLayoutProps) {
  const path = usePathname();
  const pathTitle = manipulateUrl(path);
  const [pageTitle, setPageTitle] = useState<string>(pathTitle);
  const router = useRouter();

  // Function to update page title when navigating
  const handlePageChange = (newPage: string) => {
    setPageTitle(newPage);
  };

  // Update page title when path changes
  useEffect(() => {
    setPageTitle(manipulateUrl(path));
  }, [path]);

  const hide = hideNav(path);

  return (
    <html lang="en">
      <head>
        <title>{pageTitle}</title>
        <link rel="shortcut icon" href="/logo.svg" type="image/x-icon" />
      </head>
      <body className="bg-slate-50 transition-all duration-300 ease-in-out">
        {!hide ? (
          // Main app layout (with navigation)
          <div className="min-h-screen">
            {/* Sidebar Navigation */}
            <NavBar onNavigate={handlePageChange} />
            
            {/* Main Content Area */}
            <main className="lg:ml-72 min-h-screen transition-all duration-300">
              {/* TopBar */}
              <TopBar pageTitle={pageTitle} />
              
              {/* Content Container */}
              <div className="p-2">
                {/* Page Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-12rem)]">
                  <div className="p-4 lg:p-6">
                    {children}
                  </div>
                </div>
              </div>
            </main>
          </div>
        ) : (
          // Auth pages layout (no navigation)
          <div className="min-h-screen">
            {children}
          </div>
        )}
      </body>
    </html>
  );
}