import React, { useState, useEffect } from "react";
import { MovieProvider } from "./context/MovieContext";
import Header from "./components/Header";
import SearchMovies from "./components/SearchMovies";
import Watchlist from "./components/Watchlist";
import Watched from "./components/Watched";
import DataManager from "./components/DataManager";

function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return <SearchMovies />;
      case "watchlist":
        return <Watchlist />;
      case "watched":
        return <Watched />;
      default:
        return <SearchMovies />;
    }
  };

  return (
    <MovieProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* Online Status Indicator */}
        {!isOnline && (
          <div className="bg-yellow-500 text-white text-center py-2 px-4 fixed top-0 left-0 right-0 z-50 animate-pulse">
            ⚠️ You are offline. Some features may be limited.
          </div>
        )}

        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="min-h-screen pt-4">{renderContent()}</main>

        {/* Data Manager Floating Button */}
        <DataManager />

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">🎬</span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    CineTrack
                  </p>
                  <p className="text-sm text-gray-500">
                    Your Personal Movie Manager
                  </p>
                </div>
              </div>

              <p className="mb-2">Built with React + Vite + TailwindCSS</p>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mt-3">
                <span className="flex items-center space-x-1">
                  <span>💾</span>
                  <span>Data saved locally</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🔍</span>
                  <span>Movie search</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>📱</span>
                  <span>Mobile friendly</span>
                </span>
              </div>

              <div className="mt-4 text-xs text-gray-400">
                <p>Movie data provided by demo database • Works offline</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </MovieProvider>
  );
}

export default App;
