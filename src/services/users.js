import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { Messages } from "../constants/index.js";
import * as Modals from "../modals/index.js";
import {
  generateToken,
  hashOTP,
  sendEmail,
  sendResetEmail,
} from "../utils/index.js";
import crypto from "crypto";
import { hashToken } from "../utils/token.js";
import redisClient from "../config/redis-config.js";

const signUp = async (data) => {
  try {
    const { name, email, password, type, role } = data;

    console.log(type, "type", role);

    const verifiedUser = await Modals.User.findOne({
      email,
      isEmailVerified: true,
    });

    if (verifiedUser) {
      throw new Error(Messages.en.USER_ALREADY_VERIFIED);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create or update unverified user
    console.log(hashedPassword);

    await Modals.User.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password: hashedPassword,
        isEmailVerified: false,
        role,
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      },
    );
    let OTP = 1234;
    // Math.floor(1000 + Math.random() * 9000);
    const hashedOtp = hashOTP(OTP);
    const expiresAt = dayjs().add(10, "minutes").toDate();

    await Modals.OTP.findOneAndUpdate(
      { email },
      { otp: hashedOtp, expiresAt, type },
      { upsert: true, returnDocument: "after" },
    );

    if (email) {
      await sendEmail(email, OTP);
    }

    return {
      message: Messages.en.OTP_SEND,
      statusCode: 200,
    };
  } catch (error) {
    throw error;
  }
};

const verify = async (data) => {
  try {
    const { email, otp } = data;
    const hashedOtp = hashOTP(otp);

    const otpData = await Modals.OTP.findOne({ email });

    if (!otpData) {
      throw new Error(Messages.en.OTP_EXPIRED);
    }

    const findUser = await Modals.User.findOne({
      email,
      isEmailVerified: true,
    });

    if (findUser && otpData.type === 1) {
      throw new Error(Messages.en.USER_ALREADY_EXISTS);
    }

    if (otpData && otpData.otp !== hashedOtp) {
      throw new Error(Messages.en.INVALID_OTP);
    }
    if (otpData) {
      const user = await Modals.User.findOneAndUpdate(
        { email },
        { isEmailVerified: true },
        { returnDocument: "after", lean: true },
      );
      if (!user) {
        throw new Error(Messages.en.USER_NOT_FOUND);
      }

      await Modals.OTP.deleteOne({ email });

      const token = generateToken(
        { _id: user._id, role: user.role },
        process.env.JWT_SECRET,
        "2d",
      );
      const refreshToken = await generateToken(
        {
          _id: user?._id,
          role: user.role,
        },
        process.env.REFRESH_JWT_SECRET,
        "7d",
      );

      return {
        message: Messages.en.OTP_VERIFIED,
        statusCode: 200,
        data: {
          ...user,
          token,
          refreshToken,
        },
      };
    }
  } catch (error) {
    throw error;
  }
};

const login = async (body) => {
  const { email, password } = body;
  try {
    const userExisted = await Modals.User.findOne({ email })
      .select("+password")
      .lean();

    if (!userExisted || !userExisted?.isEmailVerified) {
      throw new Error("User not found");
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      userExisted.password,
    );

    if (!isPasswordMatched) {
      throw new Error("Invalid Credentials");
    }

    delete userExisted.password;

    const token = generateToken(
      {
        _id: userExisted._id,
        role: userExisted.role,
      },
      process.env.JWT_SECRET,
      "2d",
    );

    const refreshToken = await generateToken(
      {
        _id: userExisted?._id,
        role: userExisted.role,
      },
      process.env.REFRESH_JWT_SECRET,
      "7d",
    );

    return {
      message: "get data",
      statusCode: 200,
      data: {
        ...userExisted,
        token,
        refreshToken,
      },
    };
  } catch (error) {
    throw error;
  }
};

const getProfile = async (id) => {
  try {
    const newUser = await Modals.User.findById(id).lean();
    return {
      message: "success",
      statusCode: 200,
      data: newUser,
    };
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (body, userId) => {
  try {
    const updatedUser = await Modals.User.findByIdAndUpdate(
      userId,
      { $set: body },
      { new: true, runValidators: true },
    );

    console.log(updatedUser, "body", userId);
    return { message: "User updated successfully", data: updatedUser };
  } catch (error) {
    throw error;
  }
};

const forgotPassword = async (body) => {
  const { email, type } = body;
  try {
    const findUser = await Modals.User.findOne({ email });

    if (!findUser) {
      throw new Error("User not found");
    }

    let OTP = 1234;
    const key = `otp:${email}`;
    console.log(key, "key==", OTP);

    const hashedOtp = hashOTP(OTP);
    const expiresAt = dayjs().add(10, "minutes").toDate();
    await redisClient.set(key, String(OTP), { EX: 60 });
    await Modals.OTP.findOneAndUpdate(
      { email },
      { otp: hashedOtp, expiresAt, type },
      { upsert: true, returnDocument: "after" },
    );

    if (email) {
      sendEmail(email, OTP);
    }

    return {
      message: Messages.en.OTP_SEND,
      statusCode: 200,
    };
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (body, id) => {
  const { password } = body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await Modals.User.findByIdAndUpdate(
      id,
      { $set: { password: hashedPassword } },
      { new: true },
    ).select("-password");

    return {
      message: "Password updated successfully",
      statusCode: 200,
    };
  } catch (error) {
    throw error;
  }
};

const changePassword = async (body, id) => {
  const { oldPassword, newPassword } = body;

  try {
    const findUser = await Modals.User.findById(id).select("+password").lean();

    if (!findUser) {
      throw new Error("User not found");
    }

    const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      findUser.password,
    );

    if (!isPasswordMatched) {
      throw new Error("Old password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await Modals.User.findByIdAndUpdate(
      id,
      { $set: { password: hashedNewPassword } },
      { new: true },
    );

    return {
      message: "Password changed succesffully",
      statusCode: 200,
    };
  } catch (error) {
    throw error;
  }
};

const forgotPasswordEJS = async (body, origin) => {
  const { email } = body;

  try {
    const user = await Modals.User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = hashToken(resetToken);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    const resetUrl = `${origin}/api/auth/reset-password-link/${resetToken}`;
    console.log("Reset URL:", resetUrl); // later send email
    // 5. send email
    await sendResetEmail(email, resetUrl);
    return {
      message: "Reset link sent",
    };
  } catch (error) {
    throw error;
  }
};

const resetPasswordEJS = async (token, password) => {
  if (!password) {
    throw {
      status: 400,
      message: "Password is required",
    };
  }

  // 1. hash token
  const hashedToken = hashToken(token);

  // 2. find user
  const user = await Modals.User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw {
      status: 400,
      message: "Token invalid or expired",
    };
  }

  // 3. update password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return {
    message: "Password reset successful",
    data: user,
  };
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
  resetPasswordEJS,
};
