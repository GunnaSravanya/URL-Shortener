import jwt from "jsonwebtoken";
import {config} from "dotenv";
config();
const {verify}=jwt
export const optionalVerifyToken=(req,res,next)=>{
    //extract token from cookies
    const token=req.cookies.token
    if(!token)
    {
       return next();
    }
    try{
    const decodedToken=verify(token,process.env.SECRET_KEY)
    req.user=decodedToken
    }
    catch(err)
    {
        console.log(err)
    }
        next();
}