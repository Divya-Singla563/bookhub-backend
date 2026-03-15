import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

categorySchema.index({ name: 1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;
