import * as Validations from "../validations/index.js";
import * as Services from "../services/index.js";
import { Messages } from "../constants/index.js";

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

    return res.status(200).json({
      message: res.messages?.[result.message] || result.message,
      data: result.data,
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
