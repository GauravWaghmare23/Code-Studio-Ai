import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../config/axios";
import { UserContext } from "../context/UserContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) return setError("Please fill all the fields");
        
        setLoading(true);
        try {
            const res = await axiosInstance.post("/users/login", { email, password });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.data);
            navigate("/dashboard");
        } catch (err) {
            setError(err?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden px-4 font-sans">
            {/* ATMOSPHERIC BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.15, 0.1] 
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600 blur-[150px] rounded-full" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.05, 0.1, 0.05] 
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600 blur-[150px] rounded-full" 
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-[440px]"
            >
                {/* LOGO AREA */}
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 mb-6 backdrop-blur-xl shadow-2xl"
                    >
                        <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white"><path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5L6.5 12 12 6.5z" /></svg>
                    </motion.div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">Welcome Back</h1>
                    <p className="text-neutral-500 text-sm font-medium">Continue your journey in <span className="text-blue-500">Code Studio</span></p>
                </div>

                {/* FORM CARD */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl overflow-hidden relative">
                    <AnimatePresence>
                        {loading && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center"
                            >
                                <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder-neutral-700 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-2">Password</label>
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder-neutral-700 font-medium"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? "Authenticating..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-neutral-500 text-xs font-medium">
                            New here? <Link to="/register" className="text-white hover:text-blue-500 transition-colors font-bold ml-1">Create Account</Link>
                        </p>
                    </div>
                </div>

                {/* DECORATIVE ELEMENTS */}
                <div className="mt-8 flex justify-center gap-6 opacity-20">
                   <div className="w-8 h-1 bg-white rounded-full" />
                   <div className="w-8 h-1 bg-white rounded-full" />
                   <div className="w-8 h-1 bg-white rounded-full" />
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

