import mongoose from "mongoose";
import * as Modals from "../modals/index.js";


const addCategory = async (data, userId) => {
  try {

    const category = await Modals.Category.create()
  } catch (error) {
    throw error;
  }
};

export { addCategory };
