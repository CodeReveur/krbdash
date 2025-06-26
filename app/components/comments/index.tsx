"use client";

import { useEffect, useState } from "react";

interface CommentHeaderProps {
  onAddCommentClick: () => void;
}

interface Comment {
  id: number;
  status: string;
  comment: string;
  sender: string;
  replies: string[];
  research_id: string;
  updated_at: string;
  created_at: string;
}

interface CommentListProps {
  onCommentView: (CommentId: number) => void;
}

const comments: Comment[] = [
  {
    id: 1,
    status: "Visible",
    comment: "This research provides valuable insights into AI applications.",
    sender: "John Doe",
    replies: [
      "I agree! The case studies were very informative.",
      "Could you elaborate on the ethical concerns discussed?",
    ],
    research_id: "1",
    updated_at: "2024-01-20T12:30:00Z",
    created_at: "2024-01-18T09:15:00Z",
  },
  {
    id: 2,
    status: "Hidden",
    comment: "There are some inconsistencies in the data analysis.",
    sender: "Dr. Alice Kayitesi",
    replies: ["Can you specify which sections need clarification?"],
    research_id: "2",
    updated_at: "2024-02-02T14:45:00Z",
    created_at: "2024-02-01T10:10:00Z",
  },
  {
    id: 3,
    status: "Visible",
    comment: "This study on climate change is very well-structured.",
    sender: "Samuel Nkurunziza",
    replies: [
      "Thanks! We are working on adding more recent data.",
      "Will there be a follow-up study next year?",
    ],
    research_id: "5",
    updated_at: "2023-08-15T11:50:00Z",
    created_at: "2023-08-12T08:30:00Z",
  },
  {
    id: 4,
    status: "Pending Review",
    comment: "How reliable are the sources cited in this paper?",
    sender: "Fatima Mugisha",
    replies: [],
    research_id: "3",
    updated_at: "2023-11-10T17:20:00Z",
    created_at: "2023-11-09T15:40:00Z",
  },
  {
    id: 5,
    status: "Visible",
    comment: "This research could benefit from more case studies.",
    sender: "Jean Habimana",
    replies: [
      "Good point! We are considering adding additional examples.",
      "Are there specific case studies you'd recommend?",
    ],
    research_id: "4",
    updated_at: "2022-09-05T16:30:00Z",
    created_at: "2022-09-02T13:20:00Z",
  }
];

const buttons = [
  { "id": 1, "name": "all" },
  { "id": 3, "name": "rejected" },
  { "id": 4, "name": "on hold" },
  { "id": 5, "name": "under review" },
  { "id": 7, "name": "published" },
  { "id": 8, "name": "draft" },
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

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Visible':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Hidden':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'Pending Review':
      return 'bg-teal-100 text-teal-700 border-teal-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const CommentList = () => {
  const [activeId, setActiveId] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const handleActive = (id: number) => {
    setActiveId(id);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
  };

  useEffect(() => {
    setCommentsList(comments);
  }, []);

  const filteredComments = commentsList.filter(comment =>
    comment.comment.toLowerCase().includes(search.toLowerCase()) ||
    comment.sender.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6">
          <h4 className="text-white text-xl font-semibold">Research Comments</h4>
          <p className="text-teal-100 mt-1">Manage and review all research feedback</p>
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
                  onClick={() => handleActive(btn.id)}
                >
                  {btn.name}
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
                  placeholder="Search comments..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
                />
              </div>
            </div>
          </div>

          {filteredComments.length <= 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-32 h-32 mb-6">
                <img src="/delete.png" alt="No comments" className="w-full h-full object-contain opacity-50"/>
              </div>
              <p className="text-gray-500 text-lg">No comments found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Research Navigation */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <button className="flex items-center px-4 py-2 border border-teal-300 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors">
                    <i className="bi bi-arrow-left mr-2"></i>
                    Previous
                  </button>
                  <button className="flex items-center px-4 py-2 border border-teal-300 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors">
                    Next
                    <i className="bi bi-arrow-right ml-2"></i>
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <i className="bi bi-file-text text-teal-600"></i>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-600 font-medium">Current Research:</h4>
                    <div className="text-lg font-bold text-gray-900">The Impact of AI on Modern Education</div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {filteredComments.map((comment) => (
                  <div key={comment.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    {/* Comment Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <i className="bi bi-person text-white text-lg"></i>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{comment.sender}</h3>
                            <p className="text-sm text-gray-500">{timeAgo(comment.created_at)}</p>
                          </div>
                        </div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(comment.status)}`}>
                          {comment.status}
                        </span>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="p-6">
                      <p className="text-gray-800 leading-relaxed mb-4">{comment.comment}</p>

                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700 text-sm flex items-center">
                            <i className="bi bi-chat-dots mr-2 text-teal-600"></i>
                            Replies ({comment.replies.length})
                          </h4>
                          <div className="space-y-2">
                            {comment.replies.map((reply, index) => (
                              <div key={index} className="bg-gradient-to-r from-teal-50 to-emerald-50 border-l-4 border-teal-500 p-4 rounded-r-lg">
                                <p className="text-gray-700 text-sm">{reply}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reply Button */}
                      <div className="flex justify-end mt-4">
                        <button className="flex items-center px-4 py-2 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                          <i className="bi bi-reply mr-2"></i>
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {filteredComments.length} comments
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                  <button className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    1
                  </button>
                  <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    2
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

export default CommentList;