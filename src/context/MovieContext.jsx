import React, { createContext, useContext, useReducer, useEffect } from "react";

const MovieContext = createContext();

// Demo movie data as fallback
const demoMovies = [
  {
    id: "tt0111161",
    title: "The Shawshank Redemption",
    releaseYear: "1994",
    image:
      "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    rating: 9.3,
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    genre: "Drama",
  },
  {
    id: "tt0068646",
    title: "The Godfather",
    releaseYear: "1972",
    image:
      "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    rating: 9.2,
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    genre: "Crime, Drama",
  },
  {
    id: "tt0468569",
    title: "The Dark Knight",
    releaseYear: "2008",
    image:
      "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    rating: 9.0,
    description:
      "When the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological and physical tests.",
    genre: "Action, Crime, Drama",
  },
];

// API Configuration
const API_CONFIG = {
  baseURL: "https://imdb236.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "28184b6de7msh9c1728338fd770ep1d778fjsn58ec231e5a59",
    "x-rapidapi-host": "imdb236.p.rapidapi.com",
  },
};

const initialState = {
  watchlist: [],
  watched: [],
  searchResults: [],
  popularMovies: [],
  loading: false,
  error: null,
  searchQuery: "",
  activeFilter: "all",
};

const movieReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: action.payload, loading: false };

    case "SET_POPULAR_MOVIES":
      return { ...state, popularMovies: action.payload, loading: false };

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };

    case "SET_FILTER":
      return { ...state, activeFilter: action.payload };

    case "ADD_TO_WATCHLIST":
      const isInWatchlist = state.watchlist.find(
        (movie) => movie.id === action.payload.id
      );
      const isInWatched = state.watched.find(
        (movie) => movie.id === action.payload.id
      );

      if (!isInWatchlist && !isInWatched) {
        const newWatchlist = [action.payload, ...state.watchlist];
        localStorage.setItem(
          "cinetrack-watchlist",
          JSON.stringify(newWatchlist)
        );

        return {
          ...state,
          watchlist: newWatchlist,
          searchResults: state.searchResults.filter(
            (movie) => movie.id !== action.payload.id
          ),
        };
      }
      return state;

    case "REMOVE_FROM_WATCHLIST":
      const filteredWatchlist = state.watchlist.filter(
        (movie) => movie.id !== action.payload
      );
      localStorage.setItem(
        "cinetrack-watchlist",
        JSON.stringify(filteredWatchlist)
      );

      return {
        ...state,
        watchlist: filteredWatchlist,
      };

    case "ADD_TO_WATCHED":
      const movieToAdd =
        state.watchlist.find((movie) => movie.id === action.payload.movieId) ||
        state.searchResults.find(
          (movie) => movie.id === action.payload.movieId
        );

      if (movieToAdd) {
        const newWatched = [
          {
            ...movieToAdd,
            watchedDate: new Date().toISOString(),
            personalRating: action.payload.personalRating || null,
          },
          ...state.watched,
        ];

        const newWatchlist = state.watchlist.filter(
          (movie) => movie.id !== action.payload.movieId
        );

        localStorage.setItem(
          "cinetrack-watchlist",
          JSON.stringify(newWatchlist)
        );
        localStorage.setItem("cinetrack-watched", JSON.stringify(newWatched));

        return {
          ...state,
          watchlist: newWatchlist,
          watched: newWatched,
          searchResults: state.searchResults.filter(
            (movie) => movie.id !== action.payload.movieId
          ),
        };
      }
      return state;

    case "REMOVE_FROM_WATCHED":
      const filteredWatched = state.watched.filter(
        (movie) => movie.id !== action.payload
      );
      localStorage.setItem(
        "cinetrack-watched",
        JSON.stringify(filteredWatched)
      );

      return {
        ...state,
        watched: filteredWatched,
      };

    case "MOVE_TO_WATCHLIST":
      const movieToMove = state.watched.find(
        (movie) => movie.id === action.payload
      );
      if (movieToMove) {
        const { watchedDate, personalRating, ...movieWithoutDate } =
          movieToMove;
        const newWatchlist = [movieWithoutDate, ...state.watchlist];
        const newWatched = state.watched.filter(
          (movie) => movie.id !== action.payload
        );

        localStorage.setItem(
          "cinetrack-watchlist",
          JSON.stringify(newWatchlist)
        );
        localStorage.setItem("cinetrack-watched", JSON.stringify(newWatched));

        return {
          ...state,
          watched: newWatched,
          watchlist: newWatchlist,
        };
      }
      return state;

    case "UPDATE_PERSONAL_RATING":
      const updatedWatched = state.watched.map((movie) =>
        movie.id === action.payload.movieId
          ? { ...movie, personalRating: action.payload.rating }
          : movie
      );
      localStorage.setItem("cinetrack-watched", JSON.stringify(updatedWatched));

      return {
        ...state,
        watched: updatedWatched,
      };

    case "LOAD_FROM_LOCALSTORAGE":
      return {
        ...state,
        watchlist: action.payload.watchlist || [],
        watched: action.payload.watched || [],
      };

    case "CLEAR_ALL_DATA":
      localStorage.removeItem("cinetrack-watchlist");
      localStorage.removeItem("cinetrack-watched");
      return {
        ...state,
        watchlist: [],
        watched: [],
      };

    case "IMPORT_DATA":
      const { watchlist: importedWatchlist, watched: importedWatched } =
        action.payload;
      localStorage.setItem(
        "cinetrack-watchlist",
        JSON.stringify(importedWatchlist)
      );
      localStorage.setItem(
        "cinetrack-watched",
        JSON.stringify(importedWatched)
      );
      return {
        ...state,
        watchlist: importedWatchlist || [],
        watched: importedWatched || [],
      };

    default:
      return state;
  }
};

