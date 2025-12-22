import jwt from "jsonwebtoken";
import User from "../models/User.js";
/**
 * socket.io authentication middleware
 * Executes once during the websocket handshake
 * verifies JWT from cookies and authenticates the user
 *
 * -Reject connection if the token is missing or invalid
 * -Reject connection if the user doesn't exist
 * -Attached authenticated user to the socket
 * @param {import ("socket.io").Socket} socket -Active socket connection
 * @param {(err?: Error)=>void} next    -Callback to continue or reject connection
 */
export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      ?.find((row) => row.startsWith("jwt="))
      ?.split("=")[1];
    if (!token) {
      console.log("Socket connection is rejected: No token is provided");
      return next(new Error("Unauthorized- No token provided"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection is rejected. user is not found");
      return next(new Error("User is not found"));
    }
    //attach user info to socket
    socket.user = user;
    socket.userId = user._id.toString(); //socket data is compared with string
    next();
  } catch (error) {
    console.log("error in socket connection", error.message);
    next(new Error("Unauthorized, authentication failed"));
  }
};
