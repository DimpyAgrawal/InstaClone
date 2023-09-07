const express = require('express');
const router = express.Router()
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");


// find the data of the user
router.get("/user/:id", async (req, res) => {
    try {
        const user = await USER.findOne({ _id: req.params.id }).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await POST.find({ postedBy: req.params.id })
            .populate("postedBy", "_id");

        return res.status(200).json({user, posts });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});






module.exports = router;
