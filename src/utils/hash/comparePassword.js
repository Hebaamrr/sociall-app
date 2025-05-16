import bcrypt from "bcrypt";

export const Compare=async(password,confirmedPassword)=>{
    return bcrypt.compareSync(password, confirmedPassword);
}