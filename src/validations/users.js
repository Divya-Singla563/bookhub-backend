import Joi from "joi";
import { emailRegex, phoneNoRegex } from "../constants/index.js";

const signValidation = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().required().pattern(emailRegex),
  password: Joi.string().required().trim(),
  phoneNumber: Joi.string().pattern(phoneNoRegex),
  countryCode: Joi.string().when("phoneNumber", {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

const loginValidation = Joi.object({
  email: Joi.string().pattern(emailRegex),
  password: Joi.string().required().trim(),
});

const otpVerification = Joi.object({
  email: Joi.string().required().pattern(emailRegex),
  otp: Joi.string().required().trim(),
});

const updateValidation = Joi.object({
  name: Joi.string().required().trim(),
  phoneNumber: Joi.string().pattern(phoneNoRegex),
  countryCode: Joi.string().when("phoneNumber", {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

const forgotValidation = Joi.object({
  email: Joi.string().required().pattern(emailRegex),
});

const resetValidation = Joi.object({
  password: Joi.string().required(),
});

const changePasswordValidation = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

export {
  signValidation,
  loginValidation,
  otpVerification,
  updateValidation,
  forgotValidation,
  resetValidation,
  changePasswordValidation,
};
