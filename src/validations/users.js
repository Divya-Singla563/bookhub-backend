import Joi from "joi";
import { emailRegex } from "../constants";

const signValidation = Joi.object({
  name: Joi.string().required().trim(),
  eamil: Joi.string().pattern(emailRegex),
});
