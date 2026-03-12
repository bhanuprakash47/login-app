import jwt from "jsonwebtoken"
import {createUser,validateUser,DeleteAccount} from "./user.service.js"
import { JWT_SECRET_KEY } from "../../config/env.js"


export const signup= async(req,res,next)=>{
    try{
        const {username,email,password,gender,phone}=req.body

        if(!username || !email || !password || !gender || !phone){
            return res.status(400).json({message:"All fields are required"})
        }

        await createUser({
            name:username,
            email,
            password,
            gender,
            phone
        })

        return res.status(201).json({
            message:"Signup successful. Please login."
        })

    }catch(err){
        next(err)
    }
}

export const login=async(req,res,next)=>{
    try{
        const {email,password}=req.body

        if(!email || !password){
          return  res.status(400).json({message:"Email and password are required"})
        }

        const user= await validateUser(email,password)

        

        const token= jwt.sign(
            {userId:user._id,email:user.email},
            JWT_SECRET_KEY,
            {expiresIn:"1h"}
        )

        return res.status(200).json({
            message:"Login successful",
            accessToken:token
        })

    }catch(err){
        next(err)
    }
}



export const DeleteUser=async(req,res,next)=>{
    try{
        const userId=req.user?.userId
        if(!userId){
            return res.status(401).json({message:"Unauthorized"})
        }

        const result = await DeleteAccount(userId)

        return res.status(200).json(result)

    }
    catch(err){
        next(err)
    }
}