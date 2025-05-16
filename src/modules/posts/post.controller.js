import {Router} from "express"
import * as PS from "./post.service.js"
import * as PV from "./post.validation.js"
import { validation } from "../../middleware/validation.js"
import { fileTypes, multerHost } from "../../middleware/multer.js"
import { authentication } from "../../middleware/auth.js"

const postRouter=Router()
postRouter.post('/create',multerHost(fileTypes.image).array("attachments",5),validation(PV.createPostSchema),authentication,PS.createPost)

postRouter.patch('/update/:postId',multerHost(fileTypes.image).array("attachments",5),validation(PV.updatePostSchema),authentication,PS.updatePost)


export default postRouter