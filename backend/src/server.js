import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import app from "./app.js"
import connectDB from "../config/db.js"
import { PORT } from "../config/env.js"

const initializeServerAndDB=async()=>{
    try{
        await connectDB()

        app.listen(PORT,()=>{
            console.log("server is running on port",PORT)
        })
    }catch(err){
        console.error("Server failed to start",err.message)
        process.exit(1)
    }
}

initializeServerAndDB()