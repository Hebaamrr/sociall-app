import joi from "joi";
import { generalRules } from "../../utils/index.js";

export const createPostSchema={
    body:joi.object({
        content:joi.string().min(3).required()
    }),
    files:joi.array().items(generalRules.file)
}

export const updatePostSchema={
    body:joi.object({
        content:joi.string().min(3)
    }),
    files:joi.array().items(generalRules.file),
    params: joi.object({
        postId:generalRules.objectId.required()
    })
}