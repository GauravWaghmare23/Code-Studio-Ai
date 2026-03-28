import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Docs = () => {
    const [activeSection, setActiveSection] = useState("intro");

    const chapters = [
        {
            title: "Renaissance",
            items: [
                { name: "The Faber Vision", id: "intro" },
                { name: "Forge Engine Architecture", id: "architecture" },
                { name: "System Pre-requisites", id: "requirements" }
            ]
        },
        {
            title: "Core Mechanics",
            items: [
                { name: "Neural Sync Protocol", id: "sync" },
                { name: "AI Command Matrix", id: "commands" },
                { name: "Filesystem Governance", id: "files" }
            ]
        },
        {
            title: "Security & Operations",
            items: [
                { name: "Auth & Identity", id: "auth" },
                { name: "Advanced Configuration", id: "env" },
                { name: "Disaster Recovery", id: "recovery" }
            ]
        }
    ];

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3,
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
            <aside className="w-72 border-r border-white/5 p-10 fixed h-full overflow-y-auto hidden lg:block bg-[#050505] z-20 scrollbar-hide">
                <Link to="/" className="flex items-center gap-3 mb-16 group">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors shadow-2xl">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black group-hover:fill-white transition-colors"><path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5L6.5 12 12 6.5z" /></svg>
                    </div>
                    <span className="text-sm font-black uppercase tracking-tighter">Faber Docs</span>
                </Link>

                <nav className="space-y-12">
                    {chapters.map((chapter, i) => (
                        <div key={i}>
                            <h4 className="text-[10px] uppercase tracking-[0.3em] text-neutral-600 font-black mb-6">{chapter.title}</h4>
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
            <main className="flex-1 lg:ml-72 p-10 lg:p-24 max-w-6xl relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[180px] pointer-events-none" />

                <article className="relative z-10">
                    {/* SECTION: INTRODUCTION */}
                    <section id="intro" className="mb-40">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <div className="inline-block px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-500 text-[9px] font-black uppercase tracking-[0.2em] mb-8">
                                Codex Protocol v4.2 // Stable
                            </div>
                            <h1 className="text-7xl lg:text-9xl font-black mb-10 tracking-tighter uppercase leading-[0.8] text-transparent bg-clip-text bg-linear-to-b from-white to-neutral-700">
                                The <br /> Artisan <br /> Vision
                            </h1>
                            <p className="text-xl lg:text-3xl text-neutral-400 mb-14 leading-relaxed font-medium max-w-4xl">
                                Faber is more than an IDE. It is an autonomous "Forge" designed for the next era of development, where AI and human engineers collaborate in a high-fidelity, sub-millisecond sync environment.
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <button onClick={() => scrollTo('architecture')} className="px-10 py-5 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95">Enter The Forge</button>
                                <button className="px-10 py-5 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all active:scale-95">Explore Whitepaper</button>
                            </div>
                        </motion.div>
                    </section>

                    {/* SECTION: ARCHITECTURE */}
                    <section id="architecture" className="py-32 border-t border-white/5">
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 italic">01. Forge Engine Architecture</h2>
                        <p className="text-neutral-400 mb-12 text-lg leading-relaxed max-w-3xl">
                            The Forge Engine is a multi-threaded indexing system that maintains a persistent vector-graph of your entire repository. This allows our AI to reason over 100k+ lines of code instantly.
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="bg-white/2 border border-white/5 p-10 rounded-[40px] hover:bg-white/5 transition-all group">
                                <div className="text-blue-500 font-mono text-[10px] uppercase tracking-widest mb-6 px-3 py-1 inline-block bg-blue-500/10 rounded-full border border-blue-500/20">Persistence Layer</div>
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Shadow Filesystem</h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">A virtualized mirroring system that handles file I/O operations asynchronously, preventing IDE lag during heavy AI code generations.</p>
                            </div>
                            <div className="bg-white/2 border border-white/5 p-10 rounded-[40px] hover:bg-white/5 transition-all group">
                                <div className="text-purple-500 font-mono text-[10px] uppercase tracking-widest mb-6 px-3 py-1 inline-block bg-purple-500/10 rounded-full border border-purple-500/20">Inference Layer</div>
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Neural Graph</h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">Proprietary logic mapping that identifies project-wide dependencies, enabling "Impact Analysis" before major refactors.</p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION: REQUIREMENTS */}
                    <section id="requirements" className="py-32 border-t border-white/5">
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 italic">02. Environmental Pre-requisites</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[11px] font-bold uppercase tracking-widest">
                                <thead className="text-neutral-600 border-b border-white/5">
                                    <tr>
                                        <th className="pb-6">Resource</th>
                                        <th className="pb-6">Requirement</th>
                                        <th className="pb-6">Optimal Spec</th>
                                    </tr>
                                </thead>
                                <tbody className="text-neutral-400">
                                    <tr className="border-b border-white/2">
                                        <td className="py-8 text-white">Browser Node</td>
                                        <td className="py-8">Chromium v110+</td>
                                        <td className="py-8 text-blue-500">Brave / Arc Optimized</td>
                                    </tr>
                                    <tr className="border-b border-white/2">
                                        <td className="py-8 text-white">WebSocket Latency</td>
                                        <td className="py-8">&lt; 100ms Burst</td>
                                        <td className="py-8 text-green-500">&lt; 15ms Constant</td>
                                    </tr>
                                    <tr>
                                        <td className="py-8 text-white">Local Storage</td>
                                        <td className="py-8">50MB Min</td>
                                        <td className="py-8">Persistent Indexing En</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* SECTION: NEURAL SYNC */}
                    <section id="sync" className="py-32 border-t border-white/5">
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 italic">03. Neural Sync Protocol</h2>
                        <p className="text-neutral-400 mb-12 text-lg leading-relaxed">
                            Faber utilizes **Fabric-JS**, a custom implementation of CRDTs for collaborative editing. Every keystroke is transformed into a delta-token and broadcasted via our low-latency orbital relays.
                        </p>
                        
                        <div className="bg-[#080808] border border-white/5 p-8 rounded-[40px] relative overflow-hidden group">
                             <div className="flex justify-between items-center mb-8 px-4">
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                                </div>
                                <span className="text-[10px] text-neutral-600 font-mono tracking-widest">FABER-DELTA-ENGINE.TS</span>
                             </div>
                             <pre className="font-mono text-[14px] leading-relaxed text-blue-400/90 overflow-x-auto px-4">
                                <code>{`// Core synchronization logic
export async function syncState(delta: FaberDelta) {
  const node = await ForgeStore.get(delta.target);
  
  if (!node) return ForgeStore.scaffold(delta);

  // Atomic conflict resolution
  return node.apply(delta, {
    latency: LatencyOptimizer.measure(),
    neuralVerify: true
  });
}`}</code>
                             </pre>
                             <div className="absolute bottom-4 right-8 text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">Proprietary Faber Logic</div>
                        </div>
                    </section>

                    {/* SECTION: COMMANDS */}
                    <section id="commands" className="py-32 border-t border-white/5">
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 italic text-blue-500">04. AI Command Matrix</h2>
                        <div className="space-y-6">
                            {[
                                { cmd: "/forge", desc: "Instantiates a new module or component within the project structure.", use: "/forge component Header --glass" },
                                { cmd: "/refact", desc: "Analyzes current file and restructures logic for maximum performance and readability.", use: "/refact current --dry-run" },
                                { cmd: "/audit", desc: "Full security and linting sweep of the active project graph.", use: "/audit --severity=high" },
                                { cmd: "/sync", desc: "Force-syncs the local shadow-DOM with the remote master branch.", use: "/sync --master" }
                            ].map((c, i) => (
                                <div key={i} className="flex flex-col md:flex-row gap-8 p-10 rounded-3xl bg-white/2 border border-white/5 items-center hover:bg-white/5 transition-all">
                                    <div className="px-6 py-2 bg-blue-600/10 border border-blue-500/30 text-blue-500 font-mono text-sm rounded-xl shrink-0">{c.cmd}</div>
                                    <div className="flex-1">
                                        <p className="text-neutral-400 text-sm leading-relaxed mb-2 font-medium">{c.desc}</p>
                                        <div className="text-[10px] font-mono text-neutral-600">USAGE: {c.use}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SECTION: AUTH & IDENTITY */}
                    <section id="auth" className="py-32 border-t border-white/5">
                         <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 italic">05. Auth & Team Governance</h2>
                         <p className="text-neutral-400 mb-12 text-lg">Faber implements multi-signature authorization for all destructive operations and uses AES-256-GCM encryption at the edge.</p>
                         
                         <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { title: "JWT Core", status: "Active" },
                                { title: "RSA Keys", status: "Enforced" },
                                { title: "2FA Neural", status: "Optional" }
                            ].map((a, i) => (
                                <div key={i} className="p-8 rounded-[32px] bg-white/2 border border-white/5 text-center">
                                    <div className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-4">{a.title}</div>
                                    <div className="text-blue-500 font-bold tracking-tighter text-xl">{a.status}</div>
                                </div>
                            ))}
                         </div>
                    </section>

                    {/* SECTION: ENV CONFIG */}
                    <section id="env" className="py-32 border-t border-white/5">
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 italic">06. Advanced Configuration</h2>
                        <div className="bg-white/3 border border-white/5 rounded-[40px] p-12 overflow-hidden relative">
                             <div className="grid md:grid-cols-2 gap-12 font-mono text-[11px] uppercase tracking-widest">
                                <div className="space-y-10">
                                    <div className="group">
                                        <div className="text-blue-500 mb-2">FABER_STRENGHT</div>
                                        <p className="text-neutral-500 text-[9px] lowercase lowercase-normal">Defines the neural inference depth (0.1 - 1.0)</p>
                                    </div>
                                    <div className="group">
                                        <div className="text-blue-500 mb-2">FORGE_SYNC_RETRY</div>
                                        <p className="text-neutral-500 text-[9px] lowercase">Interval for automatic node re-connection (ms)</p>
                                    </div>
                                </div>
                                <div className="space-y-10">
                                    <div className="group">
                                        <div className="text-purple-500 mb-2">AI_HEURISTIC_MODE</div>
                                        <p className="text-neutral-500 text-[9px] lowercase italic">Creative | Balanced | Deterministic</p>
                                    </div>
                                    <div className="group">
                                        <div className="text-purple-500 mb-2">AUTH_TOKEN_EXP</div>
                                        <p className="text-neutral-500 text-[9px] lowercase">JWT standard expiry in ISO formatted string</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </section>

                    {/* FOOTER PAGINATION */}
                    <div className="mt-40 pt-20 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-12">
                         <div className="flex flex-col gap-2 cursor-pointer group">
                            <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Master Chapter</span>
                            <span className="text-2xl font-black uppercase tracking-tighter group-hover:text-blue-500 transition-colors italic">00. Introduction</span>
                         </div>
                         <div className="flex flex-col gap-2 text-center md:text-right cursor-pointer group">
                            <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Next Evolution</span>
                            <span className="text-2xl font-black uppercase tracking-tighter group-hover:text-blue-500 transition-colors italic">02. Core Mechanics</span>
                         </div>
                    </div>
                </article>

                <footer className="mt-60 pb-20 text-[10px] font-black text-neutral-800 uppercase tracking-[0.5em] flex flex-col md:flex-row justify-between items-center gap-10">
                    <p>© 2026 FABER SYSTEMS INC. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-10">
                        <Link to="#" className="hover:text-blue-500 transition-colors">SECURITY</Link>
                        <Link to="#" className="hover:text-blue-500 transition-colors">OS STATUS</Link>
                        <Link to="#" className="hover:text-blue-500 transition-colors">GUILD</Link>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Docs;
