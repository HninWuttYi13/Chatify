//can communicate user in our database
import mongoose from "mongoose";
const userSchema = new mongoose.Schema( //create Schema
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
); //created time and updated time
const User = mongoose.model("User", userSchema) //create model
export default User;