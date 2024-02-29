import mongoose from "mongoose";
import { ErrorHandler } from "../../../utils/errorHandler.js";
import OrderModel from "./order.schema.js";
import { ObjectId } from "mongodb";
export const createNewOrderRepo = async (data) => {
  // Write your code here for placing a new order
 try {
  const newOrder=new OrderModel({
    shippingInfo:data.shippingInfo,
    orderedItems:data.orderedItems,
    user:new ObjectId(data.userId),
    paymentInfo:data.paymentInfo,
    itemsPrice:Number(data.itemsPrice),
    taxPrice:Number(data.taxPrice),
    shippingPrice:Number(data.shippingPrice),
    totalPrice:Number(data.totalPrice),
    

  });
  await newOrder.save();
  return newOrder;
 } catch (error) {
  if(error instanceof mongoose.Error.ValidationError){
    throw error;
  }
  console.log(error);
  throw new ErrorHandler(500,'Something wrong in database');
 }
};
