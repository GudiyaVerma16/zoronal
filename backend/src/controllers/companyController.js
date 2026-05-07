import Company from "../models/Company.js";
import Review from "../models/Review.js";

export async function createCompany(req, res) {
  try {
    const { name, city, location, foundedOn, description, logoUrl, logoColor } = req.body;
    const company = await Company.create({
      name,
      city,
      location,
      foundedOn: foundedOn ? new Date(foundedOn) : undefined,
      description: description ?? "",
      logoUrl: logoUrl ?? "",
      logoColor: logoColor ?? "#7B2CBF",
    });
    res.status(201).json(company);
  } catch (e) {
    res.status(400).json({ message: e.message || "Failed to create company" });
  }
}

export async function listCompanies(req, res) {
  try {
    const {
      q,
      city,
      sort = "name",
      order = "asc",
    } = req.query;

    const filter = {};
    if (city && String(city).trim()) {
      filter.city = new RegExp(String(city).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    }
    if (q && String(q).trim()) {
      const term = String(q).trim();
      filter.$or = [
        { name: new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
        { location: new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
        { description: new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
      ];
    }

    const sortField =
      sort === "rating"
        ? "avgRating"
        : sort === "date"
          ? "createdAt"
          : "name";
    const direction = order === "desc" ? -1 : 1;

    let companies = await Company.find(filter).lean();

    const ids = companies.map((c) => c._id);
    const agg = await Review.aggregate([
      { $match: { company: { $in: ids } } },
      {
        $group: {
          _id: "$company",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);
    const statsMap = Object.fromEntries(
      agg.map((s) => [String(s._id), { avgRating: s.avgRating, count: s.count }])
    );

    companies = companies.map((c) => {
      const s = statsMap[String(c._id)] || { avgRating: null, count: 0 };
      return {
        ...c,
        avgRating: s.avgRating != null ? Math.round(s.avgRating * 10) / 10 : null,
        reviewCount: s.count,
      };
    });

    if (sort === "rating") {
      companies.sort((a, b) => {
        const av = a.avgRating ?? 0;
        const bv = b.avgRating ?? 0;
        return direction === 1 ? av - bv : bv - av;
      });
    } else if (sort === "date") {
      companies.sort((a, b) => {
        const ad = new Date(a.createdAt).getTime();
        const bd = new Date(b.createdAt).getTime();
        return direction === 1 ? ad - bd : bd - ad;
      });
    } else {
      companies.sort((a, b) => {
        const cmp = String(a.name).localeCompare(String(b.name), undefined, {
          sensitivity: "base",
        });
        return direction === 1 ? cmp : -cmp;
      });
    }

    res.json({ companies, total: companies.length });
  } catch (e) {
    res.status(500).json({ message: e.message || "Failed to list companies" });
  }
}

export async function getCompany(req, res) {
  try {
    const company = await Company.findById(req.params.id).lean();
    if (!company) return res.status(404).json({ message: "Company not found" });

    const stats = await Review.aggregate([
      { $match: { company: company._id } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);
    const avgRating =
      stats[0]?.avgRating != null ? Math.round(stats[0].avgRating * 10) / 10 : null;

    res.json({
      ...company,
      avgRating,
      reviewCount: stats[0]?.count ?? 0,
    });
  } catch (e) {
    res.status(500).json({ message: e.message || "Failed to load company" });
  }
}
