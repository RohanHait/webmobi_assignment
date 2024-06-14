import bcrypt from 'bcryptjs' ;
import jwt from 'jsonwebtoken' ;
import dotenv from 'dotenv' ;
dotenv.config() ;

export function check_user(username) {
    return /^[a-zA-Z0-9_]{1,40}$/.test(username) && username.length <= 40;
}
export function check_email(email)  {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email) ;
}
export async function encrypt_password(password) {
    return await bcrypt.hash(password, 8) ;
}
export async function compare_password(password, hashed_password) {
    return await bcrypt.compare(password, hashed_password) ;
}
export async function generate_token(user) {
    return jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET) ;
}
export async function verify_token(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
}


// console.log(check_email("abc@abc.com")) ;