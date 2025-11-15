import express from "express";
const router = express.Router();
router.get("/login", async(__, res)=> {
    res.send("login endpoint")
});
router.get("/logout", async(__, res)=> {
    res.send("logout endpoint")
})
router.get("/signup", async(_, res)=> {
    res.send("signup endpoint")
})
export default router;