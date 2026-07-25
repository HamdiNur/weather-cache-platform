import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        🌦️ Weather Cache
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>

        {user ? (
          <>
            <Link to="/favorites" className="text-gray-700 hover:text-blue-600">Favorites</Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;