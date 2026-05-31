import {userModel} from "../models/userSchema.js"
import {verifyToken} from "../middlewares/verifyToken.js"
import {urlModel} from "../models/url.js"
import {analyticsModel} from "../models/analytics.js"
import exp from "express"
export const adminApp=exp.Router()
//user management 
//get all users
adminApp.get("/users", verifyToken("Admin"), async (req, res) => {
  try {
    // get all normal users
    const users = await userModel.find({ role: "User" });

    // format response
    const formattedUsers = await Promise.all(
      users.map(async (user) => {
        // count only active urls
        const totalUrls = await urlModel.countDocuments({
          userId: user._id,
          isDeleted: false,
        });

        return {
          id: user._id,
          fName: user.fName,
          email: user.email,
          totalUrls,
          isActive: user.isActive,
        };
      }),
    );

    // send response
    return res.status(200).json({
      message: "Here are all the users",
      users: formattedUsers,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching users",
      error: err.message,
    });
  }
});
//-----------------------------------------------------------------------------------------------------------------------
//block or unblock users
adminApp.patch('/userstatus', verifyToken('Admin'), async (req, res) => {

    try {

        //get status, userId and email
        const { userId, email, status } = req.body;

        //check whether user exists
        const user = await userModel.findOne({
            _id: userId,
            email: email
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        //check whether same status already exists
        if (user.isActive === status) {

            return res.status(400).json({
                message: "Status is already same"
            });

        }

        //update status
        user.isActive = status;

        //save in db
        await user.save();

        //response
        return res.status(200).json({
            message: "Status has been updated"
        });

    }
    catch (err) {

        return res.status(500).json({
            error: err.message
        });

    }

});
//----------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------
//url management
//get all urls of a specific user
adminApp.get('/user/:id', verifyToken('Admin'), async (req, res) => {

    try {

        //extract user id
        const { id } = req.params;

        //check whether user exists
        const user = await userModel.findById(id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        //check whether urls exist
        if (user.urls.length === 0) {

            return res.status(404).json({
                message: "No URLs found for this user"
            });

        }

        //fetch urls using ids
        const urls = await urlModel.find({
            _id: { $in: user.urls },
            isDeleted: false
        });

        //format response
        const formattedUrls = urls.map((url) => ({
          id: url._id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          clicks: url.clicks,
          privacy: url.privacy,
        }));

        //send response
        return res.status(200).json({

            message: "User URLs fetched successfully",
            urls: formattedUrls

        });

    }
    catch (err) {

        return res.status(500).json({
            error: err.message
        });

    }

});
//---------------------------------------------------------------------------------------------------
//admin delete url permanently
adminApp.delete('/url/:id', verifyToken('Admin'), async (req, res) => {

  try {

    //extract url id
    const { id } = req.params;

    //find url
    const url = await urlModel.findById(id);

    //check url exists
    if (!url) {

      return res.status(404).json({
        message: "URL not found"
      });

    }

    //remove url id from user's urls array and push notification in to user schema to notify the user that his url is deleted
    await userModel.findByIdAndUpdate(url.userId, {
      $pull: {
        urls: id,
      },

      $push: {
        notifications: {
          message: `Your URL (${url.shortCode}) was deleted by admin.`,
        },
      },
    });

    //delete permanently
    await urlModel.findByIdAndDelete(id);

    //response
    return res.status(200).json({
      message: "URL deleted successfully"
    });

  }
  catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
adminApp.get("/dashboard", verifyToken("Admin"), async (req, res) => {
  try {
    /* ================= TOTALS ================= */
    const totalUsers = await userModel.countDocuments({ role: "User" });

    const totalUrls = await urlModel.countDocuments({ isDeleted: false });

    const totalClicks = await analyticsModel.countDocuments();

    const privateUrls = await urlModel.countDocuments({
      privacy: "Private",
      isDeleted: false,
    });

    const publicUrls = await urlModel.countDocuments({
      privacy: "Public",
      isDeleted: false,
    });

    const qrGenerated = await urlModel.countDocuments({
      qrEnabled: true,
    });

    /* ================= USERS BY COUNTRY ================= */
    const userCountryStats = await userModel.aggregate([
      {
        $match: {
          role: "User",
          country: { $nin: [null, "", "Unknown"] },
        },
      },
      {
        $group: {
          _id: "$country",
          users: { $sum: 1 },
        },
      },
    ]);

    /* ================= URLS BY COUNTRY ================= */
    const urlCountryStats = await urlModel.aggregate([
      {
        $match: {
          isDeleted: false,
          country: { $nin: [null, "", "Unknown"] },
        },
      },
      {
        $group: {
          _id: "$country",
          urls: { $sum: 1 },
        },
      },
    ]);

    /* ================= CLICKS BY COUNTRY ================= */
    const clickCountryStats = await analyticsModel.aggregate([
      {
        $match: {
          country: { $nin: [null, "", "Unknown"] },
        },
      },
      {
        $group: {
          _id: "$country",
          clicks: { $sum: 1 },
        },
      },
    ]);

    /* ================= MERGE ALL ================= */
    const map = new Map();

    // helper function
    const ensure = (country) => {
      if (!map.has(country)) {
        map.set(country, {
          country,
          users: 0,
          urls: 0,
          clicks: 0,
        });
      }
      return map.get(country);
    };

    // USERS
    userCountryStats.forEach((item) => {
      const c = item._id;
      ensure(c).users = item.users;
    });

    // URLS
    urlCountryStats.forEach((item) => {
      const c = item._id;
      ensure(c).urls = item.urls;
    });

    // CLICKS
    clickCountryStats.forEach((item) => {
      const c = item._id;
      ensure(c).clicks = item.clicks;
    });

    const countryStats = Array.from(map.values());

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      message: "Dashboard statistics fetched successfully",

      stats: {
        totalUsers,
        totalUrls,
        totalClicks,
        privateUrls,
        publicUrls,
        qrGenerated,
      },

      countryStats,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err.message,
    });
  }
});
//------------------------------------------------------------------------------------------------------------------------
adminApp.get("/searchusers", verifyToken("Admin"), async (req, res) => {
  try {
    // get search query
    const search = req.query.search || "";

    // find matching users
    const users = await userModel.find({
      role: "User",

      $or: [
        {
          fName: {
            $regex: search,
            $options: "i",
          },
        },

        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    });

    // format response
    const formattedUsers = await Promise.all(
      users.map(async (user) => {
        const totalUrls = await urlModel.countDocuments({
          userId: user._id,
          isDeleted: false,
        });

        return {
          id: user._id,
          fName: user.fName,
          email: user.email,
          totalUrls,
          isActive: user.isActive,
        };
      }),
    );

    // send response
    return res.status(200).json({
      message: "Users fetched successfully",
      users: formattedUsers,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error searching users",
      error: err.message,
    });
  }
});
