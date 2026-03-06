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