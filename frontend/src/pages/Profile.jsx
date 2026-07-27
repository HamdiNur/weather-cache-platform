import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { User, MapPin, Clock } from "lucide-react";

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
    <div className="px-4 py-12 max-w-2xl mx-auto">
      {/* Profile header card */}
      <div className="glass-card rounded-3xl p-6 flex items-center gap-4 mb-6 shadow-xl shadow-black/10">
        <span className="w-14 h-14 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
          <User className="w-7 h-7" />
        </span>
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">{user.username}</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      {/* History card */}
      <div className="glass-card rounded-3xl p-6 shadow-xl shadow-black/10">
        <h2 className="font-display text-lg font-bold text-slate-900 mb-4">Search History</h2>

        {loading && <Loader />}
        {error && <p className="text-center text-red-600 text-sm">{error}</p>}

        {!loading && history.length === 0 && (
          <p className="text-slate-500 text-center text-sm py-6">No searches yet — go check the weather somewhere!</p>
        )}

        {!loading && history.length > 0 && (
          <div className="divide-y divide-slate-200/70">
            {history.map((entry) => {
              const date = new Date(entry.searched_at);
              return (
                <div key={entry.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-500" />
                    <span className="font-medium text-slate-800">{entry.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;