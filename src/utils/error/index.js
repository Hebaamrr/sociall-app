
export const asyncHandler=(fn)=>{
    return (request,response,next)=>{
      fn(request,response,next).catch((error)=>{
        // return response.status(500).json({ message: "Server Error ", error: error.message });
        return next(error)
      })
    }
  }

  //next() is used to switch to the next middleware
  //next(something) is used to reach the global handler

  export const globalErrorHandler=(error,request,response,next)=>{
    if(process.env.MODE=="DEV"){
      return response.status(error["cause"] || 500).json({
        message:error.message,
        stack:error.stack, 
        error
      })
    }
    return response.status(error["cause"] || 500).json({
      message:error.message,
    })
  }