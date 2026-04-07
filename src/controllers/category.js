import * as Validations from "../validations/index.js";
import * as Services from "../services/index.js";

const addCategory = async (req, res, next) => {
  try {
    const { error } = await Validations.category.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.addCategory(req.body);
    return res.status(200).json({ message: result.message, data: result.data })
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  const result = await Services.getCategories(limit, page)
  return res.status(200).json(result)

}

const updateCategory = async (req, res, next) => {
  try {
    const { error } = await Validations.category.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.updateCategory(req.body, req.params.id);
    return res.status(200).json({ message: result.message, data: result.data })
  } catch (error) {
    next(error);
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const result = await Services.deleteCategory(req.params.id);
    return res.status(200).json({ message: result.message, data: result.data })
  } catch (error) {
    next(error);
  }
}

export { addCategory, getCategories, updateCategory, deleteCategory };
