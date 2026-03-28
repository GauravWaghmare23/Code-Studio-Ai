import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const { user, setUser } = useContext(UserContext);

  const [projectName, setProjectName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  const fetchProjects = () => {
    axiosInstance
      .get("/projects/list")
      .then((response) => {
        setProjects(response.data.data);
      })
      .catch((error) => {
        console.error("Failed to fetch projects:", error);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  function createProjectHandler(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    axiosInstance
      .post("/projects/create", { name: projectName })
      .then(() => {
        setModalOpen(false);
        setProjectName("");
        fetchProjects();
      })
      .catch((error) => {
        const message = error?.response?.data?.error || "Failed to create project";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function deleteProjectHandler(projectId) {
    axiosInstance
      .delete(`/projects/delete/${projectId}`)
      .then(() => {
        fetchProjects();
      })
      .catch((error) => {
        console.error("Failed to delete project:", error);
      });
  }

  function logoutHandler() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div 
           className="absolute inset-0 opacity-[0.15]" 
           style={{ backgroundImage: "radial-gradient(#ffffff 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }} 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
             <div className="w-10 h-10 bg-linear-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M12 2L2 12L12 22L22 12L12 2z" /></svg>
             </div>
             <div>
                <h1 className="text-2xl font-black tracking-tighter">CodeStudio <span className="text-blue-500">AI</span></h1>
                <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest">{user?.email}</p>
             </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex gap-4"
          >
            <button
              onClick={() => { setError(""); setModalOpen(true); }}
              className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-all active:scale-95 shadow-xl shadow-white/5"
            >
              + Create Project
            </button>
            <button
              onClick={logoutHandler}
              className="px-6 py-2.5 bg-neutral-900 border border-white/5 text-sm font-bold rounded-full hover:bg-neutral-800 transition-all active:scale-95"
            >
              Logout
            </button>
          </motion.div>
        </header>

        {/* PROJECTS GRID */}
        <main>
          <motion.h3 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-8 flex items-center gap-4"
          >
            Active Projects <div className="h-px flex-1 bg-white/5" />
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {projects.length === 0 ? (
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="col-span-full py-32 text-center rounded-3xl bg-neutral-900/20 border border-dashed border-white/10"
                >
                  <p className="text-neutral-500">Your workspace is empty. Start your first mission.</p>
                </motion.div>
              ) : (
                projects.map((project, i) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    onClick={() => navigate("/project", { state: { project } })}
                    className="group relative p-8 rounded-3xl bg-neutral-900/30 border border-white/5 hover:border-white/20 transition-all cursor-pointer backdrop-blur-sm overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
                    
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                           <svg viewBox="0 0 24 24" className="w-6 h-6 fill-neutral-500 group-hover:fill-blue-500 transition-colors">
                               <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
                           </svg>
                       </div>
                       {project.owner?._id === user?.id && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteProjectHandler(project._id); }}
                          className="p-2 rounded-full hover:bg-red-500/20 text-neutral-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                           <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
                        </button>
                      )}
                    </div>

                    <h2 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors lowercase tracking-tight">
                      {project.name}
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex -space-x-2">
                        {project.users?.map((member, j) => (
                           <div key={j} className="w-6 h-6 rounded-full bg-neutral-800 border-2 border-black flex items-center justify-center text-[8px] font-bold text-neutral-400 overflow-hidden" title={member.email}>
                              {member.email[0].toUpperCase()}
                           </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
                         <span>{project.users?.length} collaborators</span>
                         <div className="w-1 h-1 rounded-full bg-neutral-800" />
                         <span>IDE Active</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-100 px-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setModalOpen(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-4xl p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full" />
              
              <h2 className="text-2xl font-black mb-2 text-center tracking-tight">MISSION INITIALIZATION</h2>
              <p className="text-xs text-neutral-500 text-center mb-8 font-mono uppercase tracking-widest">Define your project parameters</p>

              {error && (
                <div className="mb-6 py-2 px-4 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] text-red-500 font-mono text-center uppercase tracking-widest">
                  {error}
                </div>
              )}

              <form onSubmit={createProjectHandler} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Archive Name</label>
                   <input
                    type="text"
                    placeholder="E.G. PROJECT-CYBERPUNK"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                    className="w-full px-5 py-3 rounded-2xl bg-black border border-white/5 text-white placeholder-neutral-700 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm"
                  />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                    loading
                      ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                      : "bg-white text-black hover:bg-neutral-200 active:scale-95 shadow-xl shadow-white/5"
                  }`}
                >
                  {loading ? "PROCESSING..." : "CONFIRM CREATION"}
                </button>
              </form>

              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-neutral-600 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;