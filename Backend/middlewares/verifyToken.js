import jwt from "jsonwebtoken";
import {config} from 'dotenv';
config()
const {verify}=jwt
export const verifyToken=(...roles)=>{
    return(req,res,next)=>{
        //get token from headers
        const token = req.cookies.token
        //check if token exists or not
        if(!token)
        {
            return res.status(401).json({message:"Token doesnot exist.Please login first."});
        }
        try{
            //verify token
            const decodedToken=verify(token,process.env.SECRET_KEY);
            //store decodedToken
            req.user=decodedToken;
            //check role acsess
            if(!roles.includes(decodedToken.role))
            {
                return res.status(403).json({message:"Invalid Role"})
            }
            //move to next middleware
            next();
        }
        catch(err)
        {
            return res.status(401).json({message:"Token is invalid or expired"})
        }
    }
}