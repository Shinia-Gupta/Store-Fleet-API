// Please don't change the pre-written code
// Import the necessary modules here

import { sendPasswordResetEmail } from "../../../utils/emails/passwordReset.js";
import { sendWelcomeEmail } from "../../../utils/emails/welcomeMail.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";
import { sendToken } from "../../../utils/sendToken.js";
import {
  createNewUserRepo,
  deleteUserRepo,
  findUserForPasswordResetRepo,
  findUserRepo,
  getAllUsersRepo,
  updateUserProfileRepo,
  updateUserRoleAndProfileRepo,
  setNewUserPassword
} from "../models/user.repository.js";
import crypto from "crypto";

export const createNewUser = async (req, res, next) => {
  // const { name, email, password } = req.body;
  try {
    const newUser = await createNewUserRepo(req.body);
    // console.log(newUser);
    await sendToken(newUser, res, 200);

    // Implement sendWelcomeEmail function to send welcome message
    await sendWelcomeEmail(newUser);
  } catch (err) {
    //  handle error for duplicate email

    return next(new ErrorHandler(err.code, err.message));
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler(400, "please enter email/password"));
    }
    const user = await findUserRepo({ email }, true);
    if (!user) {
      return next(
        new ErrorHandler(401, "user not found! register yourself now!!")
      );
    }
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return next(new ErrorHandler(401, "Invalid email or passsword!"));
    }
    await sendToken(user, res, 200);
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const logoutUser = async (req, res, next) => {
  // res
  //   .status(200)
  //   .cookie("token", null, {
  //     expires: new Date(Date.now()),
  //     httpOnly: true,
  //   })
  //   .json({ success: true, msg: "logout successful" });
  res.clearCookie('token').json({ success: true, msg: "logout successful" })
};

export const forgetPassword = async (req, res, next) => {
  // Implement feature for forget password
  try {
    //take email of user
    const email = req.body.email;
    //find in repo for reset password
    const user = await findUserRepo({ email }, false);
    //generate reset token
    if (user) {
      // console.log(user);
      let token = await user.getResetPasswordToken();
      //send in mail
      // console.log(token);
      await sendPasswordResetEmail(user, `${token}`);
      res.status(200).cookie("resetPasswordtoken", token, {
        expires: new Date(Date.now()+10*60*1000),
        httpOnly: true,
      }).cookie("email",email, {
        expires: new Date(Date.now()+10*60*1000),
        httpOnly: true,
      }).send('Mail sent successfully');
    } else {
      throw new ErrorHandler(400, "User does not exist");
    }
  } catch (error) {
    console.log(error);
    throw new ErrorHandler(500, "Something went wrong in database");
  }
};

export const resetUserPassword = async (req, res, next) => {
  // Implement feature for reset password
  try {
    const { password, confirmPassword } = req.body;
    // console.log(req.params.token===req.cookies.resetPasswordtoken);
    // console.log(password === confirmPassword );
    if (password == confirmPassword && req.params.token==req.cookies.resetPasswordtoken) {
      // console.log(req.params.token);
      const user = await findUserRepo({email:req.cookies.email},false);
      if (user) {
      const resetPwd=  await setNewUserPassword(user, password);
      // console.log('reset-',resetPwd);
      res.status(200).send(resetPwd);
        // next();
      }else{
        next(new ErrorHandler(404, "No user found"));

      }
    } else {
      next(new ErrorHandler(400, "Passwords don't match"));
    }
  } catch (error) {
    next(new ErrorHandler(500, error.message));
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const userDetails = await findUserRepo({ _id: req.user._id });
    res.status(200).json({ success: true, userDetails });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  try {
    if (!currentPassword) {
      return next(new ErrorHandler(401, "pls enter current password"));
    }

    const user = await findUserRepo({ _id: req.user._id }, true);
    const passwordMatch = await user.comparePassword(currentPassword);
    if (!passwordMatch) {
      return next(new ErrorHandler(401, "Incorrect current password!"));
    }

    if (!newPassword || newPassword !== confirmPassword) {
      return next(
        new ErrorHandler(401, "mismatch new password and confirm password!")
      );
    }

    user.password = newPassword;
    await user.save();
    await sendToken(user, res, 200);
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const updateUserProfile = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const updatedUserDetails = await updateUserProfileRepo(req.user._id, {
      name,
      email,
    });
    res.status(201).json({ success: true, updatedUserDetails });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

// admin controllers
export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await getAllUsersRepo();
    res.status(200).json({ success: true, allUsers });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const getUserDetailsForAdmin = async (req, res, next) => {
  try {
    const userDetails = await findUserRepo({ _id: req.params.id });
    if (!userDetails) {
      return res
        .status(400)
        .json({ success: false, msg: "no user found with provided id" });
    }
    res.status(200).json({ success: true, userDetails });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserRepo(req.params.id);
    if (!deletedUser) {
      return res
        .status(400)
        .json({ success: false, msg: "no user found with provided id" });
    }

    res
      .status(200)
      .json({ success: true, msg: "user deleted successfully", deletedUser });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const updateUserProfileAndRole = async (req, res, next) => {
  // Write your code here for updating the roles of other users by admin
  try {
    const {name,email,role}=req.body;
  const userIdToUpdate=req.params.id;
  const resp=await updateUserRoleAndProfileRepo(userIdToUpdate,{name,email,role});
  res.status(200).send(resp);
  } catch (error) {
    next(new ErrorHandler(404,error));
  }
};
//already existing admin should change the role of other users the id of which user to update is given in the params