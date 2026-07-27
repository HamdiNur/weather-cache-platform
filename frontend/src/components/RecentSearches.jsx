function RecentSearches({ cities, onSelect }) {
  if (!cities || cities.length === 0) return null;

  return (
    <div className="max-w-lg mx-auto mt-4">
      <h3 className="text-white/80 text-sm font-semibold mb-3 font-display">🕓 Recently searched</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            className="bg-white/20 border border-white/30 rounded-full px-4 py-2 text-sm text-white font-medium hover:bg-white/30 transition-colors"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RecentSearches;