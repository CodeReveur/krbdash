"use client";

import React, { useEffect, useState } from "react";

interface Request {
  id: number;
  status: string;
  title: string;
  supervisor: string;
  reason: string;
  created_at: string;
  hashed_id: string;
}

const buttons = [
  { "id": 1, "name": "" },
  { "id": 2, "name": "Pending" },
  { "id": 3, "name": "Approved" },
  { "id": 4, "name": "Rejected" },
];

function formatDate(dateString: any) {
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${month}, ${day} ${year} ${hours}:${minutes}:${seconds}`;
}

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

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Rejected':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'Pending':
      return 'bg-teal-100 text-teal-700 border-teal-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bi-check-circle-fill';
    case 'Rejected':
      return 'bi-x-circle-fill';
    case 'Pending':
      return 'bi-clock-fill';
    default:
      return 'bi-question-circle';
  }
};

const RequestsApproval = () => {
  const [activeId, setActiveId] = useState(2);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Pending");

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

  // Fetch Requests
  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem('studentSession') || '{}');
    let session_id = "";
    if (userSession && userSession.id) {
      session_id = userSession.id;
    }
    const fetchRequests = async () => {
      try {
        const response = await fetch(`/api/requests?sort=${sort}&search=${search}&filter=${filter}&session_id=${session_id}`);
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();
        setRequests(data);
        console.log(data);
      } catch (error) {
        setError("An error occurred while fetching requests.");
      }
    };
    fetchRequests();
  }, [sort, filter, search]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white text-xl font-semibold flex items-center">
                <i className="bi bi-file-earmark-check mr-3 text-2xl"></i>
                Request Approvals
              </h4>
              <p className="text-teal-100 mt-1">Track and manage research approval requests</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <i className="bi bi-bell text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {buttons.map((btn) => (
                <button 
                  key={btn.id}  
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 capitalize ${
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

            {/* Search and Filter */}
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
                  placeholder="Search requests..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          {requests.length <= 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-32 h-32 mb-6">
                <img src="/delete.png" alt="No requests" className="w-full h-full object-contain opacity-50"/>
              </div>
              <p className="text-gray-500 text-lg">No requests found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Requests Cards */}
              <div className="grid gap-4">
                {requests.map((request) => (
                  <div key={request.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.01] overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        {/* Request Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg">
                              <i className="bi bi-file-earmark-text text-white"></i>
                            </div>
                            <div>
                              <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                Research Approval
                              </span>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(request.status)}`}>
                              <i className={`${getStatusIcon(request.status)} mr-1`}></i>
                              {request.status}
                            </span>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.title}</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <i className="bi bi-person-badge text-gray-400"></i>
                              <span className="text-sm text-gray-600">
                                <span className="font-medium">Supervisor:</span> {request.supervisor}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <i className="bi bi-clock text-gray-400"></i>
                              <span className="text-sm text-gray-600">
                                {timeAgo(request.created_at)}
                              </span>
                            </div>
                          </div>

                          {request.reason && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                              <div className="flex items-start space-x-2">
                                <i className="bi bi-chat-square-text text-gray-400 mt-0.5"></i>
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Reason:</span>
                                  <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="relative ml-4">
                          <button
                            onClick={() => toggleDropdown(request.id)}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <i className="bi bi-three-dots-vertical text-lg text-gray-500"></i>
                          </button>
                          {dropdownOpen === request.id && (
                            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors border-b border-gray-100"
                                onClick={() => {
                                  // onRequestView(request.hashed_id);
                                  toggleDropdown(request.id);
                                }}
                              >
                                <i className="bi bi-info-circle mr-2 text-teal-500"></i> 
                                View Details
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                                onClick={() => {
                                  // onRemind(request.hashed_id);
                                  toggleDropdown(request.id);
                                }}
                              >
                                <i className="bi bi-bell mr-2 text-amber-500"></i> 
                                Send Reminder
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {requests.length} requests
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

export default RequestsApproval;