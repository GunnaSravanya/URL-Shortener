import {config} from "dotenv";
import {connect} from "mongoose";
import exp from "express";
import cookieParser from "cookie-parser";
import {urlApp} from "./API/urlAPI.js"
import {commonApp} from "./API/commonAPI.js";
import {adminApp} from "./API/adminAPI.js";
import cors from "cors";
//for acessing env variables
config()
const app=exp();

//used to convert json data from request body into javascript object
app.use(exp.json());
//cors(cross origin resources sharing) to connect backend and frontend which running on two different ports
app.use(
  cors({
    origin: "https://url-shortener-nu-six-27.vercel.app",
    credentials: true,
  }),
);
//used to read,access,clear cookies,
app.use(cookieParser());
//seperate router for common routes
app.use('/commonApi',commonApp)
//seperate router for url routes
app.use('/urlApi',urlApp)
//seperate router for admin routes
app.use('/adminApi',adminApp)
//function to connect database and to run server on the port
const connectdb=async()=>{
    try{
    await connect(process.env.DB_URL);
    console.log("db connected.............")
    await app.listen(process.env.PORT,()=>console.log(`listening on port ${process.env.PORT}.......`))
}
catch(err)
{
    console.log(err);
}
};
connectdb();

