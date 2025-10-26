import React, { useState } from "react";

const MovieCard = ({
  movie,
  isInWatchlist,
  isInWatched,
  onAddToWatchlist,
  onAddToWatched,
  onRemove,
  onMoveToWatchlist,
  onUpdateRating,
}) => {
  const [imageError, setImageError] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [personalRating, setPersonalRating] = useState(
    movie.personalRating || 0
  );

  const getRatingColor = (rating) => {
    if (rating === "N/A") return "bg-gray-100 text-gray-800";
    const numRating = parseFloat(rating);
    if (numRating >= 8)
      return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
    if (numRating >= 6)
      return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
    return "bg-gradient-to-r from-red-500 to-pink-600 text-white";
  };

  const handleAddToWatched = () => {
    setShowRatingModal(true);
  };

  const submitRating = () => {
    onAddToWatched(movie.id, personalRating);
    setShowRatingModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden movie-card-hover border border-gray-100">
        {/* Movie Image */}
        <div className="relative">
          {!imageError && movie.image ? (
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-80 object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-80 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <div className="text-4xl mb-3">🎬</div>
                <p className="font-bold text-lg">{movie.title}</p>
                <p className="text-sm opacity-90 mt-2">No image available</p>
              </div>
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 flex flex-col items-end space-y-2">
            <span
              className={`px-3 py-2 rounded-full text-sm font-bold shadow-lg ${getRatingColor(
                movie.rating
              )}`}
            >
              ⭐ {movie.rating}
            </span>
          </div>

          {/* Status Indicators */}
          {isInWatched && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              ✅ Watched
            </div>
          )}

          {isInWatchlist && !isInWatched && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              📝 In Watchlist
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 font-medium flex items-center">
              <span className="mr-1">📅</span>
              {movie.releaseYear}
            </span>
            {movie.genre && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {movie.genre.split(",")[0]}
              </span>
            )}
          </div>

          {movie.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
              {movie.description}
            </p>
          )}

          {/* Personal Rating Display */}
          {isInWatched && movie.personalRating && (
            <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-semibold text-yellow-800 flex items-center">
                <span className="mr-2">⭐</span>
                Your Rating: {movie.personalRating}/10
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            {!isInWatchlist && !isInWatched && (
              <button
                onClick={() => onAddToWatchlist(movie)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span className="text-lg">+</span>
                <span>Add to Watchlist</span>
              </button>
            )}

            {isInWatchlist && !isInWatched && (
              <>
                <button
                  onClick={handleAddToWatched}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span>✅</span>
                  <span>Mark as Watched</span>
                </button>
                <button
                  onClick={() => onRemove(movie.id)}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Remove from Watchlist
                </button>
              </>
            )}

            {isInWatched && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onMoveToWatchlist(movie.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  ↶ Move Back
                </button>
                <button
                  onClick={() => onRemove(movie.id)}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Rate this Movie
            </h3>
            <p className="text-gray-600 mb-4">
              How would you rate "{movie.title}"?
            </p>

            <div className="flex justify-center space-x-1 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                  key={star}
                  onClick={() => setPersonalRating(star)}
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${
                    personalRating >= star
                      ? "bg-yellow-500 text-white transform scale-110"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-xl font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieCard;
