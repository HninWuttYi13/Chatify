import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverId, io } from "../lib/socket.js";
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filterUsers);
  } catch (error) {
    console.log("error in getAllContacts", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: otherUserId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId },
      ],
      deletedFor: { $nin: [myId] },
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("error in get message controller", error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    if (!text && !image) {
      return res.status(400).json({ message: "text or image is required" });
    }
    if (senderId === receiverId) {
      return res
        .status(400)
        .json({ message: "Cannot send message to yourself" });
    }
    const receiverExits = await User.exists({ _id: receiverId });
    if (!receiverExits) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessages = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      createdAt: new Date(),
    });
    const receiverSocketId = getReceiverId(receiverId);
    io.to(receiverSocketId).emit("newMessages", newMessages);
    await newMessages.save();
    return res.status(200).json(newMessages);
  } catch (error) {
    console.log("error sending message", error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
      deletedFor: { $nin: [loggedInUserId] },
    });
    const chatPartnersId = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];
    const chatPartners = await User.find({
      _id: { $in: chatPartnersId },
    }).select("-password");
    return res.status(200).json(chatPartners);
  } catch (error) {
    console.log("error in chatPartners", error);
    res.status(500).json({ message: "internal server error" });
  }
};
export const deleteChatForMe = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: chatPartnerId } = req.params;
    await Message.updateMany(
      {
        $or: [
          { senderId: myId, receiverId: chatPartnerId },
          { senderId: chatPartnerId, receiverId: myId },
        ],
      },
      {
        $addToSet: { deletedFor: myId },
      }
    );
    const mySocketId = getReceiverId(myId);
    if (mySocketId)
      io.to(mySocketId).emit("deletedChatHistoryForMe", chatPartnerId);
    return res.status(200).json({ message: "chat deleted successfully" });
  } catch (error) {
    console.log("delete chat error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteMessageBothUsers = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const deleteMessage = await Message.findById(messageId);
    if (!deleteMessage) return res.status(404).json("Message is not found");
    await Message.updateOne(
      { _id: messageId },
      {
        $addToSet: {
          deletedFor: {
            $each: [deleteMessage.senderId, deleteMessage.receiverId],
          },
        },
      }
    );
    const senderSocketId = getReceiverId(deleteMessage.senderId);
    const receiverSocketId = getReceiverId(deleteMessage.receiverId);
    if (senderSocketId) io.to(senderSocketId).emit("messageDeleted", messageId);
    if (receiverSocketId)
      io.to(receiverSocketId).emit("messageDeleted", messageId);
    return res
      .status(200)
      .json({ message: "Message is deleted successfully for both users" });
  } catch (error) {
    console.log("error for delete message", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
export const deleteMessageForMe = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await Message.updateOne(
      { _id: messageId },
      { $addToSet: { deletedFor: myId } }
    );
    const mySocketId = getReceiverId(myId);
    if(mySocketId) io.to(mySocketId).emit("messageDeleted", messageId);
    return res.status(200).json({
      message: "Message deleted for you",
    });
  } catch (error) {
    console.log("deleteMessageForMe error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
