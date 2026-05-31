import {verifyToken} from "../middlewares/verifyToken.js"
import {config} from "dotenv"
import exp from 'express';
import { analyticsModel } from "../models/analytics.js";
import {userModel} from "../models/userSchema.js"
import {optionalVerifyToken} from '../middlewares/optionalVerifyToken.js'
import QRCode from 'qrcode';
import { urlModel } from "../models/url.js";
import {UAParser} from "ua-parser-js";
import geoip from "geoip-lite";
import mongoose from "mongoose";
//to extract environment variables from the env file into process.env
config();
//to create a seperate router for url function instead of buildding all in one router
export const urlApp=exp.Router()
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//route to convert long url to short url
urlApp.post('/shorturl',verifyToken("User"),async (req, res) => {
  try{
    //extract information like long url,custom alias input,expiry date
    const {
      originalUrl,
      customAlias,
      expiryType,
      expiryValue,
      qrEnabled,
      purpose,
      privacy,
    } = req.body;
    //url validation
    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({
        message: "Invalid URL",
      });
    }
    let expiresAt;
    let qrCode = null;
    if (expiryType === "hours") {
      expiresAt = new Date(Date.now() + expiryValue * 60 * 60 * 1000);
    } else if (expiryType === "days") {
      expiresAt = new Date(Date.now() + expiryValue * 24 * 60 * 60 * 1000);
    } else if (expiryType === "date") {
      expiresAt = new Date(expiryValue);
    }
    let shortCode;
    //if custom alias input is provided then make it as short url
    if (customAlias) {
      const checkCustom = await urlModel.findOne({ shortCode: customAlias });
      if (checkCustom) {
        return res.status(403).json({
          message:
            "Custom Alias already exists.Please provide unique Custom Alias",
        });
      } else {
        shortCode = customAlias;
      }
    }
    //if any of the above is not provided  then generate random and unique short code
    else {
      do {
        shortCode = Math.random().toString(36).substring(2, 8);
      } while (await urlModel.findOne({ shortCode }));
    }
    /* ================= GET IP ================= */

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    /* ================= GET COUNTRY ================= */

    const geo = geoip.lookup(ip);

    const country = geo?.country || "India";
    //store short url in database
    const newUrl = new urlModel({
      shortCode,
      originalUrl,
      customAlias,
      expiresAt,
      qrEnabled,
      purpose,
      privacy,
      country,
      userId: req.user.id,
    });
    await newUrl.save();
    let shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    //if user asks for qr code generation
    if (qrEnabled) {
      qrCode = await QRCode.toDataURL(shortUrl);
    }
    //add it to the user url array
    await userModel.findByIdAndUpdate(req.user.id, {
      $push: {
        urls: newUrl._id,
      },
    });
    return res
      .status(200)
      .json({ message: "short Url is created", shortUrl, qrCode });
  }
    catch(err){
      return res.status(500).json({error:err.message})
    }
});
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//route to get a particular url details
urlApp.get('/particularUrl/:id',verifyToken("User"),async(req,res)=>{
  try{
  //extract url id 
  const urlId=req.params.id
  //extract user id from token
  const user=req.user.id
  //extract url details using url id
  const url=await urlModel.findOne({_id:urlId,isDeleted:false})
  //check url exists
  if (!url) {
    return res.status(404).json({ message: "URL not found" });
  }
  //check whether the userId of url and logged in user are same
  if(url.userId.toString()!==user)
  {
    return res.status(403).json({message:"you are unauthorised"});
  }
  let qrCode = null;

  if (url.qrEnabled) {
    qrCode = await QRCode.toDataURL(`${process.env.BASE_URL}/${url.shortCode}`);
  }
  //extract analytics of that particular url
  const analytics=await analyticsModel.find({urlId})
 return res.status(200).json({
   message: "Url details are",
   url: {
     ...url.toObject(),
     qrCode,
     createdAt: url.createdAt,
     expiresAt: url.expiresAt,
   },
   analytics,
 });
}
catch(err)
{
  return res.status(500).json({error:err.message})
}
});
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//to edit url
urlApp.put('/urldetails/:id',verifyToken("User"),async(req,res)=>{
  try{
    //extract url id
    const urlId=req.params.id
    //extract user id from token
    const user=req.user.id
    //find url details with url id
    const url=await urlModel.findOne({_id:urlId,isDeleted:false})
    //check if url exists or not
    if(!url)
    {
      return res.status(404).json({message:"url not found"})
    }
    //check whether the user who is updating the url and logged in user are same
    if(url.userId.toString()!==user)
    {
      return res.status(403).json({message:"You are unauthorised"})
    }
    //get updated details from the request body
    const {updatedOriginalUrl,
      updatedCustomAlias,
      updatedPurpose,
      updatedMaxClicks,
      updatedPrivacy,
      updatedQrEnabled,
      updatedExpiresAt
    }=req.body;
    //update original url details
    //update only if they exist in request body
    if(updatedOriginalUrl){
      try {
        new URL(updatedOriginalUrl);
      } catch {
        return res.status(400).json({
          message: "Invalid URL",
        });
      }
    url.originalUrl=updatedOriginalUrl
    }
    if(updatedPurpose){
    url.purpose=updatedPurpose
    }
    if(updatedMaxClicks!==undefined){
    url.maxClicks=updatedMaxClicks
    }
    if(updatedPrivacy){
    url.privacy=updatedPrivacy
    }
    if(updatedQrEnabled!==undefined){
    url.qrEnabled=updatedQrEnabled
    }
    if(updatedExpiresAt){
    url.expiresAt=updatedExpiresAt
    }
    //update custom alias only if it unique and also update shortcode
    if (updatedCustomAlias) {
      const existingAlias = await urlModel.findOne({
        customAlias: updatedCustomAlias,
        _id: { $ne: urlId },
      });

      if (existingAlias) {
        return res.status(403).json({
          message: "Custom alias already exists",
        });
      }
      url.shortCode=updatedCustomAlias;
      url.customAlias = updatedCustomAlias;
    }
    //save the object to db
    await url.save();
    return res.status(200).json({message:"Url details updated",url:url})
  }
  catch(err)
  {
    return res.status(500).json({error:err.message})
  }
});
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//route to softdelete url
urlApp.patch('/softdelete/:id',verifyToken("User"),async(req,res)=>
{
  try{
  //get url id
  const urlId=req.params.id
  //check if the url exists and it is not soft deleted
  const url=await urlModel.findOne({_id:urlId,isDeleted:false})
  if(!url)
  {
    return res.status(404).json({message:"Url not found"})
  }
  //check whether the same user is acessaing soft delete
  const user=req.user.id
  if(url.userId.toString()!==user)
  {
    return res.status(403).json({message:"You are unauthorised"});
  }
  //after all the conditions satisfied update the is deleted as true in db
  url.isDeleted=true;
  await url.save();
  return res.status(200).json({message:"Url is deleted"})
}
catch(err)
{
  return res.status(500).json({error:err.message})
}
});
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//route to restore the url
urlApp.patch('/restore/:id',verifyToken("User"),async(req,res)=>{
  try{
    //get the id from the http request
    const urlId=req.params.id
    //check whether the url exists in db with that id and it is sofdeleted
    const url=await urlModel.findOne({_id:urlId,isDeleted:true})
    if(!url)
    {
      return res.status(404).json({message:"Url not found"})
    }
    //check whether the same user acessing this route
    const user=req.user.id
    if(url.userId.toString()!==user)
    {
      return res.status(403).json({message:"You are unauthorised"})
    }
    url.isDeleted=false
    await url.save();
    return res.status(200).json({message:"Url is restored"})
  }
  catch(err)
  {
    return res.status(500).json({error:err.message})
  }
});
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//route to permanently delete the url
urlApp.delete('/permanent/:id', verifyToken("User"), async (req, res) => {

  try {

    //extract id from request
    const urlId = req.params.id;

    //find url
   const url = await urlModel.findOne({
     _id: urlId,
     isDeleted: true,
   });

    //check url exists
    if (!url) {
      return res.status(404).json({
        message: "Url not found"
      });
    }

    //check ownership
    const user = req.user.id;

    if (url.userId.toString() !== user) {
      return res.status(403).json({
        message: "You are unauthorised"
      });
    }
    await userModel.findByIdAndUpdate(user, {
      $pull: {
        urls: urlId,
      },
    });
    //delete url permanently
    await urlModel.findByIdAndDelete(urlId);

    return res.status(200).json({
      message: "Url permanently deleted"
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//route to get all urls in trash
//route to get all urls in trash
urlApp.get('/trash',verifyToken('User'),async(req,res)=>{
  try{

    const user=req.user.id

    const urls=await urlModel.find({
      userId:user,
      isDeleted:true
    });

    if(urls.length===0)
    {
      return res.status(404).json({
        message:"No url found in Trash bin"
      })
    }

    const formattedUrls=urls.map((url)=>({
      id:url._id,
      shortCode:url.shortCode,
      purpose:url.purpose,
      originalUrl:url.originalUrl,
      clicks:url.clicks,
      privacy:url.privacy,
      qrEnabled:url.qrEnabled,
      createdAt:url.createdAt
    }));

    return res.status(200).json({
      message:"Trash:",
      urls:formattedUrls
    })

  }
  catch(err)
  {
    return res.status(500).json({
      error:err.message
    })
  }
});
//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------
urlApp.get("/analytics/country", verifyToken("User"), async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await analyticsModel.aggregate([
      {
        $lookup: {
          from: "urls",
          localField: "urlId",
          foreignField: "_id",
          as: "url",
        },
      },
      { $unwind: "$url" },

      {
        $match: {
          "url.userId": new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $group: {
          _id: "$country",
          clicks: { $sum: 1 },
        },
      },

      {
        $project: {
          country: "$_id",
          clicks: 1,
          _id: 0,
        },
      },

      { $sort: { clicks: -1 } },
    ]);

    return res.status(200).json({
      message: "Country analytics fetched",
      data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
urlApp.get("/analytics/device", verifyToken("User"), async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await analyticsModel.aggregate([
      {
        $lookup: {
          from: "urls",
          localField: "urlId",
          foreignField: "_id",
          as: "url",
        },
      },
      { $unwind: "$url" },

      {
        $match: {
          "url.userId": new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $group: {
          _id: "$device",
          clicks: { $sum: 1 },
        },
      },

      {
        $project: {
          device: "$_id",
          clicks: 1,
          _id: 0,
        },
      },

      { $sort: { clicks: -1 } },
    ]);

    return res.status(200).json({
      message: "Device analytics fetched",
      data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//-----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
urlApp.get("/analytics/browser", verifyToken("User"), async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await analyticsModel.aggregate([
      {
        $lookup: {
          from: "urls",
          localField: "urlId",
          foreignField: "_id",
          as: "url",
        },
      },
      { $unwind: "$url" },

      {
        $match: {
          "url.userId": new mongoose.Types.ObjectId(userId),
        },
      },

      {
        $group: {
          _id: "$browser",
          clicks: { $sum: 1 },
        },
      },

      {
        $project: {
          browser: "$_id",
          clicks: 1,
          _id: 0,
        },
      },

      { $sort: { clicks: -1 } },
    ]);

    return res.status(200).json({
      message: "Browser analytics fetched",
      data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//route to get all urls 
urlApp.get('/allurls',verifyToken("User"),async(req,res)=>{
  try{
    const userId=req.user.id;
    const urls=await urlModel.find({userId:userId,isDeleted:false});
    if(urls.length === 0)
{
  return res.status(200).json({
    message: "No URLs found",
    url: []
  });
}
   const formattedUrls = urls.map((url) => ({
     id: url._id,
     purpose: url.purpose,
     originalUrl: url.originalUrl,
     shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
     clicks: url.clicks,
     privacy: url.privacy,
     qrEnabled: url.qrEnabled,
     createdAt: url.createdAt,
   }));
    return res.status(200).json({message:"Your url's are:",url:formattedUrls})
  }
  catch(err)
  {
    return res.status(500).json({error:err.message})
  }
});
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
urlApp.get(
  "/check/:shortCode",
  optionalVerifyToken,
  async (req, res) => {
    try {
      // extract shortCode from request parameters
      const { shortCode } = req.params;

      // find url document in database using shortCode
      const url = await urlModel.findOne({
        shortCode,
        isDeleted: false,
      });

      // check if url exists
      if (!url) {
        return res.status(404).json({
          status: "error",
          message: "Short url does not exist",
        });
      }

      // check if url is expired
      if (url.expiresAt && new Date() > url.expiresAt) {
        return res.status(403).json({
          status: "expired",
          message: "Access date expired",
        });
      }

      // check if max click limit is reached
      if (url.maxClicks && url.clicks >= url.maxClicks) {
        return res.status(403).json({
          status: "limit",
          message: "Maximum click limit reached",
        });
      }

      // check if url is private
      if (url.privacy === "Private") {
        // check if user is logged in
        if (!req.user) {
          return res.status(403).json({
            status: "private",
            message: "Please login to access private URL",
          });
        }

        // check if logged in user is owner
        if (url.userId.toString() !== req.user.id) {
          return res.status(403).json({
            status: "denied",
            message: "Access denied",
          });
        }
      }

      // return success response with original url
      return res.status(200).json({
        status: "ok",
        originalUrl: url.originalUrl,
      });
    } catch (err) {
      // handle server error
      return res.status(500).json({ error: err.message });
    }
  },
);
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
urlApp.get("/notifications", verifyToken("User"), async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    return res.status(200).json({
      notifications: user.notifications.reverse(),
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});
//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------
urlApp.get("/:shortCode", optionalVerifyToken, async (req, res) => {
  try {
    // extract shortCode from request parameters
    const { shortCode } = req.params;

    // find url document in database using shortCode
    const url = await urlModel.findOne({
      shortCode,
      isDeleted: false,
    });

    // check if url exists
    if (!url) {
      return res.status(404).send("Not found");
    }

    // get user agent from request headers
    const userAgent = req.headers["user-agent"];

    // create parser for user agent
    const parser = new UAParser(userAgent);

    // extract browser name
    const browser = parser.getBrowser().name || "Unknown";

    // extract operating system name
    const os = parser.getOS().name || "Unknown";

    // extract device type
    const device = parser.getDevice().type || "desktop";

    // get forwarded ip if available
    const forwarded = req.headers["x-forwarded-for"];

    // extract real ip address
    const ip = forwarded ? forwarded.split(",")[0] : req.socket.remoteAddress;

    // get geo location from ip
    const geo = geoip.lookup(ip);

    // extract country from geo data
    const country = geo?.country || "Local";

    // extract city from geo data
    const city = geo?.city || "Local";

    // store analytics data in database
    await analyticsModel.create({
      urlId: url._id,
      ip,
      country,
      city,
      device,
      browser,
      os,
    });

    // increment click count
    url.clicks += 1;

    // save updated url document
    await url.save();

    // validate original url format
    if (
      !url.originalUrl.startsWith("http://") &&
      !url.originalUrl.startsWith("https://")
    ) {
      return res.status(400).send("Invalid URL");
    }

    // redirect user to original url
    return res.redirect(url.originalUrl);
  } catch (err) {
    // handle server error
    return res.status(500).send(err.message);
  }
});
//------------------------------------------------------------------------------------------------------------------------
