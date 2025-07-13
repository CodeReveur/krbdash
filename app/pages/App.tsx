"use client";

import { useState, useEffect } from "react";

interface Metric {
  value: string;
  label: string;
  gradient: string;
  icon: React.ReactNode;
  change: string;
  trend: "up" | "down";
}

interface Stat {
  status: string;
  value: number;
  color: string;
}

const Dashboard = () => {
  const [viewMode, setViewMode] = useState<"bar" | "line">("bar");
  const [isLoading, setIsLoading] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  const metrics: Metric[] = [
    { 
      value: "2,847", 
      label: "Active Projects", 
      gradient: "from-violet-500 via-purple-500 to-indigo-500",
      icon: <i className="bi bi-bar-chart text-xl" />,
      change: "+12.5%",
      trend: "up"
    },
    { 
      value: "1,249", 
      label: "In Progress", 
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      icon: <i className="bi bi-clock text-xl" />,
      change: "+8.2%",
      trend: "up"
    },
    { 
      value: "847", 
      label: "This Quarter", 
      gradient: "from-emerald-500 via-teal-500 to-green-500",
      icon: <i className="bi bi-graph-up-arrow text-xl" />,
      change: "+15.3%",
      trend: "up"
    },
    { 
      value: "1,598", 
      label: "Completed", 
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      icon: <i className="bi bi-people text-xl" />,
      change: "+23.1%",
      trend: "up"
    }
  ];

  const chartData: Stat[] = [
    { status: "Research", value: 65, color: "#8b5cf6" },
    { status: "Analysis", value: 42, color: "#06b6d4" },
    { status: "Review", value: 28, color: "#10b981" },
    { status: "Published", value: 35, color: "#f59e0b" }
  ];

  const maxValue = Math.max(...chartData.map(stat => stat.value));

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const MetricCard = ({ value, label, gradient, icon, change, trend }: Metric) => (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${animateCards ? 'animate-in slide-in-from-bottom-4' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            {icon}
          </div>
          <div className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm ${trend === 'up' ? 'text-white' : 'text-red-100'}`}>
            {change}
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</div>
        <div className="text-white/80 text-sm font-medium">{label}</div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 font-['Inter']">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Research Analytics
          </h1>
          <p className="text-slate-600 mt-2 font-medium">Real-time insights and performance metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm text-slate-700 rounded-xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl border border-white/50">
            <i className="bi bi-funnel text-sm" />
            <span className="font-medium">Filter</span>
          </button>
          
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm text-slate-700 rounded-xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl border border-white/50 disabled:opacity-50"
          >
            <i className={`bi bi-arrow-clockwise text-sm ${isLoading ? 'animate-spin' : ''}`} />
            <span className="font-medium">Refresh</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            <i className="bi bi-download text-sm" />
            <span className="font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Performance Overview</h2>
            <p className="text-slate-600">Track your research progress across different stages</p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 lg:mt-0">
            <button
              onClick={() => setViewMode("bar")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium ${
                viewMode === "bar" 
                  ? "bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg" 
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <i className="bi bi-bar-chart text-sm" />
              Bar View
            </button>
            <button
              onClick={() => setViewMode("line")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium ${
                viewMode === "line" 
                  ? "bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg" 
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <i className="bi bi-graph-up-arrow text-sm" />
              Trend View
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Y-axis */}
          <div className="absolute left-0 h-80 flex flex-col justify-between text-sm text-slate-500 py-4 font-medium">
            {[80, 60, 40, 20, 0].map(v => <span key={v}>{v}</span>)}
          </div>

          {/* Chart Container */}
          <div className="ml-12 h-80 relative">
            
            {/* Bar Chart */}
            <div className={`absolute inset-0 transition-all duration-700 ease-out ${
              viewMode === "bar" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}>
              <div className="h-full flex items-end justify-between px-8 border-l-2 border-b-2 border-slate-200">
                {chartData.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center group cursor-pointer">
                    <div className="relative mb-4">
                      <div
                        className="w-16 rounded-t-2xl shadow-lg transition-all duration-700 ease-out group-hover:shadow-2xl relative overflow-hidden"
                        style={{ 
                          height: `${(item.value / maxValue) * 280}px`,
                          backgroundColor: item.color,
                          animation: `slideUp 1s ease-out ${idx * 0.2}s both`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20"></div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {item.value}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors duration-300">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Line Chart */}
            <div className={`absolute inset-0 transition-all duration-700 ease-out ${
              viewMode === "line" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}>
              <svg className="w-full h-full border-l-2 border-b-2 border-slate-200" viewBox="0 0 400 320">
                {/* Grid */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line
                    key={i}
                    x1="0"
                    y1={60 + i * 56}
                    x2="400"
                    y2={60 + i * 56}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                ))}

                {/* Area */}
                <path
                  d={`M 80 ${320 - (chartData[0].value / maxValue) * 200}
                      L 160 ${320 - (chartData[1].value / maxValue) * 200}
                      L 240 ${320 - (chartData[2].value / maxValue) * 200}
                      L 320 ${320 - (chartData[3].value / maxValue) * 200}
                      L 320 320 L 80 320 Z`}
                  fill="url(#areaGradient)"
                />

                {/* Line */}
                <path
                  d={`M 80 ${320 - (chartData[0].value / maxValue) * 200}
                      L 160 ${320 - (chartData[1].value / maxValue) * 200}
                      L 240 ${320 - (chartData[2].value / maxValue) * 200}
                      L 320 ${320 - (chartData[3].value / maxValue) * 200}`}
                  stroke="url(#lineGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points */}
                {chartData.map((item, idx) => (
                  <g key={idx}>
                    <circle
                      cx={80 + idx * 80}
                      cy={320 - (item.value / maxValue) * 200}
                      r="8"
                      fill="#fff"
                      stroke={item.color}
                      strokeWidth="4"
                      className="drop-shadow-lg"
                    />
                    <text
                      x={80 + idx * 80}
                      y={340}
                      textAnchor="middle"
                      className="text-sm font-semibold fill-slate-700"
                    >
                      {item.status}
                    </text>
                  </g>
                ))}

                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="25%" stopColor="#06b6d4" />
                    <stop offset="75%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            height: var(--final-height);
            opacity: 1;
          }
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
};

export default Dashboard;