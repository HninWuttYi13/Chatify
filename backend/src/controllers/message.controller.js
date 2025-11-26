import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
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
    });
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
    });
    const chatPartnersId = [...new Set(messages.map((msg) =>
      msg.senderId.toString() === loggedInUserId.toString() 
      ? msg.receiverId.toString()
     : msg.senderId.toString()
    ))];
    const chatPartners = await User.find({_id: {$in: chatPartnersId}}).select("-password");
    return res.status(200).json(chatPartners)
  } catch (error) {
    console.log("error in chatPartners", error);
    res.status(500).json({message: "internal server error"})
    
  }
};
