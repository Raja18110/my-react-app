import React, { useState } from "react";
import { useMovie } from "../context/MovieContext";
import MovieCard from "./MovieCard";

const Watched = () => {
  const {
    watched,
    removeFromWatched,
    moveToWatchlist,
    updatePersonalRating,
    setFilter,
    activeFilter,
  } = useMovie();
  const [sortBy, setSortBy] = useState("recent");

  // Calculate statistics
  const totalWatched = watched.length;
  const averageRating =
    totalWatched > 0
      ? (
          watched.reduce((sum, movie) => {
            const rating =
              movie.rating === "N/A" ? 0 : parseFloat(movie.rating);
            return sum + rating;
          }, 0) / totalWatched
        ).toFixed(1)
      : 0;

  const averagePersonalRating =
    totalWatched > 0
      ? (
          watched.reduce((sum, movie) => {
            const rating = movie.personalRating || 0;
            return sum + rating;
          }, 0) / totalWatched
        ).toFixed(1)
      : 0;

  const highestRated =
    totalWatched > 0
      ? watched.reduce(
          (highest, movie) => {
            const rating =
              movie.rating === "N/A" ? 0 : parseFloat(movie.rating);
            return rating > highest.rating ? { ...movie, rating } : highest;
          },
          { rating: 0 }
        )
      : null;

  const favoriteMovie =
    totalWatched > 0
      ? watched.reduce(
          (fav, movie) => {
            const rating = movie.personalRating || 0;
            return rating > fav.rating ? { ...movie, rating } : fav;
          },
          { rating: 0 }
        )
      : null;

  // Filter and sort watched movies
  const getFilteredAndSortedWatched = () => {
    let filtered = watched;

    // Apply filters
    if (activeFilter === "rated") {
      filtered = filtered.filter(
        (movie) => movie.personalRating && movie.personalRating >= 8
      );
    } else if (activeFilter === "recent-watched") {
      // Already sorted by watched date by default
      filtered = [...filtered].sort(
        (a, b) => new Date(b.watchedDate) - new Date(a.watchedDate)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "personal-rating":
        return [...filtered].sort(
          (a, b) => (b.personalRating || 0) - (a.personalRating || 0)
        );
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
      case "recent":
      default:
        return [...filtered].sort(
          (a, b) => new Date(b.watchedDate) - new Date(a.watchedDate)
        );
    }
  };

  const filteredWatched = getFilteredAndSortedWatched();

  if (watched.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="text-8xl mb-6 animate-pulse">✅</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            No Movies Watched Yet
          </h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
            Mark movies as watched from your watchlist to track what you've
            seen!
          </p>
          <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-2xl p-6 max-w-md mx-auto">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center justify-center">
              <span className="mr-2">🎯</span>
              Getting Started
            </h4>
            <p className="text-green-700 text-sm text-center">
              Go to your watchlist and click "Mark as Watched" to move movies
              here and track your progress.
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
          <h2 className="text-3xl font-bold text-gray-800">Watched Movies</h2>
          <p className="text-gray-600 mt-2">
            {watched.length} movie{watched.length !== 1 ? "s" : ""} completed
            and reviewed
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
              onClick={() => setFilter("rated")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === "rated"
                  ? "bg-yellow-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ⭐ Rated
            </button>
            <button
              onClick={() => setFilter("recent-watched")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === "recent-watched"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🆕 Recently Watched
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="recent">Recently Watched</option>
            <option value="personal-rating">My Rating</option>
            <option value="rating">IMDb Rating</option>
            <option value="year">Release Year</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Watched Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
        {filteredWatched.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isInWatchlist={false}
            isInWatched={true}
            onAddToWatchlist={() => {}}
            onAddToWatched={() => {}}
            onRemove={removeFromWatched}
            onMoveToWatchlist={moveToWatchlist}
            onUpdateRating={updatePersonalRating}
          />
        ))}
      </div>

      {/* Statistics Dashboard */}
      {watched.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 border border-green-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🎯 Your Movie Statistics
          </h3>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {totalWatched}
              </div>
              <div className="text-gray-600">Total Watched</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {averageRating}
              </div>
              <div className="text-gray-600">Avg IMDb Rating</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {averagePersonalRating}
              </div>
              <div className="text-gray-600">Avg Your Rating</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {new Date(
                  Math.min(...watched.map((m) => new Date(m.watchedDate)))
                ).getFullYear()}
              </div>
              <div className="text-gray-600">Tracking Since</div>
            </div>
          </div>

          {/* Top Movies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Highest Rated Movie */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🏆</span>
                Highest Rated
              </h4>
              {highestRated && highestRated.rating > 0 ? (
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    ⭐ {highestRated.rating}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {highestRated.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {highestRated.releaseYear}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No highly rated movies yet
                </p>
              )}
            </div>

            {/* Your Favorite */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">❤️</span>
                Your Favorite
              </h4>
              {favoriteMovie && favoriteMovie.rating > 0 ? (
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    ❤️ {favoriteMovie.personalRating}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {favoriteMovie.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      Your rating: {favoriteMovie.personalRating}/10
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Rate movies to see your favorites
                </p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm max-w-4xl mx-auto">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📈</span>
              Recent Activity
            </h4>
            <div className="space-y-3">
              {watched
                .slice(0, 5)
                .sort(
                  (a, b) => new Date(b.watchedDate) - new Date(a.watchedDate)
                )
                .map((movie, index) => (
                  <div
                    key={movie.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                            : index === 1
                            ? "bg-gradient-to-r from-gray-400 to-gray-500"
                            : index === 2
                            ? "bg-gradient-to-r from-orange-400 to-red-500"
                            : "bg-gradient-to-r from-blue-400 to-purple-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-lg">🎬</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {movie.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Watched{" "}
                            {new Date(movie.watchedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {movie.personalRating && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          ⭐ {movie.personalRating}
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        IMDb: {movie.rating}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watched;
