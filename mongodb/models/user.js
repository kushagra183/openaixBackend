import mongoose from "mongoose";
import bcrypt from "bcrypt"
const schema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "can't be blank"]
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
   
})



schema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
        next();

    }
    next();
})
const User = mongoose.model("User",schema);

export default User;