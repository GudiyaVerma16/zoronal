import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    foundedOn: { type: Date, required: true },
    description: { type: String, default: "", trim: true },
    logoUrl: { type: String, default: "" },
    logoColor: { type: String, default: "#7B2CBF" },
  },
  { timestamps: true }
);

companySchema.index({ name: "text", city: "text", location: "text", description: "text" });

export default mongoose.model("Company", companySchema);
