import React from "react";

const Header = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "search", label: "Discover", icon: "🔍", description: "Find Movies" },
    {
      id: "watchlist",
      label: "Watchlist",
      icon: "📝",
      description: "To Watch",
    },
    { id: "watched", label: "Watched", icon: "✅", description: "History" },
  ];

  return (
    <header className="glass-effect sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg float-animation">
                <span className="text-2xl text-white">🎬</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold gradient-text">
                CineTrack
              </h1>
              <p className="text-sm text-gray-600 hidden md:block">
                Your Personal Movie Manager
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center px-4 py-2 rounded-xl font-semibold transition-all duration-300 min-w-20 ${
                  activeTab === tab.id
                    ? "bg-white text-purple-600 shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white hover:bg-opacity-50"
                }`}
              >
                <span className="text-lg mb-1">{tab.icon}</span>
                <span className="text-sm">{tab.label}</span>
                <span className="text-xs opacity-70 mt-0.5">
                  {tab.description}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
