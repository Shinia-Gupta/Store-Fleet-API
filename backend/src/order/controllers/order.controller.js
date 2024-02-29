// Please don't change the pre-written code
// Import the necessary modules here

import { createNewOrderRepo } from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

export const createNewOrder = async (req, res, next) => {
  // Write your code here for placing a new order
try {
  const {shippingInfo,orderedItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice}=req.body;
  const resp=  await createNewOrderRepo({shippingInfo,orderedItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,userId:req.user._id});
res.status(201).json({message:"Order placed Successfully",order_details:resp});  
} catch (error) {
  console.log(error);
  res.status(400).json(error.message);
}
};
