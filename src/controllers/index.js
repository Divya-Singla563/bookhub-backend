import {
  addBook,
  getUserBooks,
  getMyBookById,
  updateMyBook,
  deleteBook,
} from "./books.js";
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
  //
  uploadImage,
  //books
  addBook,
  getUserBooks,
  getMyBookById,
  updateMyBook,
  deleteBook,
  getHomescreenData,
  addPrescription,
  getMyPrescriptions,
};
