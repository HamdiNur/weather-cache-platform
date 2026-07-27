function PopularCities({ cities, onSelect }) {
  if (!cities || cities.length === 0) return null;

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h3 className="text-white/80 text-sm font-semibold mb-3 font-display">🔥 Trending now</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {cities.map((item) => (
          <button
            key={item.city}
            onClick={() => onSelect(item.city)}
            className="glass rounded-full px-4 py-2 text-sm text-slate-700 font-medium hover:bg-white/80 transition-colors"
          >
            {item.city} <span className="text-slate-400">· {item.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default PopularCities;