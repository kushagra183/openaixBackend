import mongoose from "mongoose";


const schema = new mongoose.Schema({
name:{
    type:String,
    required:true
},
prompt:{
    type:String,
    required:true
},
photo:{
    type:String,
    required:true
},
postedBy_id:{type:String,required:true},

likes:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}]

});

const Post = mongoose.model("Post",schema);

export default Post;