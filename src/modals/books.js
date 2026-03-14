import mongoose from "mongoose";

const booksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
    },
    yearOfPublishing: {
      type: Number,
    },
    ISBN: {
      type: String,
      trim: true,
      unique: true,
    },
    numberOfPages: {
      type: Number,
    },
    productTag: {
      type: String,
      enum: ["new", "old"],
      default: "old",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

booksSchema.index({ user: 1, createdAt: -1 });
booksSchema.index({ title: "text", ISBN: "text" });

const Book = mongoose.model("Book", booksSchema);

export default Book;
