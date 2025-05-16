import userModel, { roles } from "../../DB/models/user.model.js";
import { decodedToken, tokentypes } from "../../middleware/auth.js";
import cloudinary from "../../utils/cloudinary/index.js";
import {
  asyncHandler,
  Compare,
  Encrypt,
  eventEmitter,
  generateToken,
  Hash,
} from "../../utils/index.js";

const signup = asyncHandler(async (request, response, next) => {
  const { name, email, password, phone } = request.body;
  //step for cPassword we can do it in the validation

  //check email
  if (await userModel.findOne({ email })) {
    return next(new Error("Email already exists", { cause: 409 }));
  }
   // saving path of the uploaded image
  // if(!request.file){
  //  return next(new Error("Please upload an image", { cause: 409 }));
  // }
  ///////////////////////////in case of more than one file
//   if(!request?.files.length){
//    return next(new Error("Please upload an image", { cause: 409 }));
//   }
//   let arrPath=[]
//   for(const file of request.files){
//     arrPath.push(file.path) //coverImages=[paths]
//   }


//     // Upload an image
// const {secure_url,public_id}=await cloudinary.uploader.upload(request.file.path,{
//      folder:"social-app/users",
//     //  public_id:"newimage"
// })

   
  //encrypt phone
  const cipherText = await Encrypt(phone);
  //password hash
  const hash = await Hash(password);

  //send otp(one time password)
  eventEmitter.emit("sendEmailConfirmation", { email });

  const user = await userModel.create({
    name,
    email,
    password: hash,
    phone: cipherText,
    // image:{secure_url,public_id}
  });
  return response.status(201).json({ message: "done", user });
});

const confirmEmail = asyncHandler(async (request, response, next) => {
  const { email, code } = request.body;
  const user = await userModel.findOne({ email, confirmed: false });
  //check email
  if (!user) {
    return next(
      new Error("Email don't exist or already confirmed.", { cause: 404 })
    );
  }
  console.log(user.otpEmail);

  //compare the otp7
  const match = await Compare(code, user.otpEmail);
  
  if (!match) {
    return next(new Error("Invaid otp.", { cause: 409 }));
  }

  await userModel.updateOne(
    { email },
    { confirmed: true, $unset: { otpEmail: 0 } }
  );
  return response.status(200).json({ message: "User confirmed" });
});

const login = asyncHandler(async (request, response, next) => {
  const { email, password } = request.body;
  const user = await userModel.findOne({ email, confirmed: true });
  //check email
  if (!user) {
    return next(
      new Error("Email don't exist or not confirmed yet.", { cause: 404 })
    );
  }

  //compare the password
  const match = await Compare(password, user.password);
  if (!match) {
    return next(new Error("Invaid password.", { cause: 400 }));
  }
  //generate token
  const access_token = await generateToken({
    payload: { email, id: user._id },
    SECRET_KEY:
      user.role == roles.user
        ? process.env.ACCESS_SECRET_KEY_USER
        : process.env.ACCESS_SECRET_KEY_ADMIN,
    option: { expiresIn: "1d" },
  });

  const refresh_token = await generateToken({
    payload: { email, id: user._id },
    SECRET_KEY:
      user.role == roles.user
        ? process.env.REFRESH_SECRET_KEY_USER
        : process.env.REFRESH_SECRET_KEY_ADMIN,
    option: { expiresIn: "1w" },
  });
  return response.status(200).json({
    message: "User signed in",
    token: {
      access_token,
      refresh_token,
    },
  });
});

const refreshToken = asyncHandler(async (request, response, next) => {
  const { authorization } = request.body;
  const user=await decodedToken({auth:authorization , tokentype:tokentypes.refresh,next})
  //generate token
  const access_token = await generateToken({
    payload: { email: user.email, id: user._id },
    SECRET_KEY:
      user.role == roles.user
        ? process.env.ACCESS_SECRET_KEY_USER
        : process.env.ACCESS_SECRET_KEY_ADMIN,
    option: { expiresIn: "1d" },
  });

  return response.status(200).json({
    message: "Done",
    token: {
      access_token,
    },
  });
});

const forgetPassword = asyncHandler(async (request, response, next) => {
  const { email } = request.body;
  const user = await userModel.findOne({ email, isDeleted: false });
  //check email
  if (!user) {
    return next(new Error("Email don't exist", { cause: 404 }));
  }

  eventEmitter.emit("forgetPassowrd", { email });

  return response.status(200).json({ message: "done" });
});

