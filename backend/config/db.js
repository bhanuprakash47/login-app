import mongoose from "mongoose"
import { MONGO_URI } from "./env.js"

const connectDB=async()=>{
    try{
        await mongoose.connect(MONGO_URI)
        console.log("MongoDB connect successfully")
    }catch(err){
        console.log("MongoDB connection failed",err)
        process.exit(1)
    }
}

export default connectDB;