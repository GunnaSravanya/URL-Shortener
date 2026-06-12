import {userModel} from "../models/userSchema.js"
import {hash,compare} from "bcryptjs"
import exp from "express";
import {verifyToken} from '../middlewares/verifyToken.js'
import jwt from "jsonwebtoken";
import geoip from "geoip-lite";
import {config} from "dotenv";
//to load environment variables from .env to process.env
config()
//extract sign from jsonwebtoken
const {sign}=jwt
//used to create seperate router instead of building all routes in the server and making the code complex
export const commonApp=exp.Router()
//route for register
commonApp.post('/register',async(req,res)=>{
  try{
    //take the information from body of the request
    const newUser = req.body;
    console.log(newUser);
    //check if the user role is user only
    newUser.role = "User";
    if (newUser.role != "User") {
      return res.status(401).json({ message: "Invalid Role!" });
    }
    console.log(1);
    //check if the user email is registered or not
    const existingUser = await userModel.findOne({
      email: newUser.email,
    });
    console.log(2);
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    console.log(3);
    //hash the password of the user and update the password of the body with hashed password
    newUser.password = await hash(newUser.password, 12);
    console.log(4);
    let country = "Unknown";

    try {
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const geo = geoip.lookup(ip);
      console.log(ip)
      console.log(geo)
      country = geo?.country || "Unknown";
    } catch (err) {
      console.log("Geo error:", err.message);
    }
    newUser.country = country;
    //save the document into the database
    let newUserdoc = new userModel(newUser);
    console.log(7);
    await newUserdoc.save();
    console.log(8);
    //return response
    return res.status(201).json({ user: newUserdoc, message: "User Created" });
  }
  catch(err)
  {
    console.log(err)
    return res.status(500).json({error:err.message})
  }
});
//route for login
commonApp.post('/login',async(req,res)=>{
  try{
  //get email and password from request body
  const { email, password } = req.body;
  //check whether that email exists in db
  const dbUser = await userModel.findOne({ email });
  if (dbUser == null) {
    return res
      .status(401)
      .json({ message: "Invalid email.Please Signup first" });
  }
  //check whether the password matches with the hashed password of that user in db
  const result = await compare(password, dbUser.password);
  if (result == false) {
    return res
      .status(401)
      .json({ message: "Invalid Password.Please enter correct Password" });
  }
  //check whether the user is active
  if (!dbUser.isActive) {
    return res.status(403).json({
      message: "Your account has been blocked",
    });
  }
  const safeUser = {
    id: dbUser._id,
    fName: dbUser.fName,
    email: dbUser.email,
    role: dbUser.role,
  };
  //if above all conditions are satisfied then create a token
  const signedToken = sign(
    { email: dbUser.email, id: dbUser._id, role: dbUser.role },
    process.env.SECRET_KEY,
    { expiresIn: "1d" },
  );
res.cookie("token", signedToken, {
  httpOnly: true,
  secure:true,//change it to true while production
  sameSite:"none",
});
  return res
    .status(200)
    .json({ message: "Login successful", token: signedToken, user: safeUser });
}
catch(err)
{
  return res.status(500).json({error:err.message})
}
});
//route for logout
commonApp.get('/logout',verifyToken("User","Admin"),async(req,res)=>{
    //delete the token
    res.clearCookie('token');
    //send response
    return res.status(200).json({message:"Logout Successful"});
})
//route for check-auth
commonApp.get("/check-auth", verifyToken(), async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "User is blocked",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});
