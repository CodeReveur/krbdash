"use client";

import { useEffect, useState } from "react";

interface ResearchHeaderProps {
  onAddResearchClick: () => void;
}

interface Research {
  id: number;
  status: string;
  title: string;
  researcher: string;
  year: string;
  progress_status: string;
  created_at: string;
  hashed_id: string;
  approval_requested: string;
}

interface Analytics {
  total_researches: number;
  pending_researches: number;
  total_rejected: number;
  total_onhold: number;
  total_published: number;
  total_approved: number;
  percentage_change: {
    total_researches: number;
    pending_researches: number;
    total_rejected: number;
    total_onhold: number;
    total_published: number;
    total_approved: number;
  };
}

interface ResearchListProps {
  onResearchView: (researchId: string) => void;
}

const Header = ({ onAddResearchClick }: ResearchHeaderProps) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
        const session_id = userSession?.id || "";

        const response = await fetch(`/api/analytics/researches`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ session_id }),
        });

        if (!response.ok) throw new Error("Failed to fetch analytics");
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const analyticsCards = [
    {
      title: "Total Researches",
      value: analytics?.total_researches || 0,
      change: analytics?.percentage_change?.total_researches || 0,
      icon: "bi bi-collection",
      gradient: "from-teal-500 to-teal-700"
    },
    {
      title: "Approved",
      value: analytics?.total_approved || 0,
      change: analytics?.percentage_change?.total_approved || 0,
      icon: "bi bi-check-circle-fill",
      gradient: "from-teal-600 to-teal-800"
    },
    {
      title: "Ongoing",
      value: (Number(analytics?.total_onhold || 0) + Number(analytics?.pending_researches || 0)),
      change: (Number(analytics?.percentage_change?.total_onhold || 0) + Number(analytics?.percentage_change?.pending_researches || 0)),
      icon: "bi bi-clock-history",
      gradient: "from-teal-400 to-teal-600"
    },
    {
      title: "Published",
      value: analytics?.total_published || 0,
      change: analytics?.percentage_change?.total_published || 0,
      icon: "bi bi-globe-americas",
      gradient: "from-teal-600 to-slate-700"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Hero Header Section */}
      <div className="grid grid-cols-1 sm:flex sm:justify-between items-center bg-white p-6 rounded-md shadow-xs border border-gray-200">
        <div className="space-y-1 grid grid-cols-1">
          <h1 className="text-2xl font-bold text-teal-900">My Researches</h1>
          <p>Track and manage your research projects effectively.</p>
        </div>
        <button className="flex items-center justify-center my-2 sm:my-0 space-x-2 px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200" onClick={onAddResearchClick}>
          <i className="bi bi-plus-circle"></i>
          <span>Add Research</span>
        </button>
      </div>
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => (
          <div key={index} className="rounded-lg p-4 border border-gray-200 hover:shadow-lg hover:border-teal-200 transition-all duration-300 bg-white">
            <div className="flex items-center space-x-2 mb-1">
              <div className="bg-slate-200 rounded text-gray-800 px-2">
                <i className={`bi ${card.icon} text-sm`}></i>
              </div>
              <h1 className="text-sm text-gray-600">{card.title}</h1>
            </div>

            <div className="flex items-center space-x-1">
              <span className="font-bold text-xl">{card.value}</span>
              <span className="text-gray-500 text-xs"> researches</span>
            </div>

            <div className="flex items-center space-x-1">
              <i className={`bi ${Number(card.change) > 0 ? 'bi-graph-up' : 'bi-graph-down'} text-xs ${Number(card.change) > 0 ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'} py-1 px-1.5 font-bold rounded-full`}></i>
              <span className={`text-xs ${Number(card.change) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(Number(card.change))}%
              </span> 
              <span className="text-xs pl-2 text-slate-400 font-light">last month</span>
            </div>
          </div>
        ))}
      </div> 
    </div>
  );
};

const statusFilters = [
  { id: 1, name: "", label: "All", color: "gray" },
  { id: 2, name: "Approved", label: "Approved", color: "teal" },
  { id: 3, name: "Pending", label: "Pending", color: "yellow" },
  { id: 4, name: "Under review", label: "Under Review", color: "blue" },
  { id: 5, name: "Published", label: "Published", color: "teal" },
  { id: 6, name: "Rejected", label: "Rejected", color: "red" }
];

const timeAgo = (createdDate: string): string => {
  const now = new Date();
  const created = new Date(createdDate);
  const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
};

const ResearchesList = ({ onResearchView }: ResearchListProps) => {
  const [activeFilter, setActiveFilter] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [researches, setResearches] = useState<Research[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 10;

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Force card view on mobile
  useEffect(() => {
    if (isMobile) {
      setViewMode('cards');
    }
  }, [isMobile]);

  const toggleDropdown = (id: number) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterId: number, filterName: string) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
    fetchResearches(filterName, search, 1);
  };

  const fetchResearches = async (filter = "", searchTerm = "", page = 1) => {
    setLoading(true);
    try {
      const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
      const session_id = userSession?.id || "";
      
      const response = await fetch(
        `/api/research?filter=${encodeURIComponent(filter)}&search=${encodeURIComponent(searchTerm)}&page=${page}&limit=${itemsPerPage}&session_id=${session_id}`,
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          }
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch researches");
      
      const data = await response.json();
      setResearches(data);
      setTotalCount(data.length || 0);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching researches:", error);
      setResearches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentFilter = statusFilters.find(f => f.id === activeFilter);
    fetchResearches(currentFilter?.name || "", search, currentPage);
  }, [search, currentPage, activeFilter]);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'approved':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'under review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'on hold':
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bi bi-globe-americas';
      case 'approved':
        return 'bi bi-check-circle-fill';
      case 'under review':
        return 'bi bi-eye-fill';
      case 'on hold':
      case 'pending':
        return 'bi bi-clock-fill';
      case 'rejected':
        return 'bi bi-x-circle-fill';
      default:
        return 'bi bi-file-text';
    }
  };

  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {researches.map((research) => (
        <div key={research.id} className="group bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-lg hover:border-teal-200 transition-all duration-300 overflow-hidden">
          <div className="p-4">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className={`inline-flex items-center px-3 py-2 rounded-xl text-xs font-semibold border ${getStatusStyle(research.status)} group-hover:shadow-sm transition-shadow duration-200`}>
                <i className={`${getStatusIcon(research.status)} mr-2`}></i>
                {research.status}
              </div>
              <div className="relative">
                <button
                  onClick={() => toggleDropdown(research.id)}
                  className="p-2 rounded-lg hover:bg-teal-50 transition-colors duration-200"
                >
                  <i className="bi bi-three-dots-vertical text-gray-500 hover:text-teal-600"></i>
                </button>
                {dropdownOpen === research.id && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    <button
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 flex items-center transition-colors duration-200 font-medium"
                      onClick={() => {
                        onResearchView(research.hashed_id);
                        toggleDropdown(research.id);
                      }}
                    >
                      <i className="bi bi-eye text-teal-600 mr-3 text-lg"></i>
                      View Research Details
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Research Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <i className="bi bi-journal-richtext text-teal-700 text-2xl"></i>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-slate-700 mb-3 line-clamp-2 group-hover:text-teal-800 transition-colors duration-200">
              {research.title}
            </h3>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-center text-sm text-slate-600">
                <i className="bi bi-person mr-2 text-teal-600"></i>
                <span className="font-normal">{research.researcher}</span>
              </div>
              
              <div className="flex items-center text-sm text-slate-600">
                <i className="bi bi-calendar mr-2 text-teal-600"></i>
                <span className="font-normal">{research.year}</span>
              </div>

              <div className="flex items-center text-sm text-slate-600">
                <i className="bi bi-diagram-3 mr-2 text-teal-600"></i>
                <span className="font-normal capitalize">{research.progress_status?.replace('_', ' ')}</span>
              </div>

              <div className="flex items-center text-xs text-slate-500">
                <i className="bi bi-clock mr-2"></i>
                <span className="font-normal">{timeAgo(research.created_at)}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onResearchView(research.hashed_id)}
              className="w-full mt-4 px-2 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-md hover:from-teal-700 hover:to-teal-800 transition-all duration-200 flex items-center justify-center group-hover:shadow-lg"
            >
              <i className="bi bi-eye mr-2"></i>
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-4">
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className=" px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1 grid grid-cols-1">
              <h1 className="text-xl font-semibold text-slate-700">Recent Researches</h1>
            </div>
            
            {/* View Toggle - Hidden on mobile */}
            {!isMobile && (
              <div className="flex items-center border border-gray-200 rounded-md p-1 bg-slate-100/60">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    viewMode === 'table'
                      ? 'bg-white text-teal-800 shadow-sm border border-gray-100'
                      : 'text-slate-700/80 hover:text-slate-500 hover:bg-white/10'
                  }`}
                >
                  <i className="bi bi-table mr-2"></i>
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    viewMode === 'cards'
                      ? 'bg-white text-teal-800 shadow-sm border border-gray-100'
                      : 'text-slate-700/80 hover:text-slate-500 hover:bg-white/10'
                  }`}
                >
                  <i className="bi bi-grid-3x3-gap mr-2"></i>
                  Cards
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-4 pb-2 bg-gradient-to-r from-gray-50 to-teal-50/30 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.id}
                  className={`px-2 py-1 rounded-md text-sm transition-all duration-200 ${
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg transform scale-105'
                      : 'bg-white text-slate-700 border border-gray-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700'
                  }`}
                  onClick={() => handleFilterChange(filter.id, filter.name)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="bi bi-search text-gray-400 text-sm"></i>
              </div>
              <input
                type="text"
                placeholder="Search researches..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-10 pr-2 py-1.5 border border-gray-200 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-white shadow-sm transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-100 border-t-teal-600"></div>
              <p className="text-slate-500 font-medium">Loading researches...</p>
            </div>
          </div>
        ) : researches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="px-5 py-4 bg-gray-100 rounded-full mb-6">
              <i className="bi bi-journal-x text-gray-400 text-4xl"></i>
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-2">No researches found</h3>
            <p className="text-slate-500 text-center max-w-md text-sm">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <>
            {/* Render Card View or Table View */}
            {viewMode === 'cards' || isMobile ? (
              <CardView />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-100 to-teal-50/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 border border border-gray-100 tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 border border border-gray-100 tracking-wider">
                        Research Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 border border border-gray-100 tracking-wider">
                        Researcher
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 border border border-gray-100 tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 border border border-gray-100 tracking-wider text-nowrap">
                        Last Updated
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 border border border-gray-100 tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {researches.map((research) => (
                      <tr key={research.id} className="hover:bg-gradient-to-r hover:from-teal-50/30 hover:to-teal-50/30 transition-all duration-200 group">
                        <td className="px-6 py-3">
                          <div className={`inline-flex items-center px-2 py-1.5 rounded-md text-xs font-semibold border ${getStatusStyle(research.status)} group-hover:shadow-sm transition-shadow duration-200`}>
                            <i className={`${getStatusIcon(research.status)} mr-2`}></i>
                            {research.status}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-green-100 to-blue-200 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <i className="bi bi-journal-richtext text-teal-700 text-md"></i>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-slate-700 line-clamp-2 group-hover:text-teal-800 transition-colors duration-200">
                                {research.title}
                              </div>
                              <div className={`text-xs ${research.progress_status === 'completed' ? 'text-teal-400' : research.progress_status === 'ongoing' ? 'text-yellow-600' : 'text-slate-500'} capitalize font-medium mt-1`}>
                                <i className="bi bi-diagram-3 mr-1"></i>
                                {research.progress_status?.replace('_', ' ')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-sm  text-slate-900">{research.researcher}</div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-sm  text-slate-900">{research.year}</div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-xs text-slate-500 ">
                            <i className="bi bi-clock mr-1"></i>
                            {timeAgo(research.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-center relative">
                          <button
                            onClick={() => toggleDropdown(research.id)}
                            className="p-2 rounded-lg hover:bg-teal-50 transition-colors duration-200 group-hover:bg-teal-100/70"
                          >
                            <i className="bi bi-three-dots-vertical text-sm text-gray-500 hover:text-teal-600"></i>
                          </button>
                          {dropdownOpen === research.id && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                              <button
                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 flex items-center transition-colors duration-200 font-medium"
                                onClick={() => {
                                  onResearchView(research.hashed_id);
                                  toggleDropdown(research.id);
                                }}
                              >
                                <i className="bi bi-eye text-teal-600 mr-3 text-lg"></i>
                                View Research Details
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!loading && researches.length > 0 && (
          <div className="flex items-center justify-between px-6 py-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-teal-50/30">
            <div className="text-sm text-slate-700 font-medium">
              Showing <span className="font-bold text-teal-700">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
              <span className="font-bold text-teal-700">{Math.min(currentPage * itemsPerPage, totalCount)}</span> of{' '}
              <span className="font-bold text-teal-700">{totalCount}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-slate-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <i className="bi bi-chevron-left mr-1"></i>
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg'
                          : 'border border-gray-200 text-slate-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-400 font-medium">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-slate-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                Next
                <i className="bi bi-chevron-right ml-1"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
export { ResearchesList };