import express from "express";
import "./src/config/dotenv.js";
import cors from "cors";
import authRouter from "./src/routes/auth.routes.js";
import messageRouter from "./src/routes/message.route.js";
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser())
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB()
});
