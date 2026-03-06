import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";

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
        const message =
          error?.response?.data?.error || "Failed to create project";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function logoutHandler() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden px-6 py-6">
      {/* Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,10,10,0.95),#000_75%)]" />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.25) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,0.25) 1.5px, transparent 1.5px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-white/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-indigo-900/20 blur-[180px] rounded-full" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
            Code Studio AI
          </h1>

          <p className="text-gray-400 text-sm mt-1">Welcome, {user?.email}</p>
        </div>

        <button
          onClick={logoutHandler}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.1)]"
        >
          Logout
        </button>
      </div>

      {/* Create Project Button */}
      <div className="relative z-10 mb-10">
        <button
          onClick={() => {
            setError("");
            setModalOpen(true);
          }}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 border border-white/10 transition shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          Create Project
        </button>
      </div>

      {/* Projects Area */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="p-6 rounded-xl bg-black/70 border border-white/10">
            <h2 className="text-lg font-semibold mb-2">No Projects</h2>
            <p className="text-gray-400 text-sm">
              No projects found. Create your first project.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="p-6 rounded-xl bg-black/70 border border-white/10 hover:border-white/20 transition"
            >
              <h2 className="text-lg font-semibold mb-2">{project.name}</h2>

              <p className="text-gray-400 text-sm">
                Members: {project.users?.length}
              </p>

              <p className="text-gray-500 text-xs mt-2">
                Owner: {project.users?.[0]?.email}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="relative w-full max-w-md bg-black/80 border border-white/10 rounded-xl p-8 shadow-[0_0_50px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Create New Project
            </h2>

            {/* Error UI */}
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={createProjectHandler} className="space-y-5">
              <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />

              <button
                disabled={loading}
                type="submit"
                className={`w-full py-2.5 rounded-lg font-semibold transition
                ${
                  loading
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                }`}
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
            </form>

            <button
              onClick={() => {
                setModalOpen(false);
                setError("");
              }}
              className="absolute top-3 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
