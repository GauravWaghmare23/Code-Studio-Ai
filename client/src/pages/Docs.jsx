import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Docs = () => {
    const [activeSection, setActiveSection] = useState("intro");

    const chapters = [
        {
            title: "Getting Started",
            items: [
                { name: "Introduction", id: "intro" },
                { name: "Quick Start Guide", id: "quickstart" },
                { name: "System Requirements", id: "requirements" }
            ]
        },
        {
            title: "Core Concepts",
            items: [
                { name: "Real-time Sync", id: "sync" },
                { name: "AI Commands", id: "ai" },
                { name: "File Management", id: "files" }
            ]
        },
        {
            title: "Deployment",
            items: [
                { name: "Vercel Support", id: "vercel" },
                { name: "Netlify Guide", id: "netlify" }
            ]
        }
    ];

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex selection:bg-blue-500/30">
            {/* SIDEBAR */}
            <aside className="w-72 border-r border-white/5 p-10 fixed h-full overflow-y-auto hidden md:block bg-[#050505] z-20 scrollbar-hide">
                <Link to="/" className="flex items-center gap-3 mb-16 group">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors shadow-2xl">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black group-hover:fill-white transition-colors"><path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5L6.5 12 12 6.5z" /></svg>
                    </div>
                    <span className="text-sm font-black uppercase tracking-tighter">Documentation</span>
                </Link>

                <nav className="space-y-12">
                    {chapters.map((chapter, i) => (
                        <div key={i}>
                            <h4 className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 font-black mb-6">{chapter.title}</h4>
                            <ul className="space-y-4">
                                {chapter.items.map((item, j) => (
                                    <li key={j}>
                                        <button 
                                            onClick={() => scrollTo(item.id)}
                                            className={`text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 group text-left ${activeSection === item.id ? 'text-blue-500' : 'text-neutral-500 hover:text-white'}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full bg-blue-500 transition-all duration-300 ${activeSection === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-50 group-hover:scale-100'}`} />
                                            {item.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 md:ml-72 p-10 md:p-24 max-w-5xl relative">
                {/* DECORATIVE BACKGROUND */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[180px] pointer-events-none" />

                <article className="relative z-10">
                    <section id="intro" className="mb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-block px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-500 text-[9px] font-black uppercase tracking-[0.2em] mb-6">
                                Version 1.0.4 Beta
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.85] text-transparent bg-clip-text bg-linear-to-b from-white to-neutral-500">
                                Introduction
                            </h1>
                            <p className="text-xl md:text-2xl text-neutral-400 mb-12 leading-relaxed font-medium max-w-3xl">
                                Code Studio AI is an autonomous development workspace designed for high-performance teams. Build production-ready applications with zero local configuration.
                            </p>
                            <div className="flex gap-4">
                                <button onClick={() => scrollTo('quickstart')} className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all">Get Started</button>
                                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">View Github</button>
                            </div>
                        </motion.div>
                    </section>

                    <section id="quickstart" className="py-24 border-t border-white/5">
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 italic outline-text">01. Rapid Deployment</h2>
                        <p className="text-neutral-400 mb-12 text-lg">Initialize your entire development environment in under 60 seconds.</p>
                        
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 font-mono text-sm space-y-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full" />
                            <div className="flex gap-8 items-start relative z-10">
                                <span className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[12px] font-black text-blue-500 shrink-0 shadow-lg shadow-blue-500/10">01</span>
                                <div>
                                    <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-[11px]">Identity Sync</h4>
                                    <p className="text-neutral-500 text-[13px] leading-relaxed">Register a new studio instance at <span className="text-blue-500">studio.codex.ai/join</span>. Your neural profile will be generated instantly.</p>
                                </div>
                            </div>
                            <div className="flex gap-8 items-start relative z-10">
                                <span className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[12px] font-black text-purple-500 shrink-0 shadow-lg shadow-purple-500/10">02</span>
                                <div>
                                    <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-[11px]">Stack Initialization</h4>
                                    <p className="text-neutral-500 text-[13px] leading-relaxed">Execute <span className="text-white bg-white/5 px-2 py-0.5 rounded">/init --template=fullstack</span> in the AI console to scaffold your architecture.</p>
                                </div>
                            </div>
                            <div className="flex gap-8 items-start relative z-10">
                                <span className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-[12px] font-black text-green-500 shrink-0 shadow-lg shadow-green-500/10">03</span>
                                <div>
                                    <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-[11px]">Quantum Sync</h4>
                                    <p className="text-neutral-500 text-[13px] leading-relaxed">Invite your team. Changes propagate across the neural network with sub-10ms latency.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="requirements" className="py-24 border-t border-white/5">
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 italic outline-text">02. System Specs</h2>
                        <div className="grid md:grid-cols-2 gap-8 text-[13px] font-medium">
                            <div className="p-8 rounded-3xl bg-white/2 border border-white/5 hover:border-blue-500/30 transition-all">
                                <h4 className="text-blue-400 font-black uppercase tracking-widest mb-4 text-[10px]">Browser Support</h4>
                                <ul className="space-y-3 text-neutral-500">
                                    <li className="flex justify-between border-b border-white/5 pb-2"><span>Chrome</span> <span className="text-white">v90+</span></li>
                                    <li className="flex justify-between border-b border-white/5 pb-2"><span>Edge</span> <span className="text-white">v90+</span></li>
                                    <li className="flex justify-between pb-2"><span>Safari</span> <span className="text-white">v15+</span></li>
                                </ul>
                            </div>
                            <div className="p-8 rounded-3xl bg-white/2 border border-white/5 hover:border-blue-500/30 transition-all">
                                <h4 className="text-purple-400 font-black uppercase tracking-widest mb-4 text-[10px]">Network Latency</h4>
                                <ul className="space-y-3 text-neutral-500">
                                    <li className="flex justify-between border-b border-white/5 pb-2"><span>Optimal</span> <span className="text-white text-green-400">&lt; 20ms</span></li>
                                    <li className="flex justify-between border-b border-white/5 pb-2"><span>Recommended</span> <span className="text-white">&lt; 50ms</span></li>
                                    <li className="flex justify-between pb-2"><span>Standard</span> <span className="text-white text-yellow-500">&lt; 150ms</span></li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section id="sync" className="py-24 border-t border-white/5">
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 italic outline-text">03. Neural Sync</h2>
                        <p className="text-neutral-400 mb-10 text-lg leading-relaxed">Our protocol uses CRDTs (Conflict-free Replicated Data Types) combined with a custom WebSocket bridge to ensure zero collision editing.</p>
                        
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                            <div className="relative bg-[#080808] border border-white/5 p-8 rounded-3xl overflow-hidden">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                                </div>
                                <pre className="font-mono text-[13px] text-blue-400/80 leading-relaxed overflow-x-auto">
                                    <code>{`// Initialize sync engine
const studio = new CodeStudio({
  token: process.env.STUDIO_KEY,
  neural: true,
  sync_mode: 'atomic'
});

// listen for global mutations
studio.on('sync:mutate', (delta) => {
  console.log('Neural delta received:', delta.id);
  applySnapshot(delta.payload);
});`}</code>
                                </pre>
                            </div>
                        </div>
                    </section>

                    {/* PAGINATION */}
                    <div className="mt-40 pt-16 border-t border-white/5 flex justify-between items-center bg-linear-to-b from-transparent to-blue-500/5 -mx-10 px-10 rounded-b-[60px]">
                        <button className="group flex flex-col items-start gap-2">
                            <span className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.2em]">Previous Session</span>
                            <span className="text-lg font-black text-neutral-400 group-hover:text-blue-500 transition-colors uppercase italic">— Introduction</span>
                        </button>
                        <button className="group text-right flex flex-col items-end gap-2">
                            <span className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.2em]">Up Next</span>
                            <span className="text-lg font-black text-neutral-400 group-hover:text-blue-500 transition-colors uppercase italic">Core Concepts —</span>
                        </button>
                    </div>

                    <div className="mt-32 p-12 rounded-[50px] bg-linear-to-br from-blue-600/10 via-[#0a0a0a] to-transparent border border-white/5 flex flex-col md:flex-row gap-12 items-center overflow-hidden relative group">
                         <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] group-hover:bg-blue-500/20 transition-all duration-1000" />
                         <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center shadow-2xl shrink-0 group-hover:rotate-12 transition-all duration-500">
                            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-black"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                         </div>
                         <div className="relative z-10 text-center md:text-left">
                            <h4 className="text-2xl font-black uppercase tracking-tighter mb-3 italic">Strategy & Growth</h4>
                            <p className="text-neutral-500 font-medium leading-relaxed max-w-lg">Our core architectural board is available for consultation regarding enterprise-grade deployments and security modeling.</p>
                            <button className="mt-6 text-[10px] font-black text-blue-500 uppercase tracking-[0.25em] border-b border-blue-500/30 hover:border-blue-500 transition-all pb-1">Enter Strategy Chamber</button>
                         </div>
                    </div>
                </article>

                <footer className="mt-40 text-[9px] font-black text-neutral-700 uppercase tracking-[0.4em] flex justify-between items-center">
                    <span>© 2024 Code Studio Labs</span>
                    <div className="flex gap-8">
                        <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Security</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Nodes</span>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Docs;