export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  // Load from localStorage on component mount
  useEffect(() => {
    const savedWatchlist =
      JSON.parse(localStorage.getItem("cinetrack-watchlist")) || [];
    const savedWatched =
      JSON.parse(localStorage.getItem("cinetrack-watched")) || [];

    dispatch({
      type: "LOAD_FROM_LOCALSTORAGE",
      payload: {
        watchlist: savedWatchlist,
        watched: savedWatched,
      },
    });

    // Load popular movies on app start
    getPopularMovies();
  }, []);

  // Real API function to get popular movies
  const getPopularMovies = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const url = "https://imdb236.p.rapidapi.com/api/imdb/most-popular-movies";
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "28184b6de7msh9c1728338fd770ep1d778fjsn58ec231e5a59",
          "x-rapidapi-host": "imdb236.p.rapidapi.com",
        },
      };

      console.log("🔄 Fetching popular movies from IMDb API...");
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ API Response:", result);

      // Transform API response to our movie format
      let movies = [];

      if (Array.isArray(result)) {
        movies = result.slice(0, 12).map((movie) => ({
          id: movie.id || `tt${Math.random().toString(36).substr(2, 9)}`,
          title: movie.title || "Unknown Title",
          releaseYear: movie.year || "2023",
          image: movie.image || null,
          rating: movie.rating || "7.5",
          description: movie.description || "Popular movie from IMDb",
          genre: movie.genre || "Various",
        }));
      } else if (result.movies && Array.isArray(result.movies)) {
        movies = result.movies.slice(0, 12).map((movie) => ({
          id: movie.id || `tt${Math.random().toString(36).substr(2, 9)}`,
          title: movie.title || "Unknown Title",
          releaseYear: movie.year || "2023",
          image: movie.image || null,
          rating: movie.rating || "7.5",
          description: movie.description || "Popular movie from IMDb",
          genre: movie.genre || "Various",
        }));
      } else {
        throw new Error("Unexpected API response format");
      }

      if (movies.length === 0) {
        throw new Error("No movies found in API response");
      }

      dispatch({ type: "SET_POPULAR_MOVIES", payload: movies });
      dispatch({ type: "SET_SEARCH_RESULTS", payload: movies });
    } catch (error) {
      console.error("❌ API Error:", error);

      // Fallback to demo data
      console.log("🔄 Falling back to demo data...");
      dispatch({ type: "SET_POPULAR_MOVIES", payload: demoMovies });
      dispatch({ type: "SET_SEARCH_RESULTS", payload: demoMovies });
      dispatch({
        type: "SET_ERROR",
        payload: `Using demo data. API Error: ${error.message}`,
      });
    }
  };

  // Search movies function (using demo data for search since API doesn't have search endpoint)
  const searchMovies = async (query) => {
    if (!query.trim()) {
      // If empty query, show popular movies
      dispatch({ type: "SET_SEARCH_RESULTS", payload: state.popularMovies });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });

    try {
      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Since the provided API doesn't have search, we'll search within popular movies + demo data
      const searchSource = [...state.popularMovies, ...demoMovies];

      const filteredMovies = searchSource.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );

      const movies =
        filteredMovies.length > 0
          ? filteredMovies
          : demoMovies.slice(0, 4).map((movie) => ({
              ...movie,
              title: `${movie.title} (Similar)`,
            }));

      dispatch({ type: "SET_SEARCH_RESULTS", payload: movies });
    } catch (error) {
      console.error("Search error:", error);

      // Fallback to simple demo search
      const filteredMovies = demoMovies
        .filter((movie) =>
          movie.title.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6);

      dispatch({ type: "SET_SEARCH_RESULTS", payload: filteredMovies });
      dispatch({
        type: "SET_ERROR",
        payload: "Using demo search data. Real search API not available.",
      });
    }
  };

  const value = {
    ...state,
    searchMovies,
    getPopularMovies,
    addToWatchlist: (movie) =>
      dispatch({ type: "ADD_TO_WATCHLIST", payload: movie }),
    removeFromWatchlist: (id) =>
      dispatch({ type: "REMOVE_FROM_WATCHLIST", payload: id }),
    addToWatched: (movieId, personalRating) =>
      dispatch({
        type: "ADD_TO_WATCHED",
        payload: { movieId, personalRating },
      }),
    removeFromWatched: (id) =>
      dispatch({ type: "REMOVE_FROM_WATCHED", payload: id }),
    moveToWatchlist: (id) =>
      dispatch({ type: "MOVE_TO_WATCHLIST", payload: id }),
    updatePersonalRating: (movieId, rating) =>
      dispatch({
        type: "UPDATE_PERSONAL_RATING",
        payload: { movieId, rating },
      }),
    setFilter: (filter) => dispatch({ type: "SET_FILTER", payload: filter }),
    clearAllData: () => dispatch({ type: "CLEAR_ALL_DATA" }),
    importData: (data) => dispatch({ type: "IMPORT_DATA", payload: data }),
    exportData: () => ({
      watchlist: state.watchlist,
      watched: state.watched,
      exportDate: new Date().toISOString(),
      totalMovies: state.watchlist.length + state.watched.length,
    }),
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovie must be used within a MovieProvider");
  }
  return context;
};
