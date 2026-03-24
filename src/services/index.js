import {
  addBook,
  getUserBooks,
  getMyBookById,
  updateMyBook,
  deleteBook,
} from "./books.js";
import { addCategory } from "./category.js";
import {
  signUp,
  verify,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
} from "./users.js";
import { getHomescreenData } from "./homescreen.js";
import { addPrescription, getMyPrescriptions } from "./prescription.js";

export {
  signUp,
  verify,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  //books
  addBook,
  getUserBooks,
  getMyBookById,
  updateMyBook,
  deleteBook,
  addCategory,
  getHomescreenData,
  addPrescription,
  getMyPrescriptions,
};
