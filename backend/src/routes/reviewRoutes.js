import { Router } from "express";
import {
  listReviews,
  createReview,
  likeReview,
  shareReview,
} from "../controllers/reviewController.js";

const router = Router({ mergeParams: true });

router.get("/", listReviews);
router.post("/", createReview);
router.patch("/:id/like", likeReview);
router.patch("/:id/share", shareReview);

export default router;
