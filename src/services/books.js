import mongoose from "mongoose";
import * as Modals from "../modals/index.js";
import { BOOKS_READ_STATUS } from "../constants/enums.js";

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
const getAllBooks = async (userId, page, limit, search) => {
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

      {
        $lookup: {
          from: "userbooks",
          let: { bookId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$book", "$$bookId"] },
                    { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                  ],
                },
              },
            },
          ],
          as: "userBook",
        },
      },

      // 4. Add status field
      {
        $addFields: {
          status: {
            $cond: {
              if: { $gt: [{ $size: "$userBook" }, 0] },
              then: { $arrayElemAt: ["$userBook.status", 0] },
              else: BOOKS_READ_STATUS.UNREAD,
            },
          },
        },
      },

      // 5. Clean extra field
      {
        $project: {
          userBook: 0,
        },
      },
    ]);

    return {
      message: "fetch",
      data: books,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getMyLibrary = async (userId) => {
  try {
    const data = await Modals.UserBook.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          status: {
            $in: [BOOKS_READ_STATUS.READ, BOOKS_READ_STATUS.READING],
          },
        },
      },
      {
        $sort: { updatedAt: -1 },
      },

      // 4. Join with Books
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookData",
        },
      },
      // 5. Convert array → object
      {
        $unwind: "$bookData",
      },

      // 6. Merge fields
      {
        $addFields: {
          title: "$bookData.title",
          description: "$bookData.description",
          price: "$bookData.price",
        },
      },

      // 7. Clean response
      {
        $project: {
          bookData: 0,
        },
      },
    ]);

    return {
      message: "Library fetched successfully",
      data,
    };
  } catch (error) {
    throw error;
  }
};

const toggleWishlist = async (userId, bookId) => {
  try {
    const existing = await Modals.Wishlist.findOne({
      user: userId,
      book: bookId,
    });

    // 2. If exists → remove
    if (existing) {
      await Modals.Wishlist.deleteOne({
        user: userId,
        book: bookId,
      });

      return {
        message: "Removed from wishlist",
        isWishlisted: false,
      };
    }

    // 3. If not exists → add
    await Modals.Wishlist.create({
      user: userId,
      book: bookId,
    });

    return {
      message: "Added to wishlist",
      isWishlisted: true,
    };
  } catch (error) {
    throw error;
  }
};

const getMyWishlist = async (userId) => {
  try {
    const data = await Modals.Wishlist.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookData",
        },
      },
      {
        $unwind: "$bookData",
      },
      {
        $addFields: {
          title: "$bookData.title",
        },
      },
      {
        $project: {
          bookData: 0,
        },
      },
    ]);

    const data1 = await Modals.Wishlist.find({ user: userId })
      .populate("book")
      .populate("user")
      .lean();

    console.log(data, "=======data");
    return {
      message: "fetched",
      data: data1,
    };
  } catch (error) {
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
  getMyLibrary,
  toggleWishlist,
  getMyWishlist,
};
