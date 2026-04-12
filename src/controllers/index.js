import {
  addBook,
  getUserBooks,
  getMyBookById,
  updateMyBook,
  deleteBook,
} from "./books.js";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  addFaq,
  getTemplates,
  updateFaq,
  deleteFaqTemplate,
} from "./category.js";
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
  resetPasswordEJS,
  createRefreshToken,
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
  createRefreshToken,
  //
  uploadImage,
  //books
  addBook,
  getUserBooks,
  getMyBookById,
  updateMyBook,
  deleteBook,
  addFaq,
  getTemplates,
  updateFaq,
  deleteFaqTemplate,
  //category
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
