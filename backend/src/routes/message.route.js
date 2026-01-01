import express from "express";
import {
  getAllContacts,
  getMessagesByUserId,
  sendMessage,
  getChatPartners,
  deleteChatForMe,
  deleteMessageBothUsers,
  deleteMessageForMe,
  markReadMessage
} from "../controllers/message.controller.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();
router.use(arcjetProtection, protectRoute);
router.get("/contacts",  getAllContacts);
router.get("/chats",  getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id" , sendMessage);
router.delete("/chat/:id", deleteChatForMe);
router.delete("/message/:id", deleteMessageBothUsers);
router.delete("/message/me/:id", deleteMessageForMe);
router.put("/mark-read/:id", markReadMessage);
export default router;
