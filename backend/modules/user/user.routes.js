import express from "express"
import {signup,login,DeleteUser} from "./user.controller.js"
import verifyToken from "../../middleware/auth.middleware.js"

const router= express.Router()

router.post("/signup",signup)

router.post("/login",login)

router.delete("/delete",verifyToken,DeleteUser)

export default router