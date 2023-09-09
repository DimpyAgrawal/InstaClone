const express = require('express');
const router = express.Router()
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const RequireLogin = require("../middleware/RequireLogin");



// find user profile
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
})

//to follow user

router.put("/follow", RequireLogin, (req, res) => {
    USER.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        USER.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }  //jisne follow kiya h uski id push kr rhe h
        }, {
            new: true
        }).then(result => {
            res.json(result)

        })
            .catch(err => { return res.status(422).json({ error: err }) })
    }
    )
})


// to unfollow user
router.put("/unfollow", RequireLogin, (req, res) => {
    USER.findByIdAndUpdate(req.body.followId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        USER.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.followId }
        }, {
            new: true
        }).then(result => res.json(result))
            .catch(err => { return res.status(422).json({ error: err }) })
    }
    )
})






module.exports = router; 
