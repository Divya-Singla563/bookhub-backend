import mongoose from "mongoose";
import { FAQ_TEMPLATE_STATUS } from "../constants/enums.js";

const faqTemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // status: {
    //   type: Number,
    //   enum: [0, 1],
    //   default: 1,
    //   set: (val) => {
    //     if (val === "Active") return 1;
    //     if (val === "Inactive") return 0;
    //     return val;
    //   },
    // },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    // status: {
    //   type: Number,
    //   enum: Object.keys(FAQ_TEMPLATE_STATUS).map(Number),
    //   default: FAQ_TEMPLATE_STATUS[1],
    // },
  },
  { timestamps: true },
);

const FaqTemplate = mongoose.model("FaqTemplate", faqTemplateSchema);

export default FaqTemplate;
