import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CloudSun, Menu, X, LogOut, User, ChevronDown, Star, History } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);       // mobile menu
  const [menuOpen, setMenuOpen] = useState(false); // desktop user dropdown
  const menuRef = useRef(null);

  // Close the dropdown when clicking anywhere outside it
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) =>
    `text-sm font-medium ${isActive(path) ? "text-sky-700" : "text-slate-600 hover:text-sky-700"}`;

  return (
    <header className="sticky top-0 z-50">
      <nav className="glass mx-3 mt-3 rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg shadow-black/5 sm:mx-6 sm:mt-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-slate-800">
          <CloudSun className="w-6 h-6 text-sky-600" strokeWidth={2.2} />
          SkyCache
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          <Link to="/" className={linkClass("/")}>Home</Link>
          {user && (
            <>
              <Link to="/favorites" className={linkClass("/favorites")}>Favorites</Link>
              <Link to="/profile" className={linkClass("/profile")}>Profile</Link>
            </>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-white/70 hover:bg-white pl-1.5 pr-3 py-1.5 rounded-full transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center">
                  <User className="w-4 h-4" />
                </span>
                <span className="text-sm font-medium text-slate-700">{user.username}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 glass-card rounded-2xl shadow-xl shadow-black/10 py-2 overflow-hidden">
                  <div className="px-4 py-2 border-b border-slate-200/60">
                    <p className="text-sm font-semibold text-slate-800">{user.username}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <Link
                    to="/favorites"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <Star className="w-4 h-4 text-sky-500" /> Favorites
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <History className="w-4 h-4 text-sky-500" /> Search history
                  </Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-sky-700">Login</Link>
              <Link
                to="/register"
                className="bg-sky-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-sky-700 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button className="sm:hidden text-slate-700" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="glass mx-3 mt-2 rounded-2xl px-5 py-4 flex flex-col gap-3 sm:hidden">
          <Link to="/" onClick={() => setOpen(false)} className="text-slate-700 font-medium">Home</Link>
          {user ? (
            <>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                <span className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center">
                  <User className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{user.username}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <Link to="/favorites" onClick={() => setOpen(false)} className="text-slate-700 font-medium">Favorites</Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="text-slate-700 font-medium">Profile</Link>
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-full text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="text-slate-700 font-medium">Login</Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="bg-sky-600 text-white text-sm font-medium px-4 py-2 rounded-full text-center"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;