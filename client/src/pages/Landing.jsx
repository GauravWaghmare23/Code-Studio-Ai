import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
    const mainRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: mainRef,
        offset: ["start start", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    useEffect(() => {
        const sections = document.querySelectorAll(".reveal-section");
        sections.forEach((section) => {
            gsap.fromTo(
                section,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                    },
                }
            );
        });
    }, []);

    return (
        <div ref={mainRef} className="bg-[#050505] text-white selection:bg-blue-500 selection:text-white overflow-hidden font-sans">
            {/* NAVIGATION */}
            <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black"><path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5L6.5 12 12 6.5z" /></svg>
                    </div>
                    <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">Faber <span className="text-blue-500 italic">Studio</span></span>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hidden md:flex gap-1 bg-white/5 backdrop-blur-3xl border border-white/10 p-1 rounded-2xl shadow-2xl"
                >
                    <Link to="/docs" className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">Docs</Link>
                    <Link to="/login" className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">Sign In</Link>
                    <Link to="/register" className="px-6 py-2.5 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">Join Beta</Link>
                </motion.div>

                <div className="md:hidden w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1] 
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600 blur-[180px] rounded-full" 
                    />
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.05, 0.15, 0.05] 
                        }}
                        transition={{ duration: 15, repeat: Infinity, delay: 2 }}
                        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600 blur-[200px] rounded-full" 
                    />
                </div>

                <motion.div 
                    style={{ opacity: opacityHero, y: y1 }}
                    className="relative z-10 max-w-5xl mx-auto"
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10"
                    >
                        Autonomous Development Forge
                    </motion.div>
                    
                    <h1 className="text-6xl md:text-[100px] font-black tracking-tighter leading-[0.9] text-white uppercase mb-8">
                        The Future of <br /> 
                        <span className="text-transparent bg-clip-text bg-linear-to-b from-blue-400 to-blue-700 italic">Rapid Coding</span>
                    </h1>
                    
                    <p className="text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium mb-12">
                        Ditch the setup. Build, collaborate, and deploy full-stack applications with an AI that's as fast as you think.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <Link to="/register" className="group relative px-10 py-5 bg-white text-black rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-blue-500 hover:text-white transition-all shadow-2xl active:scale-95">
                            Join the Guild Free
                            <div className="absolute inset-0 rounded-[24px] bg-white opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                        </Link>
                        <Link to="/docs" className="px-10 py-5 bg-white/5 border border-white/10 rounded-[24px] font-black uppercase tracking-widest text-[10px] text-neutral-400 hover:text-white hover:bg-white/10 transition-all active:scale-95">
                            View Documentation
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* PREVIEW SECTION */}
            <section className="reveal-section py-20 px-6 md:px-20 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        style={{ perspective: 1200 }}
                        className="relative group"
                    >
                        <motion.div 
                            whileHover={{ rotateX: 3, rotateY: -2, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 80 }}
                            className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-2 shadow-[0_0_150px_rgba(37,99,235,0.15)] overflow-hidden"
                        >
                            <div className="bg-[#050505] rounded-[32px] h-[650px] border border-white/5 flex flex-col p-8 md:p-12 relative">
                                <div className="flex justify-between items-center mb-10">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/10 border border-red-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/10 border border-yellow-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/10 border border-green-500/20" />
                                    </div>
                                    <div className="px-5 py-2 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em]">
                                        Quantum Terminal Active
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-12 gap-12 h-full overflow-hidden">
                                    <div className="col-span-3 space-y-8 opacity-10">
                                        <div className="h-4 bg-white/10 rounded-full w-full" />
                                        <div className="h-4 bg-white/10 rounded-full w-[85%]" />
                                        <div className="h-4 bg-white/10 rounded-full w-[95%]" />
                                        <div className="h-4 bg-white/10 rounded-full w-[70%]" />
                                        <div className="h-4 bg-white/10 rounded-full w-[60%]" />
                                        <div className="h-4 bg-white/10 rounded-full w-[80%]" />
                                    </div>
                                    <div className="col-span-9 bg-black/40 rounded-3xl p-10 border border-white/5 font-mono text-[13px] leading-[1.8] relative group/editor">
                                        <div className="text-neutral-700 font-bold mb-4 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                                            {"// Quantum Intelligence Syncing..."}
                                        </div>
                                        <div className="text-blue-500">export <span className="text-purple-400">async</span> function <span className="text-blue-300">initializeNeuralNode</span>() {"{"}</div>
                                        <div className="pl-6 text-neutral-400 italic">{"// Indexing repository graph..."}</div>
                                        <div className="pl-6 text-white"><span className="text-purple-400">await</span> engine.sync(workspace);</div>
                                        <div className="pl-6 text-blue-500">return <span className="text-yellow-400">{"{"}</span> status: <span className="text-green-400">"active"</span> <span className="text-yellow-400">{"}"}</span>;</div>
                                        <div className="text-blue-500">{"}"}</div>
                                        
                                        <div className="mt-12 p-8 rounded-2xl bg-white/2 border border-blue-500/10 relative overflow-hidden group-hover/editor:bg-blue-500/5 transition-all">
                                            <div className="text-[10px] text-blue-500 font-black uppercase mb-2 tracking-widest">Compiler Output</div>
                                            <div className="text-green-400 font-mono text-xs">✔ Neural weights optimized (2.4ms)</div>
                                            <div className="text-green-400 font-mono text-xs">✔ Shadow DOM injected successfully</div>
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl" />
                                        </div>

                                        <motion.div 
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="absolute left-0 bottom-1/4 w-full h-px bg-linear-to-r from-transparent via-blue-500/40 to-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* TRUSTED BY MARQUEE */}
            <section className="reveal-section py-20 border-y border-white/5 relative overflow-hidden">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex items-center gap-20 px-10">
                            <span className="text-3xl font-black text-neutral-800 uppercase tracking-tighter">HyperLogix</span>
                            <span className="text-3xl font-black text-neutral-800 uppercase tracking-tighter">NeuralCore</span>
                            <span className="text-3xl font-black text-neutral-800 uppercase tracking-tighter">QuantOS</span>
                            <span className="text-3xl font-black text-neutral-800 uppercase tracking-tighter">Codex-9</span>
                            <span className="text-3xl font-black text-neutral-800 uppercase tracking-tighter">Atlas.Ai</span>
                        </div>
                    ))}
                </div>
                <div className="absolute inset-y-0 left-0 w-40 bg-linear-to-r from-[#050505] to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-40 bg-linear-to-l from-[#050505] to-transparent z-10" />
            </section>

            {/* FEATURES GRID */}
            <section className="reveal-section py-40 px-6 md:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Forge for the <br /><span className="text-blue-500">Fastest Engineers</span></h2>
                        <div className="w-20 h-1 bg-blue-500 rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Quantum Sync", desc: "Collaborative coding with sub-millisecond latency. Experience real-time like never before.", icon: "⚡" },
                            { title: "Neural Index 2.0", desc: "The world's most advanced reasoning model deeply indexed into your file graph.", icon: "🧠" },
                            { title: "One-Click Deploy", desc: "Push to production environments directly from your workspace with zero friction.", icon: "🚀" }
                        ].map((feature, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-white/2 border border-white/5 p-12 rounded-[40px] hover:bg-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-all" />
                                <div className="text-4xl mb-8 grayscale group-hover:grayscale-0 transition-all">{feature.icon}</div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{feature.title}</h3>
                                <p className="text-neutral-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3D ENGINE DEEP DIVE */}
            <section className="reveal-section py-40 px-6 md:px-20 bg-[#080808]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[9px] font-black uppercase tracking-widest mb-8">System Architecture</div>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-8">
                            A Masterpiece <br /> of <span className="text-blue-500">Inference</span>
                        </h2>
                        <p className="text-neutral-500 text-lg leading-relaxed mb-10 max-w-xl">
                            Faber doesn't just predict text. It maintains a persistent mental model of your entire application architecture in a multi-dimensional vector space.
                        </p>
                        <ul className="space-y-6">
                            {["Multi-file Context Window", "Active Port Scanning", "Automated UI Generation"].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 group">
                                    <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 transition-all">
                                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.59L21 7Z" /></svg>
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest text-neutral-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="relative h-[600px] flex items-center justify-center" style={{ perspective: "1000px" }}>
                        {/* 3D LAYERS - CSS ONLY */}
                        <motion.div 
                            style={{ transformStyle: "preserve-3d" }}
                            animate={{ rotateY: [10, -10, 10], rotateX: [5, -5, 5] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="relative w-full h-full"
                        >
                            {/* LAYER 1: NETWORK */}
                            <div className="absolute inset-0 bg-blue-600/10 border border-blue-500/20 rounded-[40px] shadow-2xl backdrop-blur-3xl p-10 transform translate-z-[100px] flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)]">
                                        <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white"><path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5L6.5 12 12 6.5z" /></svg>
                                    </div>
                                    <h4 className="text-xl font-black uppercase tracking-tighter">AI Core</h4>
                                </div>
                            </div>
                            {/* LAYER 2: FILES */}
                            <div className="absolute inset-10 bg-white/5 border border-white/10 rounded-[40px] transform translate-z-0 opacity-50" />
                            {/* LAYER 3: TERMINAL */}
                            <div className="absolute inset-20 bg-blue-500/10 border border-blue-500/40 rounded-[40px] transform translate-z-[-100px] opacity-20" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="reveal-section py-40 px-6 md:px-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">Elite Feedback</h2>
                        <p className="text-neutral-500 uppercase tracking-widest text-[10px] font-black">Trusted by the worlds most ambitious developers</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Satoshi N.", role: "Cryptographer", text: "Finally an IDE that understands the weight of zero-knowledge architecture. Revolutionary." },
                            { name: "Lexi V.", role: "UI Architect", text: "The generation speed is terrifying. I build entire modules with just two prompts now." },
                            { name: "Marcus K.", role: "CTO @ Atlas", text: "Faber has reduced our prototyping time by at least 80%. It's non-negotiable." }
                        ].map((t, i) => (
                            <div key={i} className="bg-white/2 border border-white/5 p-12 rounded-[50px] relative group hover:bg-white/5 transition-all">
                                <div className="text-blue-500 text-6xl font-serif absolute top-8 left-10 opacity-20">"</div>
                                <p className="text-neutral-300 text-lg leading-relaxed mb-10 relative z-10 italic">{t.text}</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 shadow-xl" />
                                    <div>
                                        <div className="text-[13px] font-black uppercase tracking-tighter text-white">{t.name}</div>
                                        <div className="text-[10px] uppercase font-black tracking-widest text-neutral-600">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section className="reveal-section py-40 px-6 md:px-20 relative overflow-hidden">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-blue-600/5 blur-[150px] rounded-full" />
                 <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-6xl font-black uppercase tracking-tighter text-white mb-6">Simple <span className="text-blue-500">Access</span></h2>
                        <div className="flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest text-neutral-600">
                            <span>ANNUAL</span>
                            <div className="w-10 h-5 bg-blue-600 rounded-full p-1"><div className="w-3 h-3 bg-white rounded-full translate-x-5" /></div>
                            <span className="text-white">MONTHLY</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                         <div className="bg-[#0a0a0a] border border-white/5 p-16 rounded-[60px] relative overflow-hidden group">
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">INDIVIDUAL</h3>
                            <div className="text-5xl font-black mb-10 tracking-tighter">$0 <span className="text-lg text-neutral-600">/mo</span></div>
                            <ul className="space-y-4 mb-12">
                                {["5 Managed Projects", "Standard AI Core", "Community Support"].map((item, i) => (
                                    <li key={i} className="text-neutral-500 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                                        <div className="w-1 h-1 rounded-full bg-blue-500" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register" className="block w-full py-5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-white/5 transition-all">Begin Now</Link>
                         </div>

                         <div className="bg-white text-black p-16 rounded-[60px] relative overflow-hidden transform md:scale-105 shadow-[0_40px_100px_rgba(255,255,255,0.1)]">
                            <div className="absolute top-10 right-10 px-3 py-1 rounded-full bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest">Recommended</div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">QUANTUM PRO</h3>
                            <div className="text-5xl font-black mb-10 tracking-tighter">$24 <span className="text-lg text-neutral-400">/mo</span></div>
                            <ul className="space-y-4 mb-12 text-neutral-600">
                                {["Infinite Projects", "Full Neural Access", "Premium Hosting", "24/7 Strategy Support"].map((item, i) => (
                                    <li key={i} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register" className="block w-full py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-blue-600 transition-all shadow-xl">Level Up</Link>
                         </div>
                    </div>
                 </div>
            </section>

            {/* LABS COMMUNITY */}
            <section className="reveal-section py-40 px-6">
                <div className="max-w-7xl mx-auto bg-linear-to-br from-[#0c0c0c] to-black border border-white/5 rounded-[60px] p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] pointer-events-none" />
                     <div className="max-w-2xl">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-tight">Join the <br /><span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 italic">Engineers Lab</span></h2>
                        <p className="text-neutral-500 text-lg leading-relaxed mb-8">Participate in strategic sessions, contribute to the open-source neural core, and define the future of autonomous development.</p>
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-4">
                                {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-neutral-800" />)}
                            </div>
                            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">+12k Engineers Online</span>
                        </div>
                     </div>
                     <Link to="https://discord.com" className="px-12 py-12 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center text-center leading-none hover:scale-105 transition-all shadow-2xl active:scale-95 group-hover:bg-blue-500 group-hover:text-white shrink-0">
                        Join Beta <br /> Discord
                     </Link>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="reveal-section py-40 px-6">
                <div className="max-w-7xl mx-auto rounded-[60px] bg-linear-to-b from-blue-600 to-purple-800 p-px shadow-2xl overflow-hidden group">
                    <div className="bg-[#050505] rounded-[59px] p-20 md:p-40 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 blur-[100px] pointer-events-none" />
                        
                        <h2 className="text-5xl md:text-9xl font-black uppercase tracking-tighter text-white mb-10 leading-tight">
                            Build Your <br /> Legion Today
                        </h2>
                        
                        <div className="flex flex-col items-center">
                            <Link to="/register" className="px-12 py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-2xl">
                                Request Access
                            </Link>
                            <p className="mt-8 text-neutral-600 text-[10px] uppercase font-black tracking-widest">Limited Beta Seats Available</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-20 px-8 md:px-20 border-t border-white/5 bg-[#030303]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black"><path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5L6.5 12 12 6.5z" /></svg>
                            </div>
                            <span className="text-xl font-black uppercase tracking-tighter">Faber</span>
                        </div>
                        <p className="text-neutral-600 text-sm max-w-sm leading-relaxed mb-8">Building the world's most advanced autonomous workspace for high-performance development teams.</p>
                        <div className="flex gap-4">
                             {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer" />)}
                        </div>
                    </div>
                    
                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6">Product</h5>
                        <ul className="space-y-4">
                            {["Docs", "Beta Access", "Neural Core", "Quantum Sync"].map(item => <li key={item}><Link to="#" className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">{item}</Link></li>)}
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6">Company</h5>
                        <ul className="space-y-4">
                            {["Privacy", "Terms", "Lab Access", "Contact"].map(item => <li key={item}><Link to="#" className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">{item}</Link></li>)}
                        </ul>
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-700">© 2026 FABER LABS REPO SYSTEM</p>
                    <div className="flex gap-10">
                         <span className="text-[10px] font-black text-neutral-800 uppercase tracking-widest">v1.4.2-PRO</span>
                         <span className="text-[10px] font-black text-neutral-800 uppercase tracking-widest">SHADOW-OS READY</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
