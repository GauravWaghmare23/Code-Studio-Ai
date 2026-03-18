import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../config/axios";
import { useEffect } from "react";
import {
  initializeSocket,
  recieveMessage,
  removeListener,
  sendMessage,
} from "../config/socket";
import { useContext } from "react";
import { UserContext } from "./../context/UserContext";
import { useRef } from "react";

const Project = () => {
  const location = useLocation();
  const { project } = location.state;

  const [projectData, setProjectData] = useState(project);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  const [showUserModal, setShowUserModal] = useState(false);
  const [search, setSearch] = useState("");
  const [addUsers, setAddUsers] = useState(new Set());
  const [users, setUsers] = useState([]);
  const { user } = useContext(UserContext);
    const messagesEndRef = useRef(null);
  const isProjectOwner = projectData?.owner?._id === user?.id;

  function usersHandler() {
    axiosInstance
      .get("/users/all")
      .then((res) => {
        console.log(res.data.data);
        setUsers(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function selectUsersHandler(userId) {
    setAddUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      console.log(newSet);
      return newSet;
    });
  }

  function addCollaboratorHandler() {
    axiosInstance
      .put("/projects/add-users", {
        projectId: projectData._id,
        users: Array.from(addUsers),
      })
      .then((res) => {
        if (res.data && res.data.data) {
          setProjectData(res.data.data);
        }
        setAddUsers(new Set());
        setShowUserModal(false);
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to add users");
      });
  }

  function removeCollaboratorHandler(removeUserId) {
    axiosInstance
      .put("/projects/remove-user", {
        projectId: projectData._id,
        userId: removeUserId,
      })
      .then((res) => {
        if (res.data && res.data.data) {
          setProjectData(res.data.data);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to remove collaborator");
      });
  }

  function sendMessagetoServer(e) {
    e.preventDefault();
    console.log(user);

    sendMessage("project-message", {
      message,
      sender: {
        id: user.id,
        email: user.email,
      },
    });

    setMessages((prev) => [
      ...prev,
      {
        text: message,
        sender: {
          id: user.id,
          email: user.email,
        },
        mine: true,
      },
    ]);

    setMessage("");
  }

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (projectData?._id) {
      initializeSocket(projectData._id);

      const listener = (data) => {
    setMessages((prev) => [
      ...prev,
      {
        text: data.message,
        sender: data.sender,
        mine: data.sender.id === user.id,
      },
    ]);
  };

  recieveMessage("project-message", listener);

  return () => {
    removeListener("project-message", listener);
  };
    }
  }, [projectData._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* MEMBERS SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-[25%] bg-black border-r border-white/10 transform transition-transform duration-300 z-20
        ${showMembers ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="font-semibold">Collaborators</h2>

          <div className="flex items-center gap-3">
            {/* Add Collaborator */}
            {isProjectOwner ? (
              <button
                onClick={() => {
                  setShowUserModal(true);
                  usersHandler();
                }}
                className="text-gray-400 hover:text-white"
                title="Add collaborator"
              >
                ➕
              </button>
            ) : (
              <span className="text-gray-400 text-xs">Owner only</span>
            )}

            {/* Close */}
            <button
              onClick={() => setShowMembers(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="p-4 space-y-3">
          {projectData.users?.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between p-2 rounded bg-gray-900 border border-white/10 text-sm"
            >
              <span>{member.email}</span>
              {isProjectOwner && member._id !== user?.id && (
                <button
                  onClick={() => removeCollaboratorHandler(member._id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CHAT PANEL */}
      <div className="w-[25%] border-r border-white/10 flex flex-col bg-black/60 backdrop-blur-md">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/80">
          <div>
            <h2 className="font-semibold text-sm">{project.name}</h2>
            <p className="text-xs text-gray-500">
              {projectData.users?.length} members
            </p>
          </div>

          <button
            onClick={() => setShowMembers(true)}
            className="text-gray-400 hover:text-white"
          >
            👥
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-hide">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 text-sm mt-10">
              No messages yet. Start the conversation 🚀
            </div>
          )}

          {messages.map((msg, index) => {
            const isMine = msg.mine;

            return (
              <div
                key={index}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[75%]">
                  {/* Sender Name */}
                  {!isMine && (
                    <div className="text-xs text-gray-500 mb-1 ml-1">
                      {msg.sender.email}
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm leading-relaxed
              ${
                isMine
                  ? "bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-br-sm shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  : "bg-gray-800 text-gray-200 rounded-bl-sm border border-white/10"
              }`}
                  >
                    {msg.text}
                  </div>

                  {/* Timestamp (optional static for now) */}
                  <div className="text-[10px] text-gray-500 mt-1 px-1">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={sendMessagetoServer}
          className="p-3 border-t border-white/10 bg-black/80"
        >
          <div className="flex items-center gap-2 bg-gray-900 border border-white/10 rounded-xl px-2 py-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-transparent px-2 text-sm focus:outline-none placeholder-gray-500"
            />

            <button
              type="submit"
              disabled={!message.trim()}
              className={`px-4 py-1.5 rounded-lg text-sm transition
          ${
            message.trim()
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-gray-700 cursor-not-allowed"
          }`}
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <h2 className="text-xl mb-2">AI Code Generation Area</h2>
          <p className="text-sm">
            This section will contain AI code generation features.
          </p>
        </div>
      </div>

      {/* ADD USER MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black border border-white/10 rounded-lg w-100 p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Add Collaborator</h2>

              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Search + Add */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-gray-900 border border-white/10 text-sm focus:outline-none"
              />

              {isProjectOwner ? (
                <button
                  onClick={() => addCollaboratorHandler()}
                  disabled={addUsers.size === 0}
                  className={`px-4 py-2 text-sm rounded ${
                    addUsers.size === 0
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500"
                  }`}
                >
                  Add ({addUsers.size})
                </button>
              ) : (
                <div className="text-xs text-red-300">
                  Only project owner can add collaborators.
                </div>
              )}
            </div>

            {/* User List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {filteredUsers.map((user) => {
                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 bg-gray-900 border border-white/10 rounded"
                  >
                    <span className="text-sm">{user.email}</span>

                    <button
                      onClick={() => selectUsersHandler(user._id)}
                      className={`px-3 py-1 text-sm rounded transition ${
                        addUsers.has(user._id)
                          ? "bg-green-600 hover:bg-green-500"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {addUsers.has(user._id) ? "Selected" : "Select"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
