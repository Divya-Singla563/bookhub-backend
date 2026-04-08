import {
  addBook,
  getUserBooks,
  getMyBookById,
  updateMyBook,
  deleteBook,
} from "./books.js";
import { addCategory, getCategories, updateCategory, deleteCategory } from "./category.js";
import { uploadImage } from "./upload.js";
import {
  signUp,
  verify,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  forgotPasswordEJS,
  resetPasswordEJS
} from "./users.js";

export {
  signUp,
  verify,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  forgotPasswordEJS,
  resetPasswordEJS,
  //
  uploadImage,
  //books
  addBook,
  getUserBooks,
  getMyBookById,
  updateMyBook,
  deleteBook,

  //category
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory
};
