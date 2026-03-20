import { Router } from "express";
import { getResult } from "../controllers/ai.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.get("/get-result",authenticateJWT,getResult);

export default router;