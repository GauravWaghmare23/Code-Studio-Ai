import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import {
  initializeSocket,
  recieveMessage,
  removeListener,
  sendMessage,
} from "../config/socket";
import { UserContext } from "./../context/UserContext";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";

const FileNode = ({ name, node, onSelect, path, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = node.type === "folder";

  return (
    <div className="select-none">
      <motion.div 
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        onClick={() => isFolder ? setIsOpen(!isOpen) : onSelect(node, path)}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
        className={`flex items-center gap-2 py-1.5 cursor-pointer rounded-md transition-colors ${node.active ? 'bg-blue-500/10 text-blue-400' : 'text-neutral-400 hover:text-white'}`}
      >
        <span className="shrink-0 w-4 h-4 flex items-center justify-center">
            {isFolder ? (
                <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 fill-current transition-transform ${isOpen ? 'rotate-90' : ''}`}><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" /></svg>
            ) : (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current opacity-50"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
            )}
        </span>
        <span className="text-[13px] font-medium truncate">{name}</span>
      </motion.div>
      
      {isFolder && isOpen && (
        <div className="overflow-hidden">
          {Object.entries(node.children || {}).sort((a,b) => {
              if (a[1].type === b[1].type) return a[0].localeCompare(b[0]);
              return a[1].type === 'folder' ? -1 : 1;
          }).map(([childName, childNode]) => (
            <FileNode
              key={childName}
              name={childName}
              node={childNode}
              path={`${path}/${childName}`}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { project } = location.state || {};
  
  if (!project) {
    useEffect(() => navigate("/"), []);
    return null;
  }

  const [projectData, setProjectData] = useState(project);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [search, setSearch] = useState("");
  const [addUsers, setAddUsers] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const { user } = useContext(UserContext);
  const messagesEndRef = useRef(null);
  const [sidePanelWidth, setSidePanelWidth] = useState(350); 
  const [isResizing, setIsResizing] = useState(false);
  const [filetree, setFileTree] = useState(projectData?.fileTree || {});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [showIDE, setShowIDE] = useState(!!projectData?.fileTree);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const isProjectOwner = projectData?.owner?._id === user?.id;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/projects/get-project/${project._id}`);
        const data = response.data.data;
        setProjectData(data);
        if (data.fileTree) {
          setFileTree(data.fileTree);
          setShowIDE(true);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      }
    };
    fetchProject();
  }, [project._id]);

  useEffect(() => {
    if (projectData?._id) {
      initializeSocket(projectData._id);
      const listener = (data) => {
        let text = data.message;
        if (data.sender.id === "ai") {
          setIsAiTyping(false);
          try {
            const parsed = JSON.parse(data.message);
            text = parsed.text || "";
            if (parsed.fileTree) {
              setFileTree((prev) => deepMerge(prev, buildTree(parsed.fileTree)));
              setShowIDE(true);
            }
          } catch { text = data.message; }
        }
        setMessages((prev) => [...prev, { text, sender: data.sender, mine: data.sender.id === user.id, isAi: data.sender.id === "ai" }]);
      };
      recieveMessage("project-message", listener);
      recieveMessage("update-filetree", (data) => data.fileTree && setFileTree(data.fileTree));
      recieveMessage("user-count", (data) => setOnlineUsers(data));
      return () => {
        removeListener("project-message", listener);
        removeListener("update-filetree");
        removeListener("user-count");
      };
    }
  }, [projectData._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  function buildTree(files) {
    const root = {};
    Object.keys(files).forEach((path) => {
      const parts = path.split("/");
      let current = root;
      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        if (!current[part]) {
          current[part] = isFile ? { type: "file", contents: files[path].file.contents } : { type: "folder", children: {} };
        }
        if (!isFile) current = current[part].children;
      });
    });
    return root;
  }

  function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key].type === "folder" && result[key] && result[key].type === "folder") {
        result[key] = { ...result[key], children: deepMerge(result[key].children || {}, source[key].children || {}) };
      } else result[key] = source[key];
    }
    return result;
  }

  function sendMessagetoServer(e) {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage("project-message", { message, sender: { id: user.id, email: user.email } });
    setMessages((prev) => [...prev, { text: message, sender: { id: user.id, email: user.email }, mine: true }]);
    if (message.toLowerCase().includes("@ai")) setIsAiTyping(true);
    setMessage("");
  }

  const handleMouseDown = () => setIsResizing(true);
  useEffect(() => {
    const onMove = (e) => { if (isResizing) setSidePanelWidth(Math.max(300, Math.min(600, e.clientX))); };
    const onUp = () => setIsResizing(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [isResizing]);

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans border-t border-white/5">
      
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence>
        {showMembers && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed top-0 left-0 h-full w-80 bg-[#0a0a0a] border-r border-white/5 z-50 shadow-2xl p-6"
          >
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black tracking-tight">COLLABORATORS</h2>
                <button onClick={() => setShowMembers(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-neutral-500"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
                </button>
             </div>

             <div className="space-y-4">
                {projectData.users?.map((member) => (
                  <div key={member._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                            {member.email[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-neutral-300 truncate w-32">{member.email}</span>
                    </div>
                    {isProjectOwner && member._id !== user?.id && (
                        <button onClick={() => {/* handle remove */}} className="opacity-0 group-hover:opacity-100 text-[10px] font-black uppercase text-red-500 hover:underline">Remove</button>
                    )}
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAT PANEL */}
      <motion.div 
        style={{ width: `${sidePanelWidth}px` }}
        className="relative z-10 flex flex-col bg-black/40 backdrop-blur-xl border-r border-white/5 shrink-0"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
           <div>
              <h1 className="text-lg font-black tracking-tighter uppercase">{project.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">{onlineUsers} ACTIVE</span>
              </div>
           </div>
           <button onClick={() => setShowMembers(true)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-neutral-500"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg, i) => {
            const isLastFromSender = i === messages.length - 1 || messages[i + 1].sender.id !== msg.sender.id;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i} 
                className={`flex ${msg.mine ? "justify-end" : "justify-start"} ${isLastFromSender ? "mb-6" : "mb-1"}`}
              >
                <div className={`max-w-[85%] ${msg.mine ? "items-end" : "items-start"} flex flex-col`}>
                  {!msg.mine && i > 0 && messages[i-1].sender.id !== msg.sender.id && (
                    <span className="text-[10px] font-mono text-neutral-600 mb-1 ml-2 uppercase tracking-widest">
                       {msg.isAi ? "CODEPILOT AI" : msg.sender.email.split('@')[0]}
                    </span>
                  )}
                  <div className={`px-4 py-3 text-[13px] leading-relaxed shadow-xl transition-all hover:brightness-110 ${
                    msg.mine ? "bg-white text-black font-semibold rounded-2xl rounded-tr-sm" : 
                    msg.isAi ? "bg-blue-600 shadow-blue-500/10 text-white rounded-2xl rounded-tl-sm border border-blue-400/20" : 
                    "bg-[#151515] border border-white/5 text-neutral-300 rounded-2xl rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {isAiTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start mb-6">
               <div className="flex items-center gap-3 bg-blue-600/10 px-4 py-2.5 rounded-2xl border border-blue-500/20">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Ai is reasoning</span>
               </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessagetoServer} className="p-6 bg-black/20 backdrop-blur-md border-t border-white/5">
           <div className="relative group">
              <input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask AI or chat with team..."
                className="w-full bg-white/3 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder-neutral-700 font-medium"
              />
              <button type="submit" className="absolute right-3 top-3 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all active:scale-90 shadow-lg shadow-blue-500/20">
                 <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
           </div>
        </form>

        <div onMouseDown={handleMouseDown} className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-500/20 transition-colors" />
      </motion.div>

      {/* EDITOR PANEL */}
      <div className="flex-1 flex flex-col z-10 bg-[#080808]/80 backdrop-blur-sm">
        {showIDE ? (
          <div className="flex h-full">
            <div className="w-64 border-r border-white/5 bg-black/20 p-4 shrink-0 overflow-y-auto scrollbar-hide">
               <div className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-6 px-3 flex justify-between items-center">
                  FILE EXPLORER
                  <button className="p-1 hover:bg-white/5 rounded transition-colors group">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-neutral-700 group-hover:fill-blue-400 transition-colors"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                  </button>
               </div>
               <div className="space-y-0.5">
                  {Object.entries(filetree).map(([name, node]) => (
                    <FileNode
                      key={name}
                      name={name}
                      node={node}
                      onSelect={(file, path) => { setSelectedFile(file); setSelectedPath(path); }}
                      path={name}
                    />
                  ))}
               </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="h-12 border-b border-white/5 bg-black/20 flex items-center px-4 gap-2 overflow-x-auto scrollbar-hide">
                  {selectedPath && (
                    <motion.div 
                      layoutId="active-tab"
                      className="h-8 px-4 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3 shrink-0 group transition-all hover:bg-white/10"
                    >
                       <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                       <span className="text-[11px] font-bold text-white tracking-wide truncate max-w-[150px]">{selectedPath.split('/').pop()}</span>
                       <button onClick={() => { setSelectedFile(null); setSelectedPath(null); }} className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded transition-all">
                          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-neutral-500"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
                       </button>
                    </motion.div>
                  )}
                  <div className="flex-1" />
                  <div className="flex items-center gap-4 px-4 border-l border-white/5">
                     <span className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] whitespace-nowrap">Collaborative session</span>
                  </div>
               </div>
               
               {/* BREADCRUMBS */}
               <div className="h-8 px-6 bg-black/10 border-b border-white/5 flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-neutral-700"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                  <span>/</span>
                  <span className="hover:text-blue-400 cursor-pointer transition-colors">projects</span>
                  <span>/</span>
                  <span className="hover:text-blue-400 cursor-pointer transition-colors">{project.name}</span>
                  {selectedPath && (
                    <>
                      <span>/</span>
                      <span className="text-white font-black">{selectedPath}</span>
                    </>
                  )}
               </div>

               <div className="flex-1 relative overflow-hidden group/editorarea">
                  {selectedFile ? (
                    <Editor
                      height="100%"
                      theme="vs-dark"
                      language={selectedFile.language || "javascript"}
                      value={selectedFile.contents || ""}
                      options={{
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', monospace",
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 20 },
                        smoothScrolling: true,
                        cursorBlinking: "expand",
                        lineNumbers: "on"
                      }}
                      onChange={(val) => {
                         const newTree = { ...filetree };
                         const update = (node, pathParts) => {
                           if (pathParts.length === 1) { 
                             if (node[pathParts[0]]) node[pathParts[0]].contents = val; 
                             return; 
                           }
                           if (node[pathParts[0]] && node[pathParts[0]].children) {
                             update(node[pathParts[0]].children, pathParts.slice(1));
                           }
                         };
                         update(newTree, selectedPath.split("/"));
                         setFileTree(newTree);
                         sendMessage("update-filetree", { fileTree: newTree });
                      }}
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12">
                       <div className="w-24 h-24 bg-white/2 rounded-3xl border border-white/5 flex items-center justify-center mb-6">
                          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-neutral-800"><path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5L6.5 12 12 6.5z" /></svg>
                       </div>
                       <h2 className="text-xl font-bold mb-2 tracking-tight">VIRTUAL WORKSPACE READY</h2>
                       <p className="text-sm text-neutral-500 max-w-xs">Select a file from the explorer or ask AI to generate code for you.</p>
                    </div>
                  )}
               </div>

               {/* STATUS BAR */}
               <div className="h-7 bg-[#050505] border-t border-white/5 flex items-center justify-between px-4 z-20 shrink-0">
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5 px-2 bg-blue-500/10 rounded-md">
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-blue-500"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" /></svg>
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Main</span>
                     </div>
                     <div className="flex items-center gap-1.5 opacity-50">
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                        <span className="text-[9px] font-bold text-white uppercase tracking-widest">0 Δ</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     {selectedFile && <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">UTF-8</span>}
                     <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Neural Sync Live</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
             <div className="text-center">
                <div className="w-16 h-16 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Waking up development servers...</p>
             </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100]">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#0d0d0d] border border-white/10 p-10 rounded-4xl w-full max-w-lg relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full" />
                <h2 className="text-2xl font-black mb-8 tracking-tighter uppercase">Recruit Team</h2>
                <div className="space-y-4 mb-8">
                   <p className="text-sm text-neutral-500 italic">"Elite engineers only. Your legion awaits."</p>
                </div>
                <button onClick={() => setShowUserModal(false)} className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all">Close Instance</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Project;
