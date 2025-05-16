// export const validation = (schema) => {
//   return (request, response, next) => {
//     const inputData = { ...request.body, ...request.query, ...request.params };

//     const result = schema.validate(inputData, { abortEarly: false });
//     //abortEarly -> wait to rewrite all the existing error at once
//     if (result?.error) {
//       return response
//         .status(400)
//         .json({ message: "Validation error", error: result?.error.details });
//     }

//     next();
//   };
// };



export const validation=(schema)=>{
  return (request,response,next)=>{

      let validationResult=[]
   for(const key of Object.keys(schema)){
     const validationError=schema[key].validate(request[key],{abortEarly:false})
      //abortEarly -> wait to rewrite all the existing error at once
      if(validationError?.error){
          validationResult.push(validationError.error.details)
      }
      }
      if(validationResult.length>0){
          return response.status(400).json({message: "Validation error",error:validationResult})
      }

      next()  

    
}
}
