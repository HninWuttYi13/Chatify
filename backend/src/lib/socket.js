/**
 * Create HTTP server and attach to Socket.io for real time communication
 */
import { Server } from "socket.io";
import express from "express";
import http from "http";
import { socketAuthMiddleware } from "./socket.auth.middleware.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
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
export function getReceiverId(userId) {
  return userSocketMap[userId];
}
const userSocketMap = {};
io.on("connection", (socket) => {
  console.log("A user is connected", socket.user.fullName);
  const userId = socket.userId;
  userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("startTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("displayTyping", { senderId: userId });
    }
  });
  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("hideTyping", { senderId: userId });
    }
  });
  socket.on("call:offer", async ({ receiverId, offer, }) => {
    const receiverSocketId = getReceiverId(receiverId);
    const callMessage = await Message.create({
      senderId: userId,
      receiverId,
      callLog: {
        callType: "audio",
        callStatus: "ringing",
        callDuration: 0,
      },
    });
    if (!receiverSocketId) {
      await Message.findByIdAndUpdate(callMessage._id, {
        "callLog.callStatus": "missed",
      });
      socket.emit("call:unavailable");
    }
    const callerUser = await User.findById(userId).select(
      "_id fullName profilePic",
    );
    const messagePayload = {
      _id: callMessage._id,
      senderId: userId,
      receiverId,
      messageType: "call",
      callLog: callMessage.callLog,
      createdAt: callMessage.createdAt,
    };
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:incoming", {
        callerUser,
        offer,
        messageId: callMessage._id,
      });
      io.to(receiverSocketId).emit("newMessages", messagePayload);
    }
  
    
   socket.emit("newMessages", messagePayload);
  });
  socket.on("call:reject", async({receiverId, messageId})=> {
    const receiverSocketId = getReceiverId(receiverId);
    const updatedMessage = await Message.findByIdAndUpdate(messageId, {
      "callLog.callStatus" :"rejected"
    }, {new: true})
    if(receiverSocketId){
      io.to(receiverSocketId).emit("call:ended");
      io.to(receiverSocketId).emit("updatedMessage", updatedMessage)
    }
    socket.emit("updatedMessage", updatedMessage);
  })
  socket.on("call:answer", async ({ receiverId, answer, messageId }) => {
    const receiverSocketId = getReceiverId(receiverId);
    const updatedMessage = await Message.findByIdAndUpdate(messageId, {
      "callLog.callStatus" : "ongoing"
    }, {new: true})
    const acceptCallUser = await User.findById(userId).select(
      "_id fullName profilePic",
    );
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:accepted", {
        acceptCallUser,
        answer,
        messageId
      });
      io.to(receiverSocketId).emit("updatedMessage", updatedMessage);
    }
    socket.emit("updatedMessage", updatedMessage);

  });
  socket.on("call:end", async({ receiverId, messageId, duration }) => {
    const receiverSocketId = getReceiverId(receiverId);
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        "callLog.callStatus": "completed",
        "callLog.callDuration": duration,
      },
      { new: true },
    );
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:ended");
      io.to(receiverSocketId).emit("updatedMessage", updatedMessage);
    }
    socket.emit("updatedMessage", updatedMessage)
  });
  socket.on("call:ice", ({ receiverId, candidate }) => {
    const receiverSocketId = getReceiverId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:ice", { senderId: userId, candidate });
    }
  });
  socket.on("disconnect", async () => {
    delete userSocketMap[userId];
    const disconnectTime = new Date();
    await User.findByIdAndUpdate(userId, {
      lastOnline: disconnectTime,
    });
    io.emit("offlineUser", {
      userId,
      lastOnline: disconnectTime,
    });
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
export { app, io, server };
