import mongoose from "mongoose";
import * as Modals from "../modals/index.js";

const addCategory = async (data) => {
  try {
    const category = await Modals.Category.create(data);

    return {
      message: "Category added successfully",
      data: category,
    };
  } catch (error) {
    throw error;
  }
};

const addSubCategory = async (data) => {
  try {
    const subCategory = await Modals.SubCategory.create(data);

    return {
      message: "Sub-Category added successfully",
      data: subCategory,
    };
  } catch (error) {
    throw error;
  }
};

const getCategories = async (limit, page) => {
  try {
    const skip = (page - 1) * limit;

    const categories = await Modals.Category.find().skip(skip).limit(limit);

    return {
      message: "Categories fetched successfully",
      data: categories,
    };
  } catch (error) {
    throw error;
  }
};

const getSubCategories = async (limit, page) => {
  try {
    const skip = (page - 1) * limit;

    const subCategory = await Modals.SubCategory.find()
      .skip(skip)
      .limit(limit)
      .populate("categoryId");

    return {
      message: "subCategory fetched successfully",
      data: subCategory,
    };
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (data, categoryId) => {
  try {
    const updatedCategory = await Modals.Category.findByIdAndUpdate(
      categoryId,
      data,
      {
        new: true,
        runValidators: true,
      },
    );

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
};

const updateSubCategory = async (data, categoryId) => {
  try {
    const updatedSubCategory = await Modals.SubCategory.findByIdAndUpdate(
      categoryId,
      data,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedSubCategory) {
      throw new Error("SubCategory not found");
    }

    return {
      message: "SubCategory updated successfully",
      data: updatedSubCategory,
    };
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (categoryId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("Category id not valid");
    }

    // ✅ efficient check (no full data fetch)
    const hasSubCategory = await Modals.SubCategory.exists({
      categoryId,
    }).lean();

    if (hasSubCategory) {
      throw new Error("Sub category existed ");
    }
    const deletedCategory = await Modals.Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      throw new Error("Category not found");
    }

    return {
      message: "Category deleted successfully",
    };
  } catch (error) {
    throw error;
  }
};

const deleteSubCategory = async (categoryId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("SubCategory id not valid");
    }
    const deletedCategory =
      await Modals.SubCategory.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      throw new Error("SubCategory not found");
    }

    return {
      message: "SubCategory deleted successfully",
    };
  } catch (error) {
    throw error;
  }
};

const addFaq = async (data) => {
  try {
    const obj = {
      title: data?.title,
      description: data?.description,
    };

    const templateExist = await Modals.FaqTemplate.findOne({
      title: data?.title,
    });

    if (templateExist) {
      throw new Error("FAQ Already Exist");
    }

    const template = await Modals.FaqTemplate.create(obj);

    const faqData = data?.faqs?.map((item) => ({
      ...item,
      templateId: new mongoose.Types.ObjectId(template?._id),
    }));

    await Modals.Faq.insertMany(faqData);

    return {
      message: "faq added successfully",
      data: template,
    };
  } catch (error) {
    throw error;
  }
};

const getTemplates = async () => {
  try {
    const data = await Modals.FaqTemplate.aggregate([
      {
        $lookup: {
          from: "faqs",
          localField: "_id",
          foreignField: "templateId",
          as: "faqs",
        },
      },
    ]);
    // const templates = await Modals.FaqTemplate.find().lean();
    // const faqData = await Modals.Faq.find().lean();
    // const data = templates?.map((item) => ({
    //   ...item,
    //   faqs: faqData.filter(
    //     (x) => x?.templateId?.toString() === item?._id?.toString(),
    //   ),
    // }));

    return {
      message: "faqs fetched successfully",
      data,
    };
  } catch (error) {
    throw error;
  }
};

const updateFaq = async (data, templateId) => {
  try {
    // ✅ 1. Update Template
    const template = await Modals.FaqTemplate.findByIdAndUpdate(
      templateId,
      {
        title: data?.title,
        description: data?.description,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    // ✅ 2. Get existing FAQs of this template
    const existingFaqs = await Modals.Faq.find({ templateId }).lean();

    const existingIds = existingFaqs.map((f) => f._id.toString());

    const incomingIds =
      data?.faqs?.filter((f) => f._id).map((f) => f._id.toString()) || [];

    // ✅ 3. Delete FAQs not present in incoming data
    const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id));

    if (idsToDelete.length > 0) {
      await Modals.Faq.deleteMany({
        _id: { $in: idsToDelete },
      });
    }

    // ✅ 4. Update / Create FAQs
    const faqPromises = data?.faqs?.map(async (item) => {
      if (item?._id) {
        // 🔁 Update
        return await Modals.Faq.findByIdAndUpdate(
          item._id,
          {
            question: item.question,
            answer: item.answer,
          },
          { new: true },
        );
      } else {
        // ➕ Create
        return await Modals.Faq.create({
          question: item.question,
          answer: item.answer,
          templateId,
        });
      }
    });

    const updatedFaqs = await Promise.all(faqPromises || []);

    return {
      message: "FAQ updated successfully",
      data: {
        ...template.toObject(),
        faqs: updatedFaqs,
      },
    };
  } catch (error) {
    throw error;
  }
};

const deleteFaqTemplate = async (templateId) => {
  console.log(templateId, 'templateIdtemplateId');

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // ✅ 1. Delete all FAQs of this template
    await Modals.Faq.deleteMany({ templateId }, { session });

    // ✅ 2. Delete the template
    const deletedTemplate = await Modals.FaqTemplate.findByIdAndDelete(
      templateId,
      { session },
    );

    // ❗ If template not found → force rollback
    if (!deletedTemplate) {
      throw new Error("Template not found");
    }

    // ✅ 3. Commit if everything is successful
    await session.commitTransaction();
    session.endSession();

    return {
      message: "Template and its FAQs deleted successfully",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
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
