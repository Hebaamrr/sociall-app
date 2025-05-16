import { connectionDB } from "./DB/connectionDB.js"
import postRouter from "./modules/posts/post.controller.js"
import userRouter from "./modules/users/user.controller.js"
import { globalErrorHandler } from "./utils/error/index.js"
import path from "path"


const bootstrap=async (app,express)=>{
app.use("/uploads",express.static(path.resolve("uploads")))
 app.use(express.json())
 await connectionDB()
 //main route
app.get('/',(request,response,next)=>{
    return response.status(200).json("Hello on my spcial app")
})
//other routes
app.use('/users',userRouter)
app.use('/posts',postRouter)


//route for unhandled requests
 app.use('*',(request,response,next)=>{
  return next(new Error(`Invalid URL using ${request.originalUrl}`))
  })
   //error handling middleware
  app.use(globalErrorHandler)
}

export default bootstrap