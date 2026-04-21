import mongoose from "mongoose";
import { BOOKS_READ_STATUS } from "../constants/enums.js";

const booksSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    status: {
      type: Number,
      enum: Object.values(BOOKS_READ_STATUS),
      default: BOOKS_READ_STATUS.ACTIVE,
    },
  },
  { timestamps: true },
);

booksSchema.index({ user: 1, createdAt: -1 });
booksSchema.index({ title: "text", ISBN: "text" });

const Book = mongoose.model("Book", booksSchema);

export default Book;
