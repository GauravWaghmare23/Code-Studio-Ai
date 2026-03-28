import mongoose from "mongoose";
import ProjectModel from "../models/project.model.js";

export const createProjectService = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Project name is required");
  }

  if (!userId) {
    throw new Error("User ID is not authorized, please login");
  }

  const existingProject = await ProjectModel.findOne({ name });

  if (existingProject) {
    throw new Error("Project with this name already exists");
  }

  const newProject = await ProjectModel.create({
    name,
    owner: userId,
    users: [userId],
  });

  return newProject;
};

export const getAllProjectService = async ({ userId }) => {
  if (!userId) {
    throw new Error("User ID is not authorized, please login");
  }

  try {
    console.log(`Fetching projects for user ID: ${userId}`);
    const projects = await ProjectModel.find({ users: userId })
      .populate("users", "email")
      .populate("owner", "email");
    return projects;
  } catch (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }
};

export const addUsersToProjectService = async ({
  projectId,
  userId,
  users,
}) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }

  if (!userId) {
    throw new Error("User not authorized, please login");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID");
  }

  if (!users || !Array.isArray(users)) {
    throw new Error("Users must be an array");
  }

  if (users.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    throw new Error("Users must contain valid user IDs");
  }

  const project = await ProjectModel.findOne({
    _id: projectId,
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.owner.toString() !== userId.toString()) {
    throw new Error("Only project owner can add collaborators");
  }

  const updatedProject = await ProjectModel.findByIdAndUpdate(
    projectId,
    {
      $addToSet: {
        users: { $each: users },
      },
    },
    { new: true },
  )
    .populate("users", "email")
    .populate("owner", "email");

  return updatedProject;
};

export const removeUserFromProjectService = async ({
  projectId,
  userId,
  removeUserId,
}) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }

  if (!userId) {
    throw new Error("User not authorized, please login");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID");
  }

  if (!removeUserId) {
    throw new Error("User ID to remove is required");
  }

  if (!mongoose.Types.ObjectId.isValid(removeUserId)) {
    throw new Error("Invalid User ID to remove");
  }

  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.owner.toString() !== userId.toString()) {
    throw new Error("Only project owner can remove collaborators");
  }

  if (project.owner.toString() === removeUserId.toString()) {
    throw new Error("Owner cannot be removed as collaborator");
  }

  const updatedProject = await ProjectModel.findByIdAndUpdate(
    projectId,
    { $pull: { users: removeUserId } },
    { new: true },
  )
    .populate("users", "email")
    .populate("owner", "email");

  if (!updatedProject) {
    throw new Error("Failed to remove collaborator");
  }

  return updatedProject;
};

export const deleteProjectService = async ({ projectId, userId }) => {
  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.owner.toString() !== userId.toString()) {
    throw new Error("Only project owner can delete the project");
  }

  await ProjectModel.findByIdAndDelete(projectId);

  return project;
};

export const getProjectByIdService = async ({ projectId, userId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }
  if (!userId) {
    throw new Error("User not authorized, please login");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID");
  }

  const project = await ProjectModel.findOne({
    _id: projectId,
    users: userId,
  })
    .populate("users", "email")
    .populate("owner", "email");

  return project;
};

export const updateFileTree = async ({ projectId, fileTree }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project ID");
  }

  if (!fileTree) {
    throw new Error("File tree is required");
  }

  const project = await ProjectModel.findByIdAndUpdate(
    projectId,
    { fileTree },
    { new: true }
  );

  return project;
};

