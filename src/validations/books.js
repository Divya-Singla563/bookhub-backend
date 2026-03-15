import Joi from "joi";

const addBook = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  publisher: Joi.string().required(),
  yearOfPublishing: Joi.number().required(),
  ISBN: Joi.string().required(),
  numberOfPages: Joi.number().required(),
  productTag: Joi.string().required(),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      public_id: Joi.string().required(),
    }),
  ),
  //   category: Joi.string().required(),
});

export { addBook };
