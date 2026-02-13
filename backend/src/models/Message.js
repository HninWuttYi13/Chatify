import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      minlength: 0,
    },
    image: {
      type: String,
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isRead: {type: Boolean, default: false},
    callLog: {
      callType : {
        type: String,
        enum: ["audio", "video"]
      },
      callStatus: {
        type: String,
        enum: ["ringing", "ongoing", "missed", "completed", "rejected"]
      },
      callDuration: {
        type: Number,
        default: 0
      }
    }
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);
export default Message;
