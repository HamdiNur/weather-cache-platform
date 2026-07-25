import { useState } from "react";
import api from "../services/api";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import Loader from "../components/Loader";

function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(city) {
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await api.get("/weather", { params: { city } });
      setWeather(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        🌦️ Weather Cache Platform
      </h1>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {loading && <Loader />}

      {error && (
        <p className="text-center text-red-600 mt-4 font-medium">{error}</p>
      )}

      {!loading && weather && <WeatherCard weather={weather} />}
    </div>
  );
}

export default Home;