 import mongoose from "mongoose";
 export const connectDB = async()=> {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB connected", connect.connection.host);
        
    } catch (error) {
        console.error("Error connection to Mongodb", error);
        process.exit(1)
    }
 }