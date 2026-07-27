import { useState, useEffect } from "react";
import api from "../services/api";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import Loader from "../components/Loader";
import PopularCities from "../components/PopularCities";
import RecentSearches from "../components/RecentSearches";

function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [popular, setPopular] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    fetchPopular();
    fetchRecent();
  }, []);

  async function fetchPopular() {
    try {
      const response = await api.get("/popular");
      setPopular(response.data.data);
    } catch (err) {}
  }

  async function fetchRecent() {
    try {
      const response = await api.get("/recent");
      setRecent(response.data.data);
    } catch (err) {}
  }

  async function handleSearch(city) {
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const response = await api.get("/weather", { params: { city } });
      setWeather(response.data.data);
      fetchPopular();
      fetchRecent();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 pb-20 pt-12 sm:pt-16">
      <div className="text-center max-w-lg mx-auto mb-8">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Weather, cached.
        </h1>
        <p className="text-white/70 mt-3 text-sm sm:text-base">
          Real-time weather backed by a Redis cache-aside layer — watch the response time drop on repeat searches.
        </p>
      </div>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {loading && <Loader />}

      {error && (
        <p className="text-center text-white bg-red-500/80 max-w-sm mx-auto mt-6 py-2 px-4 rounded-full text-sm font-medium">
          {error}
        </p>
      )}

      {!loading && weather && (
        <div className="mt-8">
          <WeatherCard weather={weather} />
        </div>
      )}

      {!weather && !loading && (
        <>
          <PopularCities cities={popular} onSelect={handleSearch} />
          <RecentSearches cities={recent} onSelect={handleSearch} />
        </>
      )}
    </div>
  );
}

export default Home;