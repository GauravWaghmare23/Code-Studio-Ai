import { Router } from "express";
import {
  addUsersToProject,
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById
} from "../controllers/project.controller.js";
import { body } from "express-validator";
import { authenticateJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.post(
  "/create",
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Project name must be between 3 and 100 characters"),
  authenticateJWT,
  createProject,
);

router.get("/list", authenticateJWT, getAllProjects);

router.put(
  "/add-users",
  body("projectId").isString().withMessage("Project ID is required"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be an array of user IDs")
    .bail()
    .custom((users) => users.every((user) => typeof user === "string"))
    .withMessage("Each user ID must be a string"),
    authenticateJWT,
  addUsersToProject,
);

router.delete("/delete/:projectId", authenticateJWT, deleteProject);

router.get("/get-project/:projectId", authenticateJWT, getProjectById);

export default router;
