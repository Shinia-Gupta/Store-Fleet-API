import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user name is required"],
    maxLength: [30, "user name can't exceed 30 characters"],
    minLength: [2, "name should have atleast 2 charcters"],
  },
  email: {
    type: String,
    required: [true, "user email is required"],
    unique: [true,'Email already exists. Please login or register with a different email'],
    validate: [validator.isEmail, "pls enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    select: false,
  },
  profileImg: {
    public_id: {
      type: String,
      required: true,
      default: "1234567890",
    },
    url: {
      type: String,
      required: true,
      default: "this is dummy avatar url",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  resetPasswordToken: {type:String},
  resetPasswordExpire: {type:Date},
});

userSchema.pre("save", async function (next) {
  //  hash user password before saving using bcrypt
  if(this.isModified('password')){
try {
  const hashpassword=await bcrypt.hash(this.password,10);
this.password=hashpassword;
next();
} catch (error) {
  next(error)
}
  }else{
    next();
  }
});

// JWT Token
userSchema.methods.getJWTToken =async function () {
  const user=this;
  // console.log(user);
  const token=await jwt.sign({ id: user._id }, process.env.JWT_Secret, {
    expiresIn: process.env.JWT_Expire,
  });
  // console.log(token);
return token;
}
// user password compare
userSchema.methods.comparePassword = async function (password) {

  return await bcrypt.compare(password, this.password);
};

// generatePasswordResetToken
userSchema.methods.getResetPasswordToken = async function () {
  const user=this;
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and updating user resetPasswordToken
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
await user.save();
  return resetToken;
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;


//when a user goes to route forgot password, mail should be sent to the registered user email id with the localhost url to fill in the token that is in the mail. then the token should be verified once thT TOKEN is sent as parameter.