import mongoose from "mongoose";
import * as Modals from "../modals/index.js";


const addCategory = async (data,) => {
  try {

    const category = await Modals.Category.create(data)

    return {
      message: 'Category added successfully',
      data: category
    }
  } catch (error) {
    throw error;
  }
};

const getCategories = async (limit, page) => {
  try {
    const skip = (page - 1) * limit;

    const categories = await Modals.Category.find().skip(skip).limit(limit)

    return {
      message: 'Categories fetched successfully',
      data: categories
    }
  } catch (error) {
    throw error;
  }
}

const updateCategory = async (data, categoryId) => {
  try {
    const updatedCategory = await Modals.Category.findByIdAndUpdate(
      categoryId, data, {
      new: true,
      runValidators: true
    }
    )

    if (!updatedCategory) {
      throw new Error("Category not found");
    }

    return {
      message: "Category updated successfully",
      data: updatedCategory,
    };
  } catch (error) {
    throw error;
  }
}

const deleteCategory = async (categoryId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("Category id not valid");
    }
    const deletedCategory = await Modals.Category.findByIdAndDelete(categoryId)

    if (!deletedCategory) {
      throw new Error("Category not found");
    }

    return {
      message: "Category deleted successfully",
    };
  } catch (error) {
    throw error;
  }
}
export { addCategory, getCategories, updateCategory, deleteCategory };
