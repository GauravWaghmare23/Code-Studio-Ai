import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import connect from "./config/dbConnect.js";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import mongoose from "mongoose";
import ProjectModel from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";

connect();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];
    const projectId = socket.handshake.query?.projectId;

    if (!projectId) {
      return next(new Error("Project ID is required"));
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid Project ID"));
    }

    const project = await ProjectModel.findById(projectId);

    socket.project = project;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return next(new Error("Authentication error"));
    }

    socket.user = decodedToken;

    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});


io.on("connection", (socket) => {


  console.log("a user connected : " + socket.id);

  socket.join(socket.project._id.toString());

  const userCount = async () => {
    const clients = await io.in(socket.project._id.toString()).fetchSockets();
    io.to(socket.project._id.toString()).emit("user-count", clients.length);
  }

  userCount();

  socket.on("project-message", async (data) => {

    const messagePayload = {
      message: data.message,
      sender: {
        id: socket.user.id,
        email: socket.user.email,
      },
      fileTree: data.fileTree || socket.project.fileTree,
    };

    console.log("Received message:", messagePayload);

    const aiIsPresentInMessage = messagePayload.message.includes("@ai");

    if (aiIsPresentInMessage) {
      const prompt = messagePayload.message.replace("@ai", "").trim();
      const currentFileTree = data.fileTree || socket.project.fileTree || {};
      
      const result = await generateResult(prompt, currentFileTree);

      socket.emit("project-message", {
        message: result,
        sender: {
          id: "ai",
          email: "ai@ai.com",
        },
      });
      return;
    }

    socket.broadcast
      .to(socket.project._id.toString())
      .emit("project-message", messagePayload);

  });

  socket.on("update-filetree", async (data) => {
    try {
      const { fileTree } = data;
      const projectId = socket.project._id;

      await ProjectModel.findByIdAndUpdate(projectId, { fileTree });
      socket.project.fileTree = fileTree; // Sync in-memory

      socket.broadcast
        .to(projectId.toString())
        .emit("update-filetree", { fileTree });
    } catch (error) {
      console.error("Failed to update fileTree via socket:", error);
    }
  });


  socket.on("disconnect", () => {
    console.log("user disconnected : " + socket.id);
    socket.leave(socket.project._id.toString());
    setTimeout(() => {
      userCount();
    }, 100);
  });
});


const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
