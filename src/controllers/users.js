import * as Validations from "../validations/index.js";
import * as Services from "../services/index.js";
import { Messages } from "../constants/index.js";
import * as Modals from "../modals/index.js";
import crypto from "crypto";
import { sendResetEmail } from "../utils/mailer.js";

const signUp = async (req, res, next) => {
  try {
    const { error } = await Validations.signValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.signUp(req.body);

    return res.status(200).json({
      message: req.messages?.[result.message] || Messages.en[result.message],
    });
  } catch (error) {
    console.log("sign up error", error);

    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { error } = await Validations.otpVerification.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.verify(req.body);

    return res.status(200).json({
      message: req.messages?.[result.message] || Messages.en[result.message],
      data: result.data,
    });
  } catch (error) {
    console.log(error, "errorerror");

    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = await Validations.loginValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.login(req.body);

    res.cookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: res.messages?.[result.message] || result.message,
      data: {
        ...result.data,
        refreshToken: undefined, // optional: hide refresh token from response
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const result = await Services.getProfile(req?.user?._id);
    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { error } = await Validations.updateValidation.validate(req.body);

    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.updateProfile(req.body, req.user._id);

    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { error } = await Validations.forgotValidation.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.forgotPassword(req.body);

    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { error } = await Validations.resetValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.resetPassword(req.body, req.user._id);

    return res.status(200).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { error } = await Validations.changePasswordValidation.validate(
      req.body,
    );

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.changePassword(req.body, req.user._id);

    return res.status(200).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

const forgotPasswordEJS = async (req, res, next) => {
  try {
    const { error } = await Validations.forgotValidation.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.forgotPassword(req.body);

    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};


// const forgotPasswordEJS = async (req, res) => {
//   const { email } = req.body;

//   const user = await Modals.User.findOne({ email });
//   if (!user) return res.send("User not found");

//   // create token
//   const resetToken = crypto.randomBytes(32).toString("hex");

//   // hash token
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   user.resetPasswordToken = hashedToken;
//   user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

//   await user.save();

//   const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password-link/${resetToken}`;
//   console.log("Reset URL:", resetUrl); // later send email
//   if (email) {
//     await sendResetEmail(email, resetUrl);
//   }
//   res.send("Reset link sent");
// };

const resetPasswordEJS = async (req, res) => {
  const token = req.params.token;
  console.log(token, 'token');

  const { password } = req.body;

  if (!password) {
    return res.send("Password is required");
  }

  // HASH incoming token
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  console.log("Incoming token:", token);
  console.log("Hashed token:", hashedToken);

  const user = await Modals.User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  console.log(user, 'user', hashedToken, req.body);


  if (!user) return res.send("Token invalid or expired");

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.send("Password reset successful");
};

export {
  signUp,
  verify,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  forgotPasswordEJS,
  resetPasswordEJS
};
