import "dotenv/config";
import mongoose from "mongoose";
import Company from "./models/Company.js";
import Review from "./models/Review.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/review_rate";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Review.deleteMany({});
  await Company.deleteMany({});

  const c1 = await Company.create({
    name: "Graffersid Web and App Development",
    city: "Indore, Madhya Pradesh, India",
    location: "816, Shekhar Central, Manorama Ganj, AB road, New Palasia, Indore (M.P.)",
    foundedOn: new Date("2016-01-01"),
    description: "Web and mobile app development agency.",
    logoColor: "#1e3a5f",
  });
  const c2 = await Company.create({
    name: "Code Tech Company",
    city: "Indore, Madhya Pradesh, India",
    location: "414, Kanha Appartment, Bhawarkua, Indore (M.P.)",
    foundedOn: new Date("2016-01-01"),
    description: "Software and tech consulting.",
    logoColor: "#2e7d32",
  });
  const c3 = await Company.create({
    name: "Innogent Pvt. Ltd.",
    city: "Indore, Madhya Pradesh, India",
    location: "910, Shekhar Central, Manorama Ganj, AB road, New Palasia, Indore (M.P.)",
    foundedOn: new Date("2016-01-01"),
    description: "Innovation and product engineering.",
    logoColor: "#ed6c02",
  });

  await Review.insertMany([
    { company: c1._id, fullName: "A User", subject: "Great team", reviewText: "Professional delivery.", rating: 5, likes: 3 },
    { company: c1._id, fullName: "B User", subject: "Solid work", reviewText: "Good communication.", rating: 4, likes: 1 },
    { company: c2._id, fullName: "C User", subject: "Recommended", reviewText: "Nice experience.", rating: 5, likes: 2 },
    { company: c3._id, fullName: "D User", subject: "Quality", reviewText: "Happy with results.", rating: 4, likes: 0 },
  ]);

  console.log("Seed complete");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
