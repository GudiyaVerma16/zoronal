import mongoose from "mongoose";
import Review from "../models/Review.js";
import Company from "../models/Company.js";

export async function listReviews(req, res) {
  try {
    const { companyId } = req.params;
    const { sort = "date", order = "desc" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid company id" });
    }

    const company = await Company.findById(companyId).lean();
    if (!company) return res.status(404).json({ message: "Company not found" });

    const statsAgg = await Review.aggregate([
      { $match: { company: new mongoose.Types.ObjectId(companyId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);
    const avgRating =
      statsAgg[0]?.avgRating != null ? Math.round(statsAgg[0].avgRating * 10) / 10 : null;
    const reviewCount = statsAgg[0]?.count ?? 0;

    let query = Review.find({ company: companyId }).lean();

    if (sort === "rating") {
      query = query.sort({ rating: order === "asc" ? 1 : -1, createdAt: -1 });
    } else if (sort === "relevance") {
      query = query.sort({ likes: order === "asc" ? 1 : -1, createdAt: -1 });
    } else {
      query = query.sort({ createdAt: order === "asc" ? 1 : -1 });
    }

    const reviews = await query.exec();

    res.json({ reviews, avgRating, reviewCount });
  } catch (e) {
    res.status(500).json({ message: e.message || "Failed to list reviews" });
  }
}

export async function createReview(req, res) {
  try {
    const { companyId } = req.params;
    const { fullName, subject, reviewText, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid company id" });
    }

    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const review = await Review.create({
      company: companyId,
      fullName,
      subject,
      reviewText,
      rating: Number(rating),
    });

    const statsAgg = await Review.aggregate([
      { $match: { company: new mongoose.Types.ObjectId(companyId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(201).json({
      review,
      avgRating:
        statsAgg[0]?.avgRating != null ? Math.round(statsAgg[0].avgRating * 10) / 10 : null,
      reviewCount: statsAgg[0]?.count ?? 0,
    });
  } catch (e) {
    res.status(400).json({ message: e.message || "Failed to create review" });
  }
}

export async function likeReview(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review id" });
    }
    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    ).lean();
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (e) {
    res.status(500).json({ message: e.message || "Failed to like review" });
  }
}

export async function shareReview(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review id" });
    }
    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { shares: 1 } },
      { new: true }
    ).lean();
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (e) {
    res.status(500).json({ message: e.message || "Failed to record share" });
  }
}
