import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import Post from '../mongodb/models/post.js';
import protect from '../middleware/requireLogin.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});

router.post("/",protect, async (req, res) => {
  try {
    const {  prompt, photo } = req.body;
   
    const photoUrl = await cloudinary.uploader.upload(photo);
    const newPost = await Post.create({
      name:req.user.name,
      postedBy_id:req.user._id,
      prompt,
      photo: photoUrl.url,
    });
    

    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
  }
});


router.get("/mypost",protect,async (req,res)=>{
  let posts;
 
  try {
      posts = await Post.find({postedBy_id:req.user._id})
      if(!posts){
        res.status(404).json({success:false, error:"Not found"})
      }
      res.status(200).json({success:true,message:"data found",data:posts})
  } catch (error) {
    console.log(error)
  }
})

router.delete("/deletepost/:id",protect,async(req,res)=>{
try {
  await Post.findByIdAndDelete(req.params.id);  
  let data = await Post.find({postedBy_id:req.user._id});
  res.send(data)
} catch (error) {
 console.log(error) 
}
})

router.put("/like",protect,async(req,res)=>{
try {
 
  let data = await Post.findByIdAndUpdate(req.body.postId,{$push:{likes:req.user._id}},{new:true})
if(data){
  res.json({data})
}
} catch (error) {
  res.status(404).json({error})
}
})
router.put("/unlike",protect,async(req,res)=>{
try {
  let data = await Post.findByIdAndUpdate(req.body.postId,{$pull:{likes:req.user._id}},{new:true})
if(data){
  res.json({data})
}
} catch (error) {
  res.status(404).json({error})
}
})

export default router;