import { EventEmitter } from "events";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../service/sendEmails.js";
import { nanoid, customAlphabet } from "nanoid";
import userModel from "../../DB/models/user.model.js";
import { html } from "../../service/template-email.js";
import { Hash } from "../hash/hash.js";
export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmailConfirmation", async (data) => {
  const { email } = data;
  //generate otp
  const otp = customAlphabet("123456789", 4)();
  const hashedOtp=await Hash(otp)
//  const user= await userModel.updateOne({email},{otpEmail:hashedOtp})
 const user= await userModel.findOne({email:"hebatollahamr@gmail.com"})
  
  const emailSender = await sendEmail(
    email,
    "Confirm Email",
     html(otp,"Email Confirmation")
  );
  if (!emailSender) {
    return response.status(500).json({ message: "Failed to send Otp " });
  }
});

eventEmitter.on("newEmailConfirmation", async (data) => {
  const { email,id } = data;
  //generate otp
  const otp = customAlphabet("123456789", 4)();
  const hashedOtp=await Hash(otp)
  await userModel.updateOne({tempEmail:email,_id:id},{otpnewEmail:hashedOtp})
  
  const emailSender = await sendEmail(
    email,
    "Confirm Email",
     html(otp,"New Email Confirmation")
  );
  if (!emailSender) {
    return response.status(500).json({ message: "Failed to send Otp " });
  }
});


eventEmitter.on("forgetPassowrd", async (data) => {
  const { email } = data;
  //generate otp
  const otp = customAlphabet("123456789", 4)();
  const hashedOtp=await Hash(otp)
  await userModel.updateOne({email},{otpPassword:hashedOtp})
  
  const emailSender = await sendEmail(
    email,
    "Reset password",
     html(otp,"Reset Password")
  );
  if (!emailSender) {
    return response.status(500).json({ message: "Failed to send Otp " });
  }
});