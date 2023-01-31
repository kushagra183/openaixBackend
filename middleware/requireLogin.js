import jwt from "jsonwebtoken";
import User from "../mongodb/models/user.js";


const protect =  (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        
        token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
            if(err){
                
                return res.status(401).json({error:"You must be logged in"})
            }
        const {_id} = payload
    User.findById(_id).then(data=>{req.user=data}).then(()=>{next()}).catch(err=>res.json({error:err}))
    
    
})

}else{
    res.status(401).json({error:"You must be logged in"})
}

}

export default protect;