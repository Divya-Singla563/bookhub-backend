import * as Validations from "../validations/index.js";
import * as Services from "../services/index.js";

const addCategory = async (req, res, next) => {
  try {
    const { error } = await Validations.category.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.addCategory(req.body, req.user.id);
  } catch (error) {
    next(error);
  }
};

export { addCategory };
