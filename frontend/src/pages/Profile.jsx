import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  async function fetchHistory() {
    setLoading(true);
    try {
      const response = await api.get("/history");
      setHistory(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">👤 Profile</h1>
      <p className="text-center text-gray-500 mb-6">
        Logged in as <span className="font-semibold">{user.username}</span>
      </p>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Search History</h2>

      {loading && <Loader />}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && history.length === 0 && (
        <p className="text-gray-500 text-center">No searches yet.</p>
      )}

      {!loading && history.length > 0 && (
        <div className="bg-white rounded-xl shadow divide-y">
          {history.map((entry) => {
            const date = new Date(entry.searched_at);
            return (
              <div key={entry.id} className="flex justify-between items-center px-4 py-3">
                <span className="font-medium text-gray-800">{entry.city}</span>
                <div className="text-sm text-gray-500 text-right">
                  <p>{date.toLocaleDateString()}</p>
                  <p>{date.toLocaleTimeString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Profile;