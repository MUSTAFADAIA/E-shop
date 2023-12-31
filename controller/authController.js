const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");
const userModel = require("../models/userModel");

//@desc    signup
//@route   get /api/v1//auth/signup
//@access  public
exports.signup = asyncHandler(async (req, res, next) => {
  //1)creat user
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //2) Genarate token
  const token = createToken(user._id);
  res.status(201).json({ data: user, token });
});

//@desc    login
//@route   get /api/v1//auth/login
//@access  public
exports.login = asyncHandler(async (req, res, next) => {
  //1)check if password and email in the body (validator)
  //2) check if user exist and chek if password is correct
  const user = await userModel.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  //3) Genarate token
  const token = createToken(user._id);
  //4)send response to clint side
  res.status(200).json({ data: user, token });
});

//@desc    make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  //1) check if token exist , if exist get
  console.log(req.headers.authorization);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }
  if (!token) {
    return next(
      new ApiError(
        "you are not login , please login to get access this route",
        401
      )
    );
  }
  //2)Verify token (on change happens , expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);
  //3) Check if user exists
  const currentuser = await userModel.findById(decoded.userId);
  console.log(currentuser);
  if (!currentuser) {
    return next(
      new ApiError(
        "the user that belong to this token does no longre exist",
        401
      )
    );
  }
  //4)Check if user chenge his password after token created
  if (currentuser.passwordChangedAt) {
    const passchangedTimestamp = parseInt(
      currentuser.passwordChangedAt.getTime() / 1000,
      10
    );
    //password changed after token created (Error)
    if (passchangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "you have to change your password before you can access this route",
          401
        )
      );
    }
  }

  req.user = currentuser;
  next();
});

// @desc    Authorization (user Permissions)
// ["admin", "manager"]
exports.allowedTo = (...role) =>
  asyncHandler(async (req, res, next) => {
    //1)access roles
    // 2)access registered user (req.user.role)
    if (!role.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to access this route", 403)
      );
    }
    next();
  });

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //1)get user by email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`there is not user with the email ${req.body.email}`, 404)
    );
  }
  //2)if user exist , Generate reset random 6 digets and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();
  //3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await userModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
  });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
