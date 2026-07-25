function WeatherCard({ weather }) {
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full mx-auto mt-6">
      {/* Cache status banner */}
      <div
        className={`text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4 ${
          isHit ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
        }`}
      >
        {isHit ? "Cache Hit ✅" : "Cache Miss ❌"} · {responseTimeMs} ms
      </div>

      <h2 className="text-2xl font-bold text-gray-800">
        {city}, {country}
      </h2>
      <p className="text-gray-500 mb-4">{localTime}</p>

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