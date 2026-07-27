import { useState } from "react";
import { Search } from "lucide-react";

function SearchBar({ onSearch, loading }) {
  const [city, setCity] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (city.trim()) onSearch(city.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass flex items-center gap-2 max-w-md w-full mx-auto rounded-full p-2 shadow-lg shadow-black/10"
    >
      <Search className="w-5 h-5 text-slate-400 ml-3" />
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Search any city..."
        className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 py-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-sky-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-sky-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

export default SearchBar;