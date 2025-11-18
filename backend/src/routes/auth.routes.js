import express from "express";
import { signup } from "../controllers/auth.controller.js";
const router = express.Router();
router.post("/signup", signup);
router.get("/login", async (__, res) => {
  res.send("login endpoint");
});
router.get("/logout", async (__, res) => {
  res.send("logout endpoint");
});

export default router;
