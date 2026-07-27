import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { CloudSun } from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/register", formData);
      const { user, token } = response.data.data;
      login(user, token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center px-4 py-16">
      <div className="glass-card max-w-sm w-full p-8 rounded-3xl shadow-xl shadow-black/10">
        <div className="flex justify-center mb-4">
          <span className="w-12 h-12 rounded-full bg-sky-600 text-white flex items-center justify-center">
            <CloudSun className="w-6 h-6" />
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-1 text-center">Create account</h1>
        <p className="text-slate-500 text-sm text-center mb-6">Save favorites and track your search history</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text" name="username" placeholder="Username" value={formData.username}
            onChange={handleChange} required
            className="border border-slate-200 bg-white/70 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <input
            type="email" name="email" placeholder="Email" value={formData.email}
            onChange={handleChange} required
            className="border border-slate-200 bg-white/70 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <input
            type="password" name="password" placeholder="Password" value={formData.password}
            onChange={handleChange} required
            className="border border-slate-200 bg-white/70 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="bg-sky-600 text-white font-semibold py-2.5 rounded-xl hover:bg-sky-700 disabled:opacity-50 transition-colors mt-1"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account? <Link to="/login" className="text-sky-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;