import express from "express";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
// import bodyParser from "body-parser";
import productRoutes from "./src/product/routes/product.routes.js";
import {
  errorHandlerMiddleware,
  handleUncaughtError,
} from "./middlewares/errorHandlerMiddleware.js";
import userRoutes from "./src/user/routes/user.routes.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./src/order/routes/order.routes.js";
import { ErrorHandler } from "./utils/errorHandler.js";

const configPath = path.resolve("backend", "config", "uat.env");
dotenv.config({ path: configPath });

const app = express();

app.use(express.json());
// app.use(bodyParser.json())
app.use(cookieParser()); 
// app.use(bodyParser.urlencoded({ extended: false }));
// configure routes
app.use("/api/storefleet/product", productRoutes);
app.use("/api/storefleet/user", userRoutes);
app.use("/api/storefleet/order", orderRoutes);

// errorHandlerMiddleware
app.use((err,req,res,next)=>{
  if(err instanceof mongoose.Error.ValidationError){
    return res.status(400).send(err.message);
   }
   if(err instanceof ErrorHandler){
     return res.status(err.statusCode).send(err.message);
   }
 
// console.log('errHandlerMiddle');
  errorHandlerMiddleware
  handleUncaughtError();
});

 //  if(err instanceof errorHandlerMiddleware){
  // // errorHandlerMiddleware(err,res,res,next);
  //   return res.status(err.statusCode).send(err.message);
  // }
export default app;
