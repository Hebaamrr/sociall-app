import {Router} from "express"
import * as US from "./user.service.js"
import * as UV from "./user.validation.js"
import { validation } from "../../middleware/validation.js"
import { fileTypes, multerHost, multerLocal } from "../../middleware/multer.js"
import { authentication } from "../../middleware/auth.js"

const userRouter=Router()
// userRouter.post('/signup',validation(UV.signupSchema),US.signup)
// userRouter.post('/signup',multerLocal(fileTypes.image,"pro/user").single("profileImage"),US.signup)
// userRouter.post('/signup',multerLocal(fileTypes.image,"pro/user").array("attachments",3),US.signup)
userRouter.post('/signup',multerHost(fileTypes.image).single("profileImage"),validation(UV.signupSchema),US.signup)


userRouter.patch('/confirmEmail',validation(UV.confirmEmailSchema),US.confirmEmail)
userRouter.post('/login',validation(UV.loginSchema),US.login)
userRouter.get('/refreshtoken',validation(UV.refreshTokenSchema),US.refreshToken)

userRouter.get('/forgetPassword',validation(UV.forgetpasswordSchema),US.forgetPassword)
userRouter.patch('/resetPassword',validation(UV.resetpasswordSchema),US.resetPassword)

userRouter.patch('/updateProfile',multerHost(fileTypes.image).single("profileImage"),validation(UV.updateProfileSchema),authentication,US.updateProfile)
userRouter.patch('/updatePassword',validation(UV.updatePasswordSchema),authentication,US.updatePassword)
userRouter.get('/profile/:id',validation(UV.shareProfileSchema),authentication,US.shareProfile)
userRouter.patch('/updateEmail',validation(UV.updateEmailSchema),authentication,US.updateEmail)
userRouter.patch('/updateEmail/confirm',validation(UV.replaceEmailSchema),authentication,US.replaceEmail)




export default userRouter