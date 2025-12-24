/**
 * Create HTTP server and attach to Socket.io for real time communication
 */
import { Server } from "socket.io";
import express from "express";
import http from "http";
import { socketAuthMiddleware } from "./socket.auth.middleware.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  },
});
io.use(socketAuthMiddleware);
/**
 * Socket.Io online user tracking
 * Purpose
 * -keep track of current online user
 * -Map each authenticated user to their socketId
 * 
 * How its works
 * -When a user connects, their socketId is stored using their userId as the key
 * -All connected users are notified with the updated user online list
 * -When a user disconnect, their  userId is removed from the userSocketMap
 * -Online user list is broadcast again after disconnect
 * 
 * Data Structure
 * const userSocketMap = {
 *    userId: socketId
 * }
 * 
 * Usage
 * -Showing online user
 * -Sending message in real time to the online users
 */
export function getReceiverId(userId){
  return userSocketMap[userId];
}
const userSocketMap = {}; 
io.on("connection", (socket)=> {
  console.log("A user is connected", socket.user.fullName);
  const userId = socket.userId;
  userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", ()=>{
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
  
});
export {app, io, server}