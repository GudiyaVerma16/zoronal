import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    fullName: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    reviewText: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    likes: { type: Number, default: 0, min: 0 },
    shares: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

reviewSchema.index({ company: 1, createdAt: -1 });
reviewSchema.index({ company: 1, rating: -1 });

export default mongoose.model("Review", reviewSchema);
