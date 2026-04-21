import * as Validations from "../validations/index.js";
import * as Services from "../services/index.js";

const addCategory = async (req, res, next) => {
  try {
    const { error } = await Validations.category.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.addCategory(req.body);
    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const addSubCategory = async (req, res, next) => {
  try {
    const { error } = await Validations.subCategory.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.addSubCategory(req.body);
    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const result = await Services.getCategories(limit, page);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getSubCategories = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const result = await Services.getSubCategories(limit, page);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { error } = await Validations.category.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.updateCategory(req.body, req.params.id);
    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const result = await Services.deleteCategory(req.params.id);
    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const updateSubCategory = async (req, res, next) => {
  try {
    const { error } = await Validations.subCategory.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.updateSubCategory(req.body, req.params.id);
    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const deleteSubCategory = async (req, res, next) => {
  try {
    const result = await Services.deleteSubCategory(req.params.id);
    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const addFaq = async (req, res, next) => {
  try {
    const result = await Services.addFaq(req.body);
    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const getTemplates = async (req, res, next) => {
  try {
    const result = await Services.getTemplates();
    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const updateFaq = async (req, res, next) => {
  try {
    const result = await Services.updateFaq(req.body, req.params.id);
    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const deleteFaqTemplate = async (req, res, next) => {
  try {
    console.log(req.params.id, 'req.params.idreq.params.id');

    const result = await Services.deleteFaqTemplate(req.params.id);
    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

export {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  addFaq,
  getTemplates,
  updateFaq,
  deleteFaqTemplate,
  addSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
};
