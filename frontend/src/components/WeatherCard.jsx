import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function WeatherCard({ weather }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!weather) return null;

  const {
    city,
    country,
    temperature,
    feelsLike,
    description,
    humidity,
    windSpeed,
    pressure,
    localTime,
    cache,
    responseTimeMs,
  } = weather;

  const isHit = cache === "HIT";

  async function handleAddFavorite() {
    setSaving(true);
    try {
      await api.post("/favorites", { city, country });
      setSaved(true);
    } catch (err) {
      // If already favorited (409), still show it as saved — not a real error to the user
      if (err.response?.status === 409) {
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full mx-auto mt-6">
      <div
        className={`text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4 ${
          isHit ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
        }`}
      >
        {isHit ? "Cache Hit ✅" : "Cache Miss ❌"} · {responseTimeMs} ms
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {city}, {country}
          </h2>
          <p className="text-gray-500 mb-4">{localTime}</p>
        </div>

        {user && (
          <button
            onClick={handleAddFavorite}
            disabled={saving || saved}
            className="text-2xl disabled:opacity-40"
            title={saved ? "Saved to favorites" : "Add to favorites"}
          >
            {saved ? "⭐" : "☆"}
          </button>
        )}
      </div>

      <div className="text-5xl font-bold text-blue-600 mb-1">
        {Math.round(temperature)}°C
      </div>
      <p className="text-gray-600 mb-4">
        Feels like {Math.round(feelsLike)}°C · {description}
      </p>

      <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
        <div>
          <p className="text-gray-400 text-sm">Humidity</p>
          <p className="font-semibold">{humidity}%</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Wind</p>
          <p className="font-semibold">{windSpeed} km/h</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Pressure</p>
          <p className="font-semibold">{pressure} hPa</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;