import mongoose from "mongoose";
import ProjectModel from "../models/project.model.js";

export const createProjectService = async({name, userId}) =>{
    
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
        users:[userId]
    });

    return newProject;

}

export const getAllProjectService = async({userId}) => {
    if(!userId){
        throw new Error("User ID is not authorized, please login");
    }

    try {
        console.log(`Fetching projects for user ID: ${userId}`);
        const projects = await ProjectModel.find({ users: userId }).populate("users", "email");
        return projects;
    } catch (error) {
        throw new Error(`Failed to fetch projects: ${error.message}`);
    }
}

export const addUsersToProjectService = async ({ projectId, userId, users }) => {

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

    if (users.some(id => !mongoose.Types.ObjectId.isValid(id))) {
        throw new Error("Users must contain valid user IDs");
    }

    const project = await ProjectModel.findOne({
        _id: projectId,
        users: userId
    });

    if (!project) {
        throw new Error("Project not found or user is not a member");
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(
        projectId,
        {
            $addToSet: {
                users: { $each: users }
            }
        },
        { new: true }
    ).populate("users", "email");

    return updatedProject;
};

export const deleteProjectService = async ({projectId, userId}) => {

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
        users: userId
    }).populate("users", "email");

    if (!project) {
        throw new Error("Project not found or user is not a member");
    }

    const deletedProject = await ProjectModel.findByIdAndDelete(projectId);

    return deletedProject;
};

export const getProjectByIdService = async({projectId, userId}) => {

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
        users: userId
    }).populate("users", "email");

    if (!project) {
        throw new Error("Project not found or user is not a member");
    }

    return project;
}