import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import FavoriteCities from "../components/FavoriteCities";
import { useAuth } from "../context/AuthContext";
import { Star } from "lucide-react";

function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  async function loadFavorites() {
    try {
      const response = await api.get("/favorites");
      const baseFavorites = response.data.data;

      // Show cards immediately in a loading state...
      setFavorites(baseFavorites.map((f) => ({ ...f, loading: true })));

      // ...then fetch live weather for each one in parallel (fast thanks to Redis cache)
      const withWeather = await Promise.all(
        baseFavorites.map(async (fav) => {
          try {
            const res = await api.get("/weather", { params: { city: fav.city } });
            return { ...fav, weather: res.data.data, loading: false };
          } catch {
            return { ...fav, weather: null, loading: false };
          }
        })
      );

      setFavorites(withWeather);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load favorites");
    }
  }

  async function handleRemove(id) {
    try {
      await api.delete(`/favorites/${id}`);
      setFavorites(favorites.filter((fav) => fav.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove favorite");
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="px-4 py-12 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        <h1 className="font-display text-2xl font-bold text-white">Your Favorite Cities</h1>
      </div>

      {error && <p className="text-center text-white bg-red-500/80 rounded-full py-2 text-sm mb-4">{error}</p>}

      <FavoriteCities favorites={favorites} onRemove={handleRemove} />
    </div>
  );
}

export default Favorites;