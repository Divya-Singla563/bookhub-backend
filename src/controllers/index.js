
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
  getHomescreenData,
  addPrescription,
  getMyPrescriptions,
};
