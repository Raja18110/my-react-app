import React, { useState, useEffect } from "react";
import { useMovie } from "../context/MovieContext";
import MovieCard from "./MovieCard";

const SearchMovies = () => {
  const [query, setQuery] = useState("");
  const {
    searchResults,
    popularMovies,
    loading,
    error,
    searchMovies,
    getPopularMovies,
    addToWatchlist,
    addToWatched,
    watchlist,
    watched,
  } = useMovie();

  const isInWatchlist = (movieId) =>
    watchlist.some((movie) => movie.id === movieId);
  const isInWatched = (movieId) =>
    watched.some((movie) => movie.id === movieId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      searchMovies(query);
    } else {
      // If empty search, show popular movies
      searchMovies("");
    }
  };

  const popularSearches = [
    "action",
    "comedy",
    "drama",
    "sci-fi",
    "horror",
    "adventure",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
          Discover Amazing Movies 🎬
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Search through thousands of movies. Build your watchlist and track
          what you've watched.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8 max-w-2xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies... Try 'action', 'comedy', 'drama'..."
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 text-lg transition-all duration-200 shadow-lg"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              🔍
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center space-x-2 shadow-xl hover:shadow-2xl disabled:shadow-none"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="hidden sm:inline">Searching...</span>
              </>
            ) : (
              <>
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Popular Searches */}
      {!query && !loading && (
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">Try these popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {popularSearches.map((search) => (
              <button
                key={search}
                onClick={() => {
                  setQuery(search);
                  searchMovies(search);
                }}
                className="bg-white border-2 border-gray-200 hover:border-purple-500 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md capitalize"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* API Status */}
      {error && (
        <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-xl mb-6">
          <div className="flex items-start space-x-3">
            <span className="text-xl mt-0.5">ℹ️</span>
            <div>
              <p className="font-semibold">Real IMDb Data</p>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-sm mt-2">
                Showing real popular movies from IMDb API with demo search
                functionality.
              </p>
            </div>
          </div>
        </div>
      )}

      {!error && !loading && searchResults.length > 0 && (
        <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-xl">✅</span>
            <div>
              <p className="font-semibold">Live IMDb Data</p>
              <p className="text-sm">
                Showing real popular movies from IMDb API
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 text-lg">
            {query
              ? "Searching for movies..."
              : "Loading popular movies from IMDb..."}
          </p>
          <p className="text-gray-500 text-sm mt-2">Fetching real movie data</p>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {query
                ? `Search Results (${searchResults.length})`
                : "🔥 Popular Movies from IMDb"}
            </h3>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {searchResults.length} movies found
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {searchResults.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isInWatchlist={isInWatchlist(movie.id)}
                isInWatched={isInWatched(movie.id)}
                onAddToWatchlist={addToWatchlist}
                onAddToWatched={addToWatched}
                onRemove={() => {}}
                onMoveToWatchlist={() => {}}
                onUpdateRating={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchResults.length === 0 && !loading && query && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No movies found
          </h3>
          <p className="text-gray-500 text-lg">
            Try searching with different keywords
          </p>
          <button
            onClick={() => {
              setQuery("");
              searchMovies("");
            }}
            className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            View Popular Movies
          </button>
        </div>
      )}

      {/* Welcome State */}
      {!query && !loading && searchResults.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl border-2 border-dashed border-purple-200">
          <div className="text-6xl mb-6">🎭</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Start Your Movie Journey
          </h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Discover real popular movies from IMDb! Search for specific titles
            or browse the most popular movies right now.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
            <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-2">
              <span>🎬</span>
              <span>Real IMDb Data</span>
            </div>
            <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-2">
              <span>🔥</span>
              <span>Popular Movies</span>
            </div>
            <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-2">
              <span>💾</span>
              <span>Auto Save</span>
            </div>
            <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-2">
              <span>📱</span>
              <span>Mobile Friendly</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchMovies;
