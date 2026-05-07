import { Router } from "express";
import {
  createCompany,
  listCompanies,
  getCompany,
} from "../controllers/companyController.js";

const router = Router();

router.post("/", createCompany);
router.get("/", listCompanies);
router.get("/:id", getCompany);

export default router;
