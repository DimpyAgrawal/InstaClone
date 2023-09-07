const express = require('express');
const router = express.Router()
const mongoose = require("mongoose");
const RequireLogin = require('../middleware/RequireLogin');
const POST = mongoose.model("POST");



 
//Route
 
router.get("/allposts",RequireLogin,(req,res) =>{
    console.log("/allpost");
    
    POST.find()
    .sort({ createdAt: -1 })
    .populate('postedBy',"_id name")
    .populate('comments.postedBy',"_id name")
    .then(posts => res.json(posts))
    .catch(err => console.log(err))
}) 


router.post("/createPost",RequireLogin,(req,res) =>{
    console.log("createPost");
    const {body,pic} = req.body;
    if(!pic|| !body){
        return res.status(401).json({error: "Add all the field"})
    }
    console.log(req.user);
    const post = new POST({
        body,
        photo:pic,
        postedBy: req.user
    }) 
    post.save().then((result)=>{
        return res.json({post:result})
    }).catch(err=>console.log(err))
   // res.json("ok");
})
 //to show in the personal profile
router.get("/myposts",RequireLogin, (req,res)=> {
    console.log("myposts");
    POST.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .populate('comments.postedBy',"_id name")
    .then(myposts=>{
        res.json(myposts)
    })
   //console.log(req.user);
})

//to update likes, for like we use push to add the id
router.put("/like", RequireLogin, async (req, res) => { // Added 'async' keyword
    const { postId } = req.body;
    const { _id } = req.user;
  
    try {
      const updatedPost = await POST.findByIdAndUpdate(
        postId,
        { $push: { likes: _id } },
        { new: true }
      ).populate("postedBy", "_id name Photo");
        console.log(updatedPost);
      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      res.json(updatedPost);
    } catch (err) {
      res.status(422).json({ error: err.message });
    }
  });

//for unlike we use pull to remove the id
router.put("/unlike", RequireLogin, async (req, res) => { // Added 'async' keyword
    const { postId } = req.body;
    const { _id } = req.user;
  
    try {
      const updatedPost = await POST.findByIdAndUpdate(
        postId,
        { $pull: { likes: _id } },
        { new: true }
      ).populate("postedBy", "_id name Photo");
        console.log(updatedPost);
      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      res.json(updatedPost);
    } catch (err) {
      res.status(422).json({ error: err.message });
    }
  });

router.put("/comment", RequireLogin, async (req, res) => {
    try {
      console.log("comment");
      const comment = {
        comment: req.body.text,
        postedBy: req.user._id,
      };
      console.log(comment.comment + " " + comment.postedBy);
  
      const result = await POST.findByIdAndUpdate(req.body.postedBy,
        {
          $push: { comments: comment },
        },
        {
          new: true,
        }
      )
        .populate("comments postedBy", "_id name")
        .exec();
  
      res.json(result);
    } catch (err) {
        console.log("error of comment "+err);
      return res.status(422).json({ error: err.message });
    }
  });
  
  //api to delete post

  router.delete("/deletePost/:postId", RequireLogin, async (req, res) => {
    try {
        // Find the post by ID and populate the "postedBy" field
        const post = await POST.findOne({ _id: req.params.postId })
            .populate("postedBy", "_id");

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the user requesting the deletion is the owner of the post
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            await POST.deleteOne({ _id: req.params.postId });
            return res.json({ message: "Successfully deleted" });
        } else {
            return res.status(403).json({ error: "You are not authorized to delete this post" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


  

module.exports = router