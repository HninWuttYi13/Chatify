/**
 * Backend is integrated with Socket.io for real time messaging, authentication and database connectivity
 * Dependencies
 *  -express       => web framework for handling HTTP requests
 *  -cors          => Middleware to enable Cross-Origin platform sharing
 *  -cookie-parser => Middleware to parse cookie from client request
 *  -dot-env       => Load environment variables from .env file
 *  -Socket.io     => Real time bidirectional communication
 *  -MongoDB       => database connection from connectDB()
 *  -Routers       => handles authentication and messaging routes
 */
import express from "express";
import "./src/config/dotenv.js";
import cors from "cors";
import authRouter from "./src/routes/auth.routes.js";
import messageRouter from "./src/routes/message.route.js";
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import { app, server } from "./src/lib/socket.js";

app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser())
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
const PORT = process.env.PORT || 3000;
server.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB()
});
