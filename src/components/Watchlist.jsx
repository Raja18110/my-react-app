import React, { useState } from "react";
import { useMovie } from "../context/MovieContext";
import MovieCard from "./MovieCard";

const Watchlist = () => {
  const {
    watchlist,
    addToWatched,
    removeFromWatchlist,
    watched,
    setFilter,
    activeFilter,
  } = useMovie();
  const [sortBy, setSortBy] = useState("added");

  const isInWatched = (movieId) =>
    watched.some((movie) => movie.id === movieId);

  // Filter and sort watchlist
  const getFilteredAndSortedWatchlist = () => {
    let filtered = watchlist;

    // Apply filters
    if (activeFilter === "high-rated") {
      filtered = filtered.filter(
        (movie) => movie.rating !== "N/A" && parseFloat(movie.rating) >= 8
      );
    } else if (activeFilter === "recent") {
      // For demo, we'll assume newer movies have higher IDs
      filtered = [...filtered].sort((a, b) => b.id.localeCompare(a.id));
    }

    // Apply sorting
    switch (sortBy) {
      case "rating":
        return [...filtered].sort((a, b) => {
          const ratingA = a.rating === "N/A" ? 0 : parseFloat(a.rating);
          const ratingB = b.rating === "N/A" ? 0 : parseFloat(b.rating);
          return ratingB - ratingA;
        });
      case "year":
        return [...filtered].sort((a, b) => b.releaseYear - a.releaseYear);
      case "title":
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      case "added":
      default:
        return filtered; // Already in added order (newest first)
    }
  };

  const filteredWatchlist = getFilteredAndSortedWatchlist();

  if (watchlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="text-8xl mb-6 animate-bounce">📝</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Your Watchlist is Empty
          </h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
            Start exploring movies and add them to your watchlist to keep track
            of what you want to watch!
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 max-w-md mx-auto">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center justify-center">
              <span className="mr-2">💡</span>
              Pro Tip
            </h4>
            <p className="text-blue-700 text-sm text-center">
              Use the search feature to discover new movies and click "Add to
              Watchlist" to build your collection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Watchlist</h2>
          <p className="text-gray-600 mt-2">
            {watchlist.length} movie{watchlist.length !== 1 ? "s" : ""} waiting
            to be watched
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === "all"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("high-rated")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === "high-rated"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ⭐ High Rated
            </button>
            <button
              onClick={() => setFilter("recent")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === "recent"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🆕 Recent
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="added">Recently Added</option>
            <option value="rating">Highest Rating</option>
            <option value="year">Release Year</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Watchlist Progress
          </span>
          <span className="text-sm text-gray-600">
            {watched.length} of {watchlist.length + watched.length} watched
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${
                (watched.length / (watchlist.length + watched.length)) * 100 ||
                0
              }%`,
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {Math.round(
            (watched.length / (watchlist.length + watched.length)) * 100
          ) || 0}
          % of your movies watched
        </p>
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredWatchlist.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isInWatchlist={true}
            isInWatched={isInWatched(movie.id)}
            onAddToWatchlist={() => {}}
            onAddToWatched={addToWatched}
            onRemove={removeFromWatchlist}
            onMoveToWatchlist={() => {}}
            onUpdateRating={() => {}}
          />
        ))}
      </div>

      {/* Statistics */}
      <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          📊 Watchlist Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {watchlist.length}
            </div>
            <div className="text-gray-600">To Watch</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {watched.length}
            </div>
            <div className="text-gray-600">Watched</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {watchlist.length + watched.length}
            </div>
            <div className="text-gray-600">Total Movies</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {watchlist.length > 0
                ? (
                    watchlist.reduce((sum, movie) => {
                      const rating =
                        movie.rating === "N/A" ? 0 : parseFloat(movie.rating);
                      return sum + rating;
                    }, 0) / watchlist.length
                  ).toFixed(1)
                : "0"}
            </div>
            <div className="text-gray-600">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
