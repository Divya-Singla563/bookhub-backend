import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FaqTemplate",
    },
  },
  { timestamps: true },
);

const Faq = mongoose.model("faq", faqSchema);

export default Faq;