const resetPassword = asyncHandler(async (request, response, next) => {
  const { email, code, newpassword } = request.body;
  const user = await userModel.findOne({ email, isDeleted: false });
  //check email
  if (!user) {
    return next(new Error("Email don't exist", { cause: 404 }));
  }
  const match = await Compare(code, user.otpPassword);
  if (!match) {
    return next(new Error("Invalid otp", { cause: 400 }));
  }
  //hash new password
  const hash = await Hash(newpassword);
  await userModel.updateOne(
   { email },
   { password:hash,confirmed: true, $unset: { otpPassword: 0 } }
 );
  return response.status(200).json({ message: "Password Changed" });
});

//////social login

/////file uploading

//update profile
const updateProfile = asyncHandler(async (request, response, next) => {
  if(request.body.phone){ //input
    request.body.phone=await Encrypt(request.body.phone)
  }
   
  if(request.file){ //uploading an image & delete old image
    await cloudinary.uploader.destroy(request.user.image.public_id)
    const {secure_url,public_id}=await cloudinary.uploader.upload(request.file.path,{
      folder:"social-app/users",
 })
    request.body.image={secure_url,public_id}
  }

  await userModel.updateOne({_id:request.user._id},request.body)
  return response.status(200).json({ message: "User updated" });
});

//update password
const updatePassword = asyncHandler(async (request, response, next) => {
 const{oldPassword,newPassword}=request.body
   
  if(!await Compare(oldPassword,request.user.password)){
     return next(new Error("Invalid old password",{cause:400}))
  }
   
  const hash=await Hash(newPassword)
  await userModel.updateOne({_id:request.user._id},{passowrd:hash,changePasswordAt:Date.now()})
  return response.status(200).json({ message: "User updated" });
});

//share profile
const shareProfile = asyncHandler(async (request, response, next) => {
  const{id}=request.params
    
   const user=await userModel.findOne({_id:id,isDeleted:false})
   if(!user){
    return next(new Error("Email don't exist or deleted"))
   }
   //the owner of the profile
   if(request.user._id.toString() === id){
   return response.status(200).json({ message: "User",user:request.user });
   }
  // if the person is already in the viewers array
   const emailExist=user.viewers.find(viewer=>{
     return viewer.userId.toString()===request.user._id.toString()
   })
   
   if(emailExist){
    //not the first view to this profile
    emailExist.time.push(Date.now())
    if(emailExist.time.length>5){
    emailExist.time= emailExist.time.slice(-5) //read from the back
    }
   }else{
    //first view to this profile
    user.viewers.push({userId:request.user._id,time:[Date.now()]})
   }

   await user.save()
   return response.status(200).json({ message: "Shared Profile",user });
 });

 //update email
 const updateEmail = asyncHandler(async (request, response, next) => {
  const{email}=request.body
    
   const user=await userModel.findOne({email})
   if(user){
    return next(new Error("Email already exists",{cause:409}))
   }
   await userModel.updateOne({_id:request.user._id},{tempEmail:email})
   
   eventEmitter.emit("sendEmailConfirmation", { email:request.user.email,id:request.user._id});
   eventEmitter.emit("newEmailConfirmation", { email,id:request.user._id });


   return response.status(200).json({ message: "Shared Profile",user });
 });

 const replaceEmail = asyncHandler(async (request, response, next) => {
  const{oldCode,newCode}=request.body
    
   const user=await userModel.findOne({_id:request.user._id,isDeleted:false})
   if(!user){
    return next(new Error("Email don't exist or deleted",{cause:400}))
   }
    if(!await Compare(oldCode,user.otpEmail) ){
    return next(new Error("Invalid old code",{cause:400}))
    }
    if(!await Compare(newCode,user.otpnewEmail) ){
      return next(new Error("Invalid new code",{cause:400}))
      }
    
  await userModel.updateOne({_id:request.user._id},{
    email:user.tempEmail,
    $unset:{
      tempEmail:0,
      otpEmail:0,
      otpnewEmail:0,
    },  
     changePasswordAt:Date.now() //token expires
  })
   return response.status(200).json({ message: "Done"});
 });




export {
  signup,
  confirmEmail,
  login,
  refreshToken,
  forgetPassword,
  resetPassword,
  updateProfile,
  updatePassword,
  shareProfile,
  updateEmail,
  replaceEmail
};
