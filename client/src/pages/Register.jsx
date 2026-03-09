import React, { useContext, useState } from "react";
import axiosInstance from "../config/axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  function submitHandler(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all the fields");
      return;
    }

    setLoading(true);

    axiosInstance
      .post("/users/register", { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.data);
        navigate("/");
      })
      .catch((err) => {
        const message = err?.response?.data?.error || "Registration failed";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4">
      {/* Ultra Dark Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,8,8,0.95),#000_75%)]" />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.25) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,0.25) 1.5px, transparent 1.5px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(120,120,120,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,120,0.12) 1px, transparent 1px)",
            backgroundSize: "90px 90px",
          }}
        />

        <div className="absolute -top-40 -left-40 w-125 h-125 bg-indigo-900/20 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-112.5 h-112.5 bg-purple-900/20 blur-[180px] rounded-full" />
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-md bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,1)] p-8">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 rounded-2xl">
            <div className="animate-spin h-7 w-7 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-wide bg-linear-to-r from-gray-200 to-white bg-clip-text text-transparent">
            Code Studio AI
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Create your developer account
          </p>
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-white">Get started</h2>
          <p className="text-gray-500 text-sm mt-1">Join and start building</p>
        </div>

        {/* Error UI */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:shadow-[0_0_12px_rgba(200,200,200,0.4)] transition"
            />
          </div>

          <div>
            <label
              className="block text-sm text-gray-400 mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
              className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:shadow-[0_0_12px_rgba(200,200,200,0.4)] transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-linear-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white font-semibold transition duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-gray-300 hover:text-white font-medium"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
