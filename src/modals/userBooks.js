import mongoose from "mongoose";
import { BOOKS_READ_STATUS } from "../constants/enums.js";

const userBookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    status: {
        type: Number,
        enum: Object.values(BOOKS_READ_STATUS),
        default: BOOKS_READ_STATUS.UNREAD,
    }
}, {
    timestamps: true
})

userBookSchema.index({ user: 1, book: 1 }, { unique: true })

const UserBook = mongoose.model("UserBook", userBookSchema)

export default UserBook