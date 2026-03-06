import {validationResult} from "express-validator";
import { createUserService, getAllUsersService, loginUserService } from './../services/user.service.js';
import redisClient from "../services/redis.service.js";

export const registerUser = async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
    };

    try {
        
        const {email, password} = req.body;

        const user = await createUserService({email, password});

        const keys = await redisClient.keys(`users:all:*`);
        
        if (keys.length > 0) {
            await redisClient.del(keys);
        }

        const token = user.generateJWT();
        
        res.cookie("token",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: user._id,
                email: user.email
            },
            token: token
        });

    } catch (error) {
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error:"User already exist",
            });
        };

        console.error("Error in registerUser controller:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

export const loginUser = async (req,res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success:false,
            message:"Validation failed",
            error:errors.array()
        });
    }

    try {

        const {email, password} = req.body;

        const user = await loginUserService({email, password});

        const token = user.generateJWT();

        res.cookie("token",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: user._id,
                email: user.email
            },
            token: token
        })
        
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });

    }
}

export const getUserProfile = async (req,res) => {
    try {

        const user = req.user;

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        };

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: {
                id: user.id,
                email: user.email,
            }
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    };
}

export const logoutUser = (req,res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

export const getAllUsers = async (req,res) => {
    try {

        const cacheKey = `users:all:${req.user.id}`;

        const cachedUsers = await redisClient.get(cacheKey);

        if (cachedUsers) {
            return res.status(200).json({
                success: true,
                message: "Users fetched from cache",
                data: JSON.parse(cachedUsers)
            });
        }
        const users = await getAllUsersService({userId: req.user.id});

        await redisClient.set(cacheKey, JSON.stringify(users)); 

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}