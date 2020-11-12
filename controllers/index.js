const express = require("express");
const router = express.Router();

const userRoutes = require("./userController");
const tankRoutes = require("./tankController");
const fishRoutes = require("./fishController");

router.get("/",(req,res)=>{
    res.send("welcome to my fishes!")
})

router.use("/api/users",userRoutes);
router.use("/api/tanks",tankRoutes);
router.use("/api/fishes",fishRoutes);

module.exports = router