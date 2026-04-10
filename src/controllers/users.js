import * as Validations from "../validations/index.js";
import * as Services from "../services/index.js";
import { Messages } from "../constants/index.js";
import { generateToken, verifyToken } from "../utils/token.js";

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
      sameSite: "strict", //lax
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
    // build origin here (controller responsibility)
    const origin = `${req.protocol}://${req.get("host")}`;
    const result = await Services.forgotPasswordEJS(req.body, origin);

    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const resetPasswordEJS = async (req, res, next) => {
  try {
    const token = req.params.token;
    const { password } = req.body;

    const result = await Services.resetPasswordEJS(token, password);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const createRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken
  try {

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = await verifyToken(refreshToken, process.env.REFRESH_JWT_SECRET);

    const newAccessToken = generateToken({ _id: decoded._id, role: decoded.role }, process.env.JWT_SECRET, '2d');

    return res.status(200).json({ message: "Token refreshed successfully", data: { accessToken: newAccessToken } });

  } catch (error) {
    next(error);
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
  forgotPasswordEJS,
  resetPasswordEJS,
  createRefreshToken
};
