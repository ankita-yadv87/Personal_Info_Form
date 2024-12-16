const ErrorHandler = require("../services/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/userModel")
const crypto = require("crypto");
const sendEmail = require("../services/sendEmail");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Multer storage configuration
const storage = multer.diskStorage({});
const upload = multer({ storage });

//register user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { firstName,
    lastName,
    gender,
    email,
    password,
    city,
    state,
    zip,
    country,
  } = req.body;
console.log("REQ.body",req.body,"req.file",req.file)

  const areaOfInterest = Array.isArray(req.body?.areaOfInterest)
    ? req.body?.areaOfInterest
    : JSON.parse(req.body?.areaOfInterest || "[]");

  const uploadedFile = req.file;

  if (!uploadedFile) {
    return next(new ErrorHandler("No file uploaded", 400));
  }

  const existingUser = await User.findOne({ email: email.trim() });
  if (existingUser) {
    return next(new ErrorHandler("The email address is already registered. Please use a different email or log in.", 400));
  }

  let result = "";
  try {
    result = await cloudinary.uploader.upload(uploadedFile.path, {
      folder: "profile_pictures", // Cloudinary folder
      resource_type: "auto", // Automatically detect file type (image, video, etc.)
    });
  } catch (error) {
    return next(new ErrorHandler("Cloud upload failed", 500));
  }


  const user = await User.create({
    firstName,
    lastName,
    gender,
    email: email.trim(),
    password,
    city,
    state,
    zip,
    country,
    areaOfInterest,
    profilePicture: {
      url: result?.secure_url,
      public_id: result?.public_id,
    },
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});


//login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorHandler("Invalid Email or Password", 401))
  }

  const token = user.getJWTToken();

  const userData = user.toObject();
  delete userData.password;

  res.status(200).json({
    success: true,
    user: userData,
    token,
  })
});

// Logout User
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler("No user is logged in", 400));
  }
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    // sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Update User
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, gender, city, state, zip, country,profile_public_id} = req.body;
  const missingFields = [];

  if (!firstName) missingFields.push("First Name");
  if (!lastName) missingFields.push("Last Name");
  if (!gender) missingFields.push("Gender");
  if (!zip) missingFields.push("Zip code");
  if (!country) missingFields.push("Country");

  if (missingFields.length > 0) {
    return next(new ErrorHandler(`${missingFields.join(", ")} are required`, 400));
  }

  const areaOfInterest = Array.isArray(req.body?.areaOfInterest)
  ? req.body?.areaOfInterest
  : JSON.parse(req.body?.areaOfInterest || "[]");


  const uploadedFile = req.file;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (uploadedFile) {
    try {
      const result = await cloudinary.uploader.upload(uploadedFile.path, {
        public_id: profile_public_id, // Overwrite the existing file
        overwrite: true,
        resource_type: "auto",
      });

      console.log("File updated successfully:");
      user.profilePicture = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      return next(new ErrorHandler("Failed to update profile picture. Please try after some time.", 500));
    }
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.gender = gender;
  user.city = city;
  user.state = state;
  user.zip = zip;
  user.country = country;
  user.areaOfInterest = areaOfInterest;

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});

// Delete User
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Delete user profile picture or other assets from Cloudinary
  if (user.profilePicture?.public_id) {

    try {
      await cloudinary.uploader.destroy(user.profilePicture.public_id);
    } catch (error) {
      console.error(`Error deleting Cloudinary asset: ${error.message}`);
    }
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  if (!users || users?.length === 0) {
    return next(new ErrorHandler("No Users Found", 404));
  }

  res.status(200).json({
    success: true,
    users
  })
})

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  res.status(200).json({
    success: true,
    user
  }
  )
})

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Generate Reset Token
  const resetToken = user.getResetPwdToken();

  await user.save({ validateBeforeSave: false });

  // Construct Reset Password URL
  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/reset-password/${resetToken}`;

  const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\nIf you did not request this email, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Email could not be sent", 500));
  }
});


exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash the token sent in the URL to match the database token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or has expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match the confirm password", 400));
  }

  // Update the user's password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

// module.exports = {
//   upload,
// };
