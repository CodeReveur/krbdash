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

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem('studentSession') || '{}');
    let session_id = "";
    if (userSession && userSession.id) {
      session_id = userSession.id;
    }

    const fetchResearches = async () => {
      try {
        const response = await fetch(`/api/analytics/researches`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ session_id: session_id }),
        });
        if (!response.ok) throw new Error("Failed to fetch researches");
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.log("An error occurred while fetching researches.");
      }
    };
    fetchResearches();
  }, []);

  const analyticsCards = [
    {
      title: "Total",
      value: analytics?.total_researches || 0,
      change: analytics?.percentage_change?.total_researches || 0,
      icon: "bi-files",
      color: "bg-teal-500"
    },
    {
      title: "Approved",
      value: analytics?.total_approved || 0,
      change: analytics?.percentage_change?.total_approved || 0,
      icon: "bi-check-circle-fill",
      color: "bg-teal-600"
    },
    {
      title: "Ongoing",
      value: (Number(analytics?.total_onhold || 0) + Number(analytics?.pending_researches || 0)),
      change: (Number(analytics?.percentage_change?.total_onhold || 0) + Number(analytics?.percentage_change?.pending_researches || 0)),
      icon: "bi-clock-fill",
      color: "bg-teal-700"
    },
    {
      title: "Published",
      value: analytics?.total_published || 0,
      change: analytics?.percentage_change?.total_published || 0,
      icon: "bi-globe2",
      color: "bg-teal-800"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Researches Portfolio</h1>
            <p className="text-gray-600 mt-1">Track and manage your research portfolio</p>
          </div>
          <button 
            onClick={onAddResearchClick} 
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            <i className="bi bi-plus-lg mr-2"></i>
            Add Research
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className={`p-2 ${card.color} rounded-lg`}>
                <i className={`${card.icon} text-white text-lg`}></i>
              </div>
              {analytics && (
                <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
                  Number(card.change) > 0 ? 'bg-green-100 text-green-700' : 
                  Number(card.change) < 0 ? 'bg-red-100 text-red-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  <i className={`${Number(card.change) >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'} mr-1`}></i>
                  {Math.abs(Number(card.change) || 0)}%
                </div>
              )}
            </div>
            <div className="mt-3">
              <h3 className="text-gray-600 text-sm font-medium">{card.title}</h3>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {analytics ? card.value : <div className="animate-pulse bg-gray-200 rounded h-8 w-16"></div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const statusFilters = [
  { id: 1, name: "", label: "All" },
  { id: 2, name: "Approved", label: "Approved" },
  { id: 3, name: "Pending", label: "Pending" },
  { id: 4, name: "Under review", label: "Review" },
  { id: 5, name: "Published", label: "Published" },
  { id: 6, name: "Rejected", label: "Rejected" }
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
  const [researches, setResearches] = useState<Research[]>([
    {
      id: 1,
      status: "Approved",
      title: "Machine Learning Applications in Healthcare",
      researcher: "Dr. Sarah Johnson",
      year: "2024",
      progress_status: "completed",
      created_at: "2024-01-15T10:30:00Z",
      hashed_id: "abc123",
      approval_requested: "Yes"
    },
    {
      id: 2,
      status: "Pending",
      title: "Sustainable Energy Solutions for Rural Communities",
      researcher: "Prof. Michael Chen",
      year: "2024",
      progress_status: "in_progress",
      created_at: "2024-02-20T14:15:00Z",
      hashed_id: "def456",
      approval_requested: "No"
    },
    {
      id: 3,
      status: "Published",
      title: "Climate Change Impact on Agricultural Productivity",
      researcher: "Dr. Emma Rodriguez",
      year: "2023",
      progress_status: "completed",
      created_at: "2023-12-10T09:45:00Z",
      hashed_id: "ghi789",
      approval_requested: "Yes"
    }
  ]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

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
      const userSession = JSON.parse(localStorage.getItem('studentSession') || '{}');
      const session_id = userSession?.id || "";
      
      const response = await fetch(
        `/api/research?filter=${filter}&search=${searchTerm}&page=${page}&limit=${itemsPerPage}&session_id=${session_id}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch researches");
      
      const data = await response.json();
      setResearches(data.researches || data);
      setTotalPages(Math.ceil((data.total || data.length) / itemsPerPage));
    } catch (error) {
      console.error("Error fetching researches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentFilter = statusFilters.find(f => f.id === activeFilter);
    fetchResearches(currentFilter?.name || "", search, currentPage);
  }, [search, currentPage]);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'under review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on hold':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bi-globe2';
      case 'approved':
        return 'bi-check-circle-fill';
      case 'under review':
        return 'bi-eye-fill';
      case 'on hold':
      case 'pending':
        return 'bi-clock-fill';
      case 'rejected':
        return 'bi-x-circle-fill';
      default:
        return 'bi-file-text';
    }
  };

  return (
    <div className="mt-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-teal-600 px-4 py-4">
          <h3 className="text-white text-lg font-semibold">Research Portfolio</h3>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.id}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-teal-100 text-teal-800 border-2 border-teal-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                  onClick={() => handleFilterChange(filter.id, filter.name)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search researches..."
                value={search}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : researches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <i className="bi bi-file-text text-gray-400 text-4xl mb-4"></i>
              <p className="text-gray-500 text-lg">No researches found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Research Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Researcher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {researches.map((research) => (
                  <tr key={research.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium border ${getStatusStyle(research.status)}`}>
                        <i className={`${getStatusIcon(research.status)} mr-1.5`}></i>
                        {research.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                          <i className="bi bi-file-text text-teal-600"></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {research.title}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {research.progress_status}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{research.researcher}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{research.year}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{timeAgo(research.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <button
                        onClick={() => toggleDropdown(research.id)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <i className="bi bi-three-dots text-gray-500"></i>
                      </button>
                      {dropdownOpen === research.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                            onClick={() => {
                              onResearchView(research.hashed_id);
                              toggleDropdown(research.id);
                            }}
                          >
                            <i className="bi bi-eye text-teal-600 mr-2"></i>
                            View Details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && researches.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, researches.length)} of {researches.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-teal-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-500">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="bi bi-chevron-right"></i>
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