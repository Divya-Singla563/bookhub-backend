import Joi from "joi";

const category = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
});

export { category };
