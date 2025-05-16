
import mongoose from "mongoose"

const gender={
    male:"male",
    female:"female"
}

export const roles={
    user:'user',
    admin:'admin'
}  

export const provider={
  google:"google",
  system:"system"
}

const userSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
  },
  password:{
    type:String,
    required:true,
    minLength:8,
    trim:true
  },
  phone:{
    type:String,
    required:true,
    trim:true
  },
  gender:{
    type:String,
    enum:Object.values(gender),
    default:gender.male,
  },
  confirmed:{
    type:Boolean,
    default:false
  },
  isDeleted:{
    type:Boolean,
    default:false
  },
  role:{
    type:String,
    enum:Object.values(roles),
    default:roles.user
  },
  image:{
    secure_url:String,
    public_id:String
  },
  coverImage:[String],
  changePasswordAt:Date,
  otpEmail:String,
  tempEmail:String,
  otpnewEmail:String,
  otpPassword:String,
  provider:{
    type:String,
    enum:Object.values(provider),
    default:provider.system
  },
  viewers:[{
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    time:[Date]
  }
  ],

},{timestamps:true})

const userModel=mongoose.models.User||mongoose.model("user",userSchema)
export default userModel