import mongoose, {Schema,model} from "mongoose";
const urlSchema=new Schema({
    shortCode:{
        type:String,
        required:true,
        unique:true
    },
    originalUrl:{
        type:String,
        required:[true,"long url is required to shorten it"]
    },
    customAlias:{
        type:String,
        unique:true,
        sparse:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        index:true,
        required:true
    },
    clicks:{
        type:Number,
        default:0
    },
    purpose:{
   type:String,
   enum:["Resume","Project","Event","General"]
},
privacy:{
   type:String,
   enum:["Public","Private"],
   default:"Public"
},
maxClicks:Number,
qrEnabled:{
   type:Boolean,
   default:false
},
country:String,
    expiresAt:Date,
    isDeleted:{
        type:Boolean,
        default:false
    },

},
{
timestamps:true,
versionKey:false,
strict:"throw"
}
);
export const urlModel=model("Url",urlSchema)