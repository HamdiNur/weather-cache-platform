import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-24">
      <span className="text-6xl mb-4">🧭</span>
      <h1 className="font-display text-3xl font-bold text-white mb-2">Lost in the clouds</h1>
      <p className="text-white/70 mb-6">This page doesn't exist. Let's get you back on the ground.</p>
      <Link
        to="/"
        className="bg-white text-sky-700 font-semibold px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;