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
      title: "Total researches",
      value: analytics?.total_researches || 0,
      change: analytics?.percentage_change?.total_researches || 0,
      gradient: "from-teal-500 to-emerald-500",
      icon: "bi-search"
    },
    {
      title: "Approved",
      value: analytics?.total_approved || 0,
      change: analytics?.percentage_change?.total_approved || 0,
      gradient: "from-emerald-500 to-teal-500",
      icon: "bi-check-circle"
    },
    {
      title: "Pending",
      value: (Number(analytics?.total_onhold || 0) + Number(analytics?.pending_researches || 0)),
      change: (Number(analytics?.percentage_change?.total_onhold || 0) + Number(analytics?.percentage_change?.pending_researches || 0)),
      gradient: "from-teal-600 to-emerald-600",
      icon: "bi-clock"
    },
    {
      title: "Total published",
      value: analytics?.total_published || 0,
      change: analytics?.percentage_change?.total_published || 0,
      gradient: "from-green-500 to-emerald-500",
      icon: "bi-globe"
    },
    {
      title: "Total rejection",
      value: analytics?.total_rejected || 0,
      change: analytics?.percentage_change?.total_rejected || 0,
      gradient: "from-emerald-600 to-teal-600",
      icon: "bi-x-circle"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Research Materials</h1>
            <p className="text-gray-600 mt-1">Manage and track your research portfolio</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              title="Download research summary"
            >
              <i className="bi bi-download mr-2"></i>
              Download
            </button>
            <button 
              onClick={onAddResearchClick} 
              className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <i className="bi bi-plus-circle mr-2"></i>
              Add Research
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Analytics Overview</h2>
          <p className="text-gray-600">Track your research performance metrics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {analyticsCards.map((card, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${card.gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <i className={`${card.icon} text-lg`}></i>
                </div>
                <i className="bi bi-three-dots text-white/80"></i>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-white/90 text-sm font-medium">{card.title}</h3>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl font-bold">
                    {analytics ? String(card.value) : (
                      <div className="animate-pulse bg-white/20 rounded h-8 w-12"></div>
                    )}
                  </div>
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    Number(card.change) > 0 
                      ? 'bg-white/20 text-white' 
                      : Number(card.change) < 0 
                      ? 'bg-red-500/20 text-red-100'
                      : 'bg-white/20 text-white'
                  }`}>
                    {analytics ? (
                      <>
                        <i className={`${Number(card.change) >= 0 ? 'bi-caret-up-fill' : 'bi-caret-down-fill'} mr-1`}></i>
                        {Math.abs(Number(card.change) || 0)}%
                      </>
                    ) : (
                      <div className="animate-pulse bg-white/20 rounded h-4 w-8"></div>
                    )}
                  </div>
                </div>
                <div className="text-white/70 text-xs">from last month</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const buttons = [
  { "id": 1, "name": "" },
  { "id": 2, "name": "Rejected" },
  { "id": 3, "name": "Approved" },
  { "id": 4, "name": "On hold" },
  { "id": 5, "name": "Under review" },
  { "id": 7, "name": "Published" },
  { "id": 8, "name": "Draft" },
  { "id": 9, "name": "Pending" },
];

const timeAgo = (createdDate: string): string => {
  const now = new Date();
  const created = new Date(createdDate);

  const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `Now`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
};

const ResearchesList = ({ onResearchView }: ResearchListProps) => {
  const [activeId, setActiveId] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [researches, setResearches] = useState<Research[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const handleActive = (id: number) => {
    setActiveId(id);
  };

  const toggleDropdown = (id: number) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleSort = (text: string) => {
    setSort(text);
  };

  const handleFilter = (text: string) => {
    setFilter(text);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem('studentSession') || '{}');
    let session_id = "";
    if (userSession && userSession.id) {
      session_id = userSession.id;
    }
    const fetchResearches = async () => {
      try {
        const response = await fetch(`/api/research?sort=${sort}&search=${search}&filter=${filter}&session_id=${session_id}`);
        if (!response.ok) throw new Error("Failed to fetch researches");
        const data = await response.json();
        setResearches(data);
        console.log(data);
      } catch (error) {
        setError("An error occurred while fetching researches.");
      }
    };
    fetchResearches();
  }, [sort, filter, search]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Published':
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Under review':
      case 'On hold':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="mt-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6">
          <h4 className="text-white text-xl font-semibold">Research List</h4>
          <p className="text-teal-100 mt-1">Track and manage all research submissions</p>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              {buttons.map((btn) => (
                <button 
                  key={btn.id}  
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                    activeId === btn.id 
                      ? 'bg-teal-100 text-teal-700 border-2 border-teal-300 shadow-md' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                  }`} 
                  onClick={() => {
                    handleActive(btn.id);
                    handleFilter(btn.name);
                  }}
                >
                  {btn.name === "" ? 'All' : btn.name}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <i className="bi bi-funnel"></i>
              </button>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="bi bi-search text-gray-400"></i>
                </div>
                <input 
                  type="search" 
                  name="search" 
                  id="search" 
                  onChange={handleSearch} 
                  placeholder="Search researches..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
                />
              </div>
            </div>
          </div>

          {researches.length <= 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-32 h-32 mb-6">
                <img src="/delete.png" alt="No researches" className="w-full h-full object-contain opacity-50"/>
              </div>
              <p className="text-gray-500 text-lg">No researches found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Researcher</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {researches.map((research) => (
                      <tr key={research.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <input 
                            type="checkbox" 
                            value={research.id} 
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(research.status)}`}>
                            {research.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 font-medium">{research.title}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{research.researcher}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{research.year}</td>
                        <td className="px-4 py-4 text-sm text-gray-600 capitalize">{research.progress_status}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{research.approval_requested}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{timeAgo(research.created_at)}</td>
                        <td className="px-4 py-4 text-center relative">
                          <button
                            onClick={() => toggleDropdown(research.id)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <i className="bi bi-three-dots text-lg text-gray-500"></i>
                          </button>
                          {dropdownOpen === research.id && (
                            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                                onClick={() => {
                                  onResearchView(research.hashed_id);
                                  toggleDropdown(research.id);
                                }}
                              >
                                <i className="bi bi-eye mr-2 text-teal-500"></i> 
                                View Details
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {researches.length} results
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                  <button className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    1
                  </button>
                  <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
export { ResearchesList };