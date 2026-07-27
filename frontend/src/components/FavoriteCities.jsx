import { X } from "lucide-react";

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

function CardSkeleton() {
  return (
    <div className="bg-white/70 rounded-2xl p-5 animate-pulse">
      <div className="h-4 w-24 bg-slate-200 rounded mb-3"></div>
      <div className="h-10 w-16 bg-slate-200 rounded mb-2"></div>
      <div className="h-3 w-32 bg-slate-200 rounded"></div>
    </div>
  );
}

function FavoriteCities({ favorites, onRemove }) {
  if (!favorites || favorites.length === 0) {
    return (
      <p className="text-slate-500 text-center text-sm py-6">
        No favorite cities yet — star a city from the search page to save it here.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {favorites.map((fav) => {
        if (fav.loading) return <CardSkeleton key={fav.id} />;

        const weather = fav.weather;

        return (
          <div
            key={fav.id}
            className="relative bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-sky-900/10 overflow-hidden"
          >
            <button
              onClick={() => onRemove(fav.id)}
              className="absolute top-3 right-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
              title="Remove from favorites"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <p className="font-display font-bold text-lg leading-tight">{fav.city}</p>
            <p className="text-white/70 text-xs mb-3">{fav.country}</p>

            {weather ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl font-extrabold">
                    {Math.round(weather.temperature)}°
                  </span>
                  <span className="text-4xl">{getWeatherEmoji(weather.description)}</span>
                </div>
                <p className="text-white/80 text-xs mt-2">{weather.description}</p>
              </>
            ) : (
              <p className="text-white/60 text-xs mt-4">Weather unavailable</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FavoriteCities;