import express from "express";
import User from "../mongodb/models/user.js";
import bcrypt from "bcrypt";
const router = express.Router();
import jwt from "jsonwebtoken";
import protect from "../middleware/requireLogin.js";



router.post("/register",async (req,res)=>{
    const {name,email,password} = req.body;

    try {
     let response =  await User.findOne({email});
     if(response){
        return res.status(422).json({error:"Email already registered"})
     }
    let data = await User.create({name,email,password});
    res.status(201).json({success:true, message:"USer registered successfully",data})
        
    } catch (error) {
        console.log(error);
       res.status(500).json({error}) 
    }
    

})

router.post("/login", async (req,res)=>{
 const {email, password} = req.body;

 if(!email || !password){
    res.status(400).json({success:false, error:"Please provide email and password!"})
 }
    try {
        const user = await User.findOne({email});
        if(!user){
            res.status(404).json({success:false, error:"User not registered"})
        }
          else{
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"60min"});
         
            res.status(200).json({success:true,message:"User logged in",data:user.name,token:token,uId:user._id})
        }else{
            res.status(400).json({success:false, message:"Invalid credential"})
        }
       
          }
    } catch (error) {
        res.status(500).json({success:false, error:error.message})
    }
})






export default router