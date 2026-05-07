import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import companyRoutes from "./routes/companyRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/review_rate";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.use("/api/companies", companyRoutes);
app.use("/api/companies/:companyId/reviews", reviewRoutes);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
