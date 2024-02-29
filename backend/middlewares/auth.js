import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/errorHandler.js";
import UserModel from "../src/user/models/user.schema.js";

export const auth = async (req, res, next) => {
  let { token } = req.cookies;
  // token=decodeURIComponent(token)
  if (!token) {
    return next(new ErrorHandler(401, "login to access this route!"));
  }
  const decodedData = await jwt.verify(token, process.env.JWT_Secret);
  req.user = await UserModel.findById(decodedData.id);
  next();
};

//if the role is specified as admin, only then i shall be able to access the route otherwise throw an unauthorized error
export const authByUserRole = (roles) => {
  // fix this middleware for admin access only-done
  return async (req, res, next) => {
    console.log(req.user);
    if (req.user.role==='user') {
      return next(
        new ErrorHandler(
          403,
          `Role: ${req.user.role} is not allowed to access this resource`
        )
      );
    }
    next();
  };
};

