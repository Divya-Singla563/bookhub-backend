import dayjs from "dayjs";
import bcrypt from "bcrypt";
import * as Modals from "../modals/index.js";
import {
  generateToken,
  hashOTP,
  sendEmail,
  generateAndSaveRefreshToken,
} from "../utils/index.js";

const signUp = async (data) => {
  try {
    const { name, email, password, type } = data;

    console.log(type, "type");

    const verifiedUser = await Modals.User.findOne({
      email,
      isEmailVerified: true,
    });

    if (verifiedUser) {
      throw new Error("User Already Verified");
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
      message: "Otp Send",
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
      throw new Error("Otp Expired");
    }

    const findUser = await Modals.User.findOne({
      email,
      isEmailVerified: true,
    });

    if (findUser && otpData.type === 1) {
      throw new Error("User Already Exists");
    }
    console.log(findUser, "findUser", otpData, otpData.otp !== hashedOtp);

    if (otpData && otpData.otp !== hashedOtp) {
      console.log("chalaa");

      throw new Error("Invalid Otp");
    }
    console.log("chalaa 2");
    if (otpData) {
      const user = await Modals.User.findOneAndUpdate(
        { email },
        { isEmailVerified: true },
        { returnDocument: "after", lean: true },
      );
      console.log("chalaa 3");
      if (!user) {
        throw new Error("User Not Found");
      }

      await Modals.OTP.deleteOne({ email });

      const token = generateToken({ _id: user._id });
      const refreshToken = await generateAndSaveRefreshToken({
        _id: user?._id,
      });

      return {
        message: "Otp Verified",
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

    const token = generateToken({
      _id: userExisted._id,
    });

    const refreshToken = await generateAndSaveRefreshToken({
      _id: userExisted?._id,
    });

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
    const hashedOtp = hashOTP(OTP);
    const expiresAt = dayjs().add(10, "minutes").toDate();

    await Modals.OTP.findOneAndUpdate(
      { email },
      { otp: hashedOtp, expiresAt, type },
      { upsert: true, returnDocument: "after" },
    );

    if (email) {
      sendEmail(email, OTP);
    }

    return {
      message: "Otp Send",
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

export {
  signUp,
  verify,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
};
