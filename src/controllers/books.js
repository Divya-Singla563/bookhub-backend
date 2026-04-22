import * as Validations from "../validations/index.js";
import * as Services from "../services/index.js";

const addBook = async (req, res, next) => {
  try {
    const { error } = await Validations.addBook.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const result = await Services.addBook(req.body, req?.user?._id);

    return res.status(200).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getMyBookById = async (req, res, next) => {
  try {
    const result = await Services.getMyBookById(req.user._id, req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateMyBook = async (req, res, next) => {
  try {
    // const { error } = await Validations.addBook.validate(req.body);

    // if (error) {
    //   return res.status(400).json({ message: error.details[0].message });
    // }

    const result = await Services.updateMyBook(
      req.body,
      req.params.id,
      req.user._id,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const result = await Services.deleteBook(req.user._id, req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getUserBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const result = await Services.getUserBooks(
      req.user._id,
      page,
      limit,
      req.query.search,
      status,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateBookStatus = async (req, res, next) => {
  try {
    const result = await Services.updateBookStatus(
      req.body,
      req.params.id,
      req.user._id,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await Services.getAllBooks(
      req.user._id,
      page,
      limit,
      req.query.search,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getMyLibrary = async (req, res, next) => {
  try {
    const result = await Services.getMyLibrary(req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const toggleWishlist = async (req, res, next) => {
  try {
    const result = await Services.toggleWishlist(req.user._id, req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getMyWishlist = async (req, res, next) => {
  try {
    const result = await Services.getMyWishlist(req.user._id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export {
  addBook,
  getUserBooks,
  getMyBookById,
  updateMyBook,
  deleteBook,
  getAllBooks,
  updateBookStatus,
  getMyLibrary,
  toggleWishlist,
  getMyWishlist,
};
