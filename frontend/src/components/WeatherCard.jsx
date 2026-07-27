import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Droplets, Wind, Gauge, Star } from "lucide-react";

function getWeatherEmoji(description = "") {
  const d = description.toLowerCase();
  if (d.includes("clear sky")) return "☀️";
  if (d.includes("mainly clear")) return "🌤️";
  if (d.includes("partly")) return "⛅";
  if (d.includes("overcast")) return "☁️";
  if (d.includes("fog")) return "🌫️";
  if (d.includes("drizzle")) return "🌦️";
  if (d.includes("rain") || d.includes("shower")) return "🌧️";
  if (d.includes("snow")) return "❄️";
  if (d.includes("thunder")) return "⛈️";
  return "🌡️";
}

function WeatherCard({ weather }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!weather) return null;

  const {
    city, country, temperature, feelsLike, description,
    humidity, windSpeed, pressure, localTime, cache, responseTimeMs,
  } = weather;

  const isHit = cache === "HIT";

  async function handleAddFavorite() {
    setSaving(true);
    try {
      await api.post("/favorites", { city, country });
      setSaved(true);
    } catch (err) {
      if (err.response?.status === 409) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
<div className="glass-card rounded-3xl p-8 max-w-md w-full mx-auto shadow-xl shadow-black/10">
      <div className="flex items-center justify-between mb-6">
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
            isHit ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          {isHit ? "⚡ Cache Hit" : "🌐 Cache Miss"} · {responseTimeMs}ms
        </span>

        {user && (
          <button
            onClick={handleAddFavorite}
            disabled={saving || saved}
            className="text-slate-400 hover:text-amber-500 disabled:opacity-60 transition-colors"
            title={saved ? "Saved to favorites" : "Add to favorites"}
          >
            <Star className={`w-6 h-6 ${saved ? "fill-amber-400 text-amber-400" : ""}`} />
          </button>
        )}
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">{city}</h2>
          <p className="text-slate-500 text-sm">{country} · {localTime}</p>
        </div>
        <span className="text-5xl leading-none">{getWeatherEmoji(description)}</span>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-6xl font-extrabold text-slate-900">
          {Math.round(temperature)}°
        </span>
        <span className="text-slate-500 text-sm">
          Feels like {Math.round(feelsLike)}° · {description}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-200/70 pt-5">
        <div className="flex flex-col items-center gap-1">
          <Droplets className="w-4 h-4 text-sky-500" />
          <span className="text-sm font-semibold text-slate-800">{humidity}%</span>
          <span className="text-xs text-slate-400">Humidity</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Wind className="w-4 h-4 text-sky-500" />
          <span className="text-sm font-semibold text-slate-800">{windSpeed} km/h</span>
          <span className="text-xs text-slate-400">Wind</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Gauge className="w-4 h-4 text-sky-500" />
          <span className="text-sm font-semibold text-slate-800">{pressure} hPa</span>
          <span className="text-xs text-slate-400">Pressure</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;