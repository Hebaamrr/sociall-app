import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
        minLength:3,
        trim:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    attachments:[
        {
            secure_url:String,
            public_id:String
        }
    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    isDeleted:Boolean,

},{timestamps:true})

export const postModel=mongoose.models.Post || mongoose.model("post",postSchema)