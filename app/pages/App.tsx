"use client"
import { useState } from "react";

const App = () => {
  const [viewMode, setViewMode] = useState("Bar");

  const metrics = [
    { value: "48", label: "Total Researches", color: "from-teal-500 to-emerald-500" },
    { value: "15", label: "Under Review", color: "from-teal-600 to-emerald-600" },
    { value: "16", label: "This Month", color: "from-emerald-500 to-teal-500" },
    { value: "41", label: "Completed", color: "from-emerald-600 to-teal-600" }
  ];

  const chartData = [
    { status: "Pending", value: 41 },
    { status: "Approved", value: 8 },
    { status: "Published", value: 6 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Analytics Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Research Analytics</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode(viewMode === "Bar" ? "Line" : "Bar")}
              className="px-3 py-1 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
            >
              {viewMode} View
            </button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Refresh
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${metric.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="text-3xl font-bold mb-2">{metric.value}</div>
              <div className="text-white/80 text-sm font-medium">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Visitor Trends Chart */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Research Trends</h3>
          <div className="relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 h-64 flex flex-col justify-between text-sm text-gray-500 py-2">
              <span>60</span>
              <span>45</span>
              <span>30</span>
              <span>15</span>
              <span>0</span>
            </div>

            {/* Chart area with animated transitions */}
            <div className="ml-8 h-64 relative border-l border-b border-gray-300 overflow-hidden">
              {/* Bar Chart */}
              <div 
                className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                  viewMode === "Bar" 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                }`}
              >
                <div className="h-full flex items-end space-x-12 px-4">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className={`bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg w-16 hover:from-teal-700 hover:to-teal-500 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 ${
                          viewMode === "Bar" ? 'animate-grow-up' : ''
                        }`}
                        style={{
                          height: `${(item.value / maxValue) * 200}px`,
                          minHeight: '4px',
                          animationDelay: `${index * 150}ms`
                        }}
                        title={`${item.status}: ${item.value} researches`}
                      ></div>
                      <div className={`mt-3 text-sm font-medium text-gray-700 transition-all duration-500 ${
                        viewMode === "Bar" ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`} style={{ transitionDelay: `${index * 100 + 200}ms` }}>
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Line Chart */}
              <div 
                className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                  viewMode === "Line" 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                }`}
              >
                <div className="h-full relative">
                  <svg className="w-full h-full" viewBox="0 0 400 250">
                    {/* Animated grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="40"
                        y1={40 + i * 42}
                        x2="360"
                        y2={40 + i * 42}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                        className={`transition-opacity duration-500 ${
                          viewMode === "Line" ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                    
                    {/* Area fill under line with gradient animation */}
                    <path
                      d={`M 80 ${250 - (chartData[0].value / maxValue) * 168} L 200 ${250 - (chartData[1].value / maxValue) * 168} L 320 ${250 - (chartData[2].value / maxValue) * 168} L 320 250 L 80 250 Z`}
                      fill="url(#gradient)"
                      opacity="0.3"
                      className={`transition-all duration-1000 ${
                        viewMode === "Line" ? 'opacity-30 scale-100' : 'opacity-0 scale-95'
                      }`}
                      style={{ 
                        transformOrigin: 'bottom',
                        transitionDelay: '400ms'
                      }}
                    />
                    
                    {/* Animated line path */}
                    <path
                      d={`M 80 ${250 - (chartData[0].value / maxValue) * 168} L 200 ${250 - (chartData[1].value / maxValue) * 168} L 320 ${250 - (chartData[2].value / maxValue) * 168}`}
                      stroke="#0d9488"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-all duration-1000 ${
                        viewMode === "Line" ? 'animate-draw-line' : ''
                      }`}
                      style={{
                        strokeDasharray: viewMode === "Line" ? '1000' : '0',
                        strokeDashoffset: viewMode === "Line" ? '0' : '1000',
                        transitionDelay: '200ms'
                      }}
                    />
                    
                    {/* Animated data points */}
                    {chartData.map((item, index) => (
                      <g key={index}>
                        <circle
                          cx={80 + index * 120}
                          cy={250 - (item.value / maxValue) * 168}
                          r="6"
                          fill="#0d9488"
                          stroke="#ffffff"
                          strokeWidth="2"
                          className={`transition-all duration-500 cursor-pointer hover:r-8 ${
                            viewMode === "Line" ? 'animate-bounce-in opacity-100 scale-100' : 'opacity-0 scale-0'
                          }`}
                          style={{ 
                            transitionDelay: `${index * 150 + 600}ms`,
                            transformOrigin: 'center'
                          }}
                        />
                        <text
                          x={80 + index * 120}
                          y={270}
                          textAnchor="middle"
                          className={`text-sm fill-gray-700 font-medium transition-all duration-500 ${
                            viewMode === "Line" ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                          }`}
                          style={{ transitionDelay: `${index * 100 + 700}ms` }}
                        >
                          {item.status}
                        </text>
                        
                        <title>{`${item.status}: ${item.value} researches`}</title>
                      </g>
                    ))}
                    
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0d9488" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0.1"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes grow-up {
            from {
              height: 0;
              opacity: 0;
              transform: scaleY(0);
            }
            to {
              height: var(--final-height);
              opacity: 1;
              transform: scaleY(1);
            }
          }
          
          @keyframes draw-line {
            from {
              stroke-dashoffset: 1000;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          
          @keyframes bounce-in {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .animate-grow-up {
            animation: grow-up 0.6s ease-out forwards;
            transform-origin: bottom;
          }
          
          .animate-draw-line {
            animation: draw-line 1s ease-in-out forwards;
          }
          
          .animate-bounce-in {
            animation: bounce-in 0.4s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

export default App;