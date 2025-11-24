import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
/***
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const protectRoute = async (req, res, next)=>{
    try {
        const token = req.cookies.jwt;
    if(!token) return res.status(401).json({message: "token required"});
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) return res.status(401).json({message: "Incorrect token"});
    const user = await User.findById(decoded.userId).select("-password");
    if(!user) return res.status(404).json({message: "User not found"});
    req.user = user;
    next()
        
    } catch (error) {
        console.log(error, "error in protectRoute middleware");
        res.status(500).json({message: "Internal server error"})
    }
}