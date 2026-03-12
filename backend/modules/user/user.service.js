import bcrypt from "bcryptjs"
import User from "./user.model.js"
import ApiError from "../../utils/ApiError.js"


export const createUser=async({name,email,password,gender,phone})=>{
    const isUserExist= await User.findOne({email})
    if(isUserExist){
        throw new ApiError(409,"User already exists")
    }

    const hashedPassword=await bcrypt.hash(password,10)
    const user= await User.create({
        name,
        email,
        gender,
        phone,
        password:hashedPassword
    })

    const userObject= user.toObject()
    delete userObject.password
    return userObject
}


export const validateUser=async(email,password)=>{
    const user= await User.findOne({email})
    if(!user){
        throw new ApiError(401,"Invalid email or password")
    }     
    
    const isPasswordMatch= await bcrypt.compare(password,user.password)

    if(!isPasswordMatch){
        throw new ApiError(401,"Invalid email or password")
    }

    const userObject= user.toObject()
    delete userObject.password
    return userObject
}


export const DeleteAccount=async(id)=>{
    const queryResult= await User.findByIdAndDelete(id)

    if(!queryResult){
        throw new ApiError(404,"User not found")
    }

    return {message:"Account Successfully Deleted"}
}