import { validationResult } from "express-validator";
import { addUsersToProjectService, createProjectService, deleteProjectService, getAllProjectService, getProjectByIdService } from "../services/project.service.js";
import redisClient from "../services/redis.service.js";
import mongoose from "mongoose";

export const createProject = async(req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
    }

    try {
        const {name} = req.body;
        const userId = req.user.id;

        const newProject = await createProjectService({name, userId});

        const keys = await redisClient.keys(`projects:all:${userId}`);

        if(keys.length > 0){
            await redisClient.del(keys);
        }

        if (!newProject) {
            return res.status(400).json({
                success: false,
                message: "Failed to create project",
                error: "Failed to create project"
            });
        }

        const project = await newProject.populate("users", "email");

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project
        });

    } catch (error) {

        if(error.code === 11000){
            console.error(`Project creation failed: ${error.message}`);
            return res.status(400).json({
                success: false,
                message: "Project with this name already exists",
                error: error.message
            });
        };

        console.error(`Failed to create project: ${error.message}`);
        return res.status(400).json({
            success: false,
            message: `Failed to create project: ${error.message}`,
            error: error.message
        });
    }
}

export const getAllProjects = async(req,res) => {
    try {
        const userId = req.user.id;

        const cachedProjectsKey = `projects:all:${userId}`;

        const cachedProjects = await redisClient.get(cachedProjectsKey);

        if (cachedProjects) {
            return res.status(200).json({
                success: true,
                message: "Projects fetched from cache",
                data: JSON.parse(cachedProjects)
            });
        }

        const projects = await getAllProjectService({userId});

        await redisClient.set(cachedProjectsKey, JSON.stringify(projects));

        return res.status(200).json({
            success: true,
            message: "Projects fetched successfully",
            data: projects
        });

    } catch (error) {
        console.error(`Failed to fetch projects: ${error.message}`);
        return res.status(400).json({
            success: false,
            message: `Failed to fetch projects: ${error.message}`,
            error: error.message
        })
    }
}

export const addUsersToProject = async(req,res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
    }

    try {
        const {projectId, users} = req.body;
        const userId = req.user.id;
        
        const updatedProject = await addUsersToProjectService({projectId, userId, users});

        const keys = await redisClient.keys(`projects:all:${userId}`);

        if(keys.length > 0){
            await redisClient.del(keys);
        }

        if (!updatedProject) {
            return res.status(400).json({
                success: false,
                message: "Failed to add users to project",
                error: "Failed to add users to project"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Users added to project successfully",
            data: updatedProject
        });

    } catch (error) {
        console.error(`Failed to add users to project: ${error.message}`);
        return res.status(400).json({
            success: false,
            message: `Failed to add users to project: ${error.message}`,
            error: error.message
        });
    }
}

export const deleteProject = async(req,res) => {
    try {
        const {projectId} = req.params;

        const userId = req.user.id;

        const deletedProject = await deleteProjectService({projectId, userId});

         const keys = await redisClient.keys(`projects:all:${userId}`);

        if(keys.length > 0){
            await redisClient.del(keys);
        }

        if (!deletedProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            data: deletedProject
        });

    } catch (error) {

        console.error(`Failed to delete project: ${error.message}`);
        return res.status(400).json({
            success: false,
            message: `Failed to delete project: ${error.message}`,
            error: error.message
        });
    }
}

export const getProjectById = async (req,res) => {
    try {
        const {projectId} = req.params;
        const userId = req.user.id;

        const project = await getProjectByIdService({projectId, userId});

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project fetched successfully",
            data: project
        });

    } catch (error) {
        console.error(`Failed to fetch project: ${error.message}`);
        return res.status(400).json({
            success: false,
            message: `Failed to fetch project: ${error.message}`,
            error: error.message
        });
    }
}
   