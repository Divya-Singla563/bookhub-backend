import mongoose from "mongoose";
import * as Modals from "../modals/index.js";

const addBook = async (data, userId) => {
  try {
    if (data.ISBN) {
      console.log(data.ISBN, "----");

      const existingISBN = await Modals.Book.findOne({
        ISBN: data.ISBN,
        user: userId,
      }).lean();

      if (existingISBN) {
        throw new Error("Book already exists for this user with same ISBN");
      }
    }
    const book = await Modals.Book.create({
      ...data,
      user: userId,
    });

    return {
      message: "Book added successfully",
      data: book,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getUserBooks = async (userId, page, limit, search, status) => {
  try {
    const query = { user: userId };

    if (search) {
      query.$text = { $search: search };
    }

    if (status) {
      query.status = Number(status);
    }

    const books = await Modals.Book.find(query)
      .populate({ path: "user", select: "email name" })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const totalBooks = await Modals.Book.countDocuments(query);

    return {
      message: "Books fetched",
      data: books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    };
  } catch (error) {
    console.log(error);

    throw error;
  }
};

const getMyBookById = async (userId, bookId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new Error("Not a valid book ID");
    }

    const book = await Modals.Book.findOne({
      _id: bookId,
      user: userId,
    })
      .populate({ path: "user", select: "email name" })
      .lean();

    if (!book) {
      throw new Error("Book not found");
    }
    return {
      message: "fetched",
      data: book,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateMyBook = async (data, bookId, userId) => {
  try {
    const updatedBook = await Modals.Book.findOneAndUpdate(
      {
        _id: bookId,
        user: userId,
      },
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!updatedBook) {
      throw new Error("Book not found");
    }

    return {
      message: "Book updated successfully",
      data: updatedBook,
    };
  } catch (error) {
    throw error;
  }
};

const deleteBook = async (userId, bookId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new Error("Book id not valid");
    }
    const book = await Modals.Book.findById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }
    await Modals.Book.findOneAndDelete({
      _id: bookId,
      user: userId,
    }).lean();

    return { message: "Book deleted successfully" };
  } catch (error) {
    throw error;
  }
};

const updateBookStatus = async (data, bookId, userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new Error("Invalid book");
    }

    const updatedBook = await Modals.UserBook.findOneAndUpdate(
      {
        user: userId,
        book: bookId,
      },
      {
        $set: { status: data.status },
        $setOnInsert: { user: userId, book: bookId },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    )
      .populate({ path: "book", select: "title ISBN" })
      .populate({ path: "user", select: "email name" })
      .lean();

    return {
      message: "Book status updated successfully",
      data: updatedBook,
    };
  } catch (error) {
    throw error;
  }
};

// ✅ Service (Aggregation Pipeline)
const getAllBooks = async (page, limit, search) => {
  try {
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    const skip = (page - 1) * limit;



    const books = await Modals.Book.aggregate([
      { $sort: { createdAt: -1 } },

      { $skip: skip },
      { $limit: limit },
    ]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  addBook,
  getUserBooks,
  getMyBookById,
  updateMyBook,
  deleteBook,
  getAllBooks,
  updateBookStatus,
};
