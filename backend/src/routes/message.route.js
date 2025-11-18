import express from "express";
const router = express.Router();
router.get("/send", async(req, res)=> {
    res.send("message send")
})
router.get("/receive", async(req, res)=> {
    res.send("message received")
});
export default router