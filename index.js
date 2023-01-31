import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
import dallerouter from "./routes/dalleRoutes.js";
import postRouter from "./routes/postRoutes.js";
import userRouter from "./routes/userRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit:"50mb"}));

app.use("/api/dalle",dallerouter);
app.use("/api/post",postRouter);
app.use("/api",userRouter);

app.get("/",(req,res)=>{
res.send("hey")
})


const startServer = async ()=>{
    try{
        connectDB(process.env.MONGODB_URL);
        app.listen(PORT,()=>console.log(`server started on port ${PORT}`))
    }
    catch(err){
        console.log(err)
    }
}
startServer();
