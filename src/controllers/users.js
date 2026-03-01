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
    console.log(req.user, "pppp");
  } catch (error) {
    next(error);
  }
};

export { signUp, verify, login, getProfile };
