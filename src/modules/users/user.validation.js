import joi from "joi";
import { generalRules } from "../../utils/index.js";

export const signupSchema = {
  body: joi.object({
    name: joi.string().alphanum().min(1).required(),
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    cPassword: generalRules.password.valid(joi.ref("password")).required(),
    phone: generalRules.phone.required(),
    gender: generalRules.gender.required(),
  }),
  file: generalRules.file,
};

export const confirmEmailSchema = {
  body: joi.object({
    email: generalRules.email.required(),
    code: joi.string().length(4).required(),
  }),
};

export const loginSchema = {
  body: joi.object({
    email: generalRules.email.required(),
    password: generalRules.password.required(),
  }),
};

export const refreshTokenSchema = {
  body: joi.object({
    authorization: joi.string().required(),
  }),
};

export const forgetpasswordSchema = {
  body: joi.object({
    email: generalRules.email.required(),
  }),
};

export const resetpasswordSchema = {
  body: joi.object({
    email: generalRules.email.required(),
    code: joi.string().length(4).required(),
    newpassword: generalRules.password.required(),
    cPassword: generalRules.password.valid(joi.ref("newpassword")).required(),
  }),
};

export const updateProfileSchema = {
  body: joi.object({
    name: joi.string().min(1),
    gender: generalRules.gender,
    phone: generalRules.phone,
  }),
  file: generalRules.file, //using single
 // files:joi.array().items(generalRules.file.required()), //using array
//   files:joi.object({ //using fields
//    attachment: joi.array().items(generalRules.file.required()),
//    attachments: joi.array().items(generalRules.file.required()),
//   }).required()
};


export const updatePasswordSchema={
    body:joi.object({
        oldPassword:generalRules.password.required(),
        newPassword:generalRules.password.required(),
        cPassword: generalRules.password.valid(joi.ref("newPassword")).required(),
    }),
    headers:generalRules.headers.required()
}

export const shareProfileSchema={
    params: joi.object({
        id:generalRules.objectId.required()
    })
}

export const updateEmailSchema={
    body:joi.object({
        email:generalRules.email.required()
    })
}

export const replaceEmailSchema={
    body: joi.object({
        oldCode:joi.string().required(),
        newCode:joi.string().required()
    })
}