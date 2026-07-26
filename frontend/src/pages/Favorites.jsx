import { useState, useEffect } from "react";
import api from "../services/api";
import FavoriteCities from "../components/FavoriteCities";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  async function fetchFavorites() {
    setLoading(true);
    try {
      const response = await api.get("/favorites");
      setFavorites(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load favorites");
    } finally {
      setLoading(false);
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

  // Guests shouldn't see this page at all — redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        ⭐ Your Favorite Cities
      </h1>

      {loading && <Loader />}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && <FavoriteCities favorites={favorites} onRemove={handleRemove} />}
    </div>
  );
}

export default Favorites;