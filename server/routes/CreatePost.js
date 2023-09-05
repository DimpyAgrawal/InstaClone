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
router.put("/like",RequireLogin,(req,res)=>{
    POST.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },
    { new:true }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

//for unlike we use pull to remove the id
router.put("/unlike",RequireLogin,(req,res)=>{
    POST.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
            new:true
        
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

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

  router.delete("/deletePost/:postId", RequireLogin, (req, res) => {
   // console.log(req.params.postId);

   POST.findOne({id:req.params.postId})
   .populate("postedBy", "_id")
   .exec((err,post)=>{
        console.log(post);
        if(err || !post){
            return res.status(422).json({error : err})
        }
       // console.log(post.postedBy._id.toString(),req.user._id.toString());
        if(post.postedBy._id.toString() == req.user._id.toString()){
            post.remove()
            .then(result =>{
                return res.json({message: "Successfully deleted"})
            }).catch((err)=>{
                console.log(err)
            })
            
        }
   })
  });
  

module.exports = router