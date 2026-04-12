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
  //books
  addBook,
  getUserBooks,
  getMyBookById,
  updateMyBook,
  deleteBook,
  //
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  addFaq,
  getTemplates,
  updateFaq,
  deleteFaqTemplate,
};
