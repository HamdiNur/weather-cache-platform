function FavoriteCities({ favorites, onRemove }) {
  if (!favorites || favorites.length === 0) {
    return <p className="text-gray-500 text-center mt-6">No favorite cities yet.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-6 flex flex-col gap-3">
      {favorites.map((fav) => (
        <div
          key={fav.id}
          className="bg-white shadow rounded-lg px-4 py-3 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold text-gray-800">{fav.city}</p>
            {fav.country && <p className="text-sm text-gray-500">{fav.country}</p>}
          </div>
          <button
            onClick={() => onRemove(fav.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default FavoriteCities;