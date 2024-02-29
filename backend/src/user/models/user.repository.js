import UserModel from "./user.schema.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
// import { ObjectId } from "mongoose";
import { ErrorHandler } from "../../../utils/errorHandler.js";
import { ObjectId } from "mongodb";

export const createNewUserRepo = async (user) => {
  try {
    // console.log(user);
    // const hashedPassword = await bcrypt.hash(user.password, 10);
    // user.password = hashedPassword;
    return await new UserModel({
      name:user.name,
      email:user.email,
      password:user.password,
      role:user.role
    }).save();
  } catch (error) {
    if(error instanceof mongoose.Error.ValidationError){
        throw error;
    }else  if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      const duplicateError = new Error("Email already exists. Please login or register with a different email");
      duplicateError.statusCode = 400;
      throw duplicateError;
    }else{
        console.log(error);
        throw new ErrorHandler(500,'Something went wrong in database');
    }}
};

export const findUserRepo = async (factor, withPassword = false) => {
  if (withPassword) return await UserModel.findOne(factor).select("+password");
  else return await UserModel.findOne(factor);
};

export const findUserForPasswordResetRepo = async (hashtoken) => {
  return await UserModel.findOne({
    resetPasswordToken: hashtoken,
    resetPasswordExpire: { $gt: Date.now() },
  });
};

export const setNewUserPassword=async(user,password)=>{
  // console.log(user);
  const hashPass=await bcrypt.hash(password,10);
  return await UserModel.findOneAndUpdate({_id:new ObjectId(user._id)},{$set:{password:hashPass}});
}

export const updateUserProfileRepo = async (_id, data) => {
  return await UserModel.findOneAndUpdate(_id, data, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
};

export const getAllUsersRepo = async () => {
  return UserModel.find({});
};

export const deleteUserRepo = async (_id) => {
  return await UserModel.findByIdAndDelete(_id);
};

export const updateUserRoleAndProfileRepo = async (id, data) => {
  // Write your code here for updating the roles of other users by admin
  try {
    const userToUpdate=await UserModel.findOneAndUpdate({_id:new ObjectId(id)},{$set:{email:data.email,name:data.name,role:data.role}},{returnOriginal:false});
    if(userToUpdate)  return userToUpdate;
    else throw new ErrorHandler(404,'User not found');
  } catch (error) {
    console.log(error);
    return error.message;
  }
};
