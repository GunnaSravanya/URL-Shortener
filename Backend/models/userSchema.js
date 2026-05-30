import mongoose, {Schema,model} from "mongoose"
const userSchema = new Schema(
  {
    fName: {
      type: String,
      required: [true, "name should be required"],
    },
    lName: String,
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: [true, "email should be in lowercase"],
    },
    password: {
      type: String,
      required: [true, "password is compulsory.So,please enter it"],
    },
    role: {
      type: String,
      default: "User",
    },
    urls: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Url",
      },
    ],
    country: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    notifications: [
      {
        message: {
          type: String,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },

        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  },
);
export const userModel=model("User",userSchema);