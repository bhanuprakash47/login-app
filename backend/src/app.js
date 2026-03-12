import express from "express"
import cors from "cors"
import userRoutes from "../modules/user/user.routes.js"
import errorHandler from "../middleware/error.middleware.js"

const app=express()

app.use(cors())
app.use(express.json())

app.use("/api/users",userRoutes)

app.get("/api/health",(req,res)=>{
    res.status(200).json({status:"OK"})
})

app.use(errorHandler)

export default app