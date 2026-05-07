import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";
import { useSearchHeader } from "../contexts/SearchContext.jsx";
import CompanyLogo from "../components/CompanyLogo.jsx";
import Stars from "../components/Stars.jsx";

function IconPin({ color = "var(--purple)" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <circle cx="12" cy="9" r="2.5" fill={color} />
    </svg>
  );
}

function IconCalendar({ color = "#8f8f8f" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2.5" stroke={color} strokeWidth="2" />
      <path d="M8 3v4M16 3v4M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const { headerSearch, setHeaderSearch } = useSearchHeader();
  const [city, setCity] = useState("Indore, Madhya Pradesh, India");
  const [sort, setSort] = useState("name");
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addError, setAddError] = useState("");
  const [saving, setSaving] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [foundedOn, setFoundedOn] = useState("");
  const [companyCity, setCompanyCity] = useState("");

  const qParam = searchParams.get("q") || "";

  useEffect(() => {
    setHeaderSearch(qParam);
  }, [qParam, setHeaderSearch]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const sortField =
        sort === "name" ? "name" : sort === "rating" ? "rating" : "date";
      const order =
        sort === "date" ? "desc" : sort === "rating" ? "desc" : "asc";
      const res = await api.listCompanies({
        q: qParam || undefined,
        city: city.trim() || undefined,
        sort: sortField,
        order,
      });
      setCompanies(res.companies || []);
      setTotal(res.total ?? 0);
    } catch (e) {
      setError(e.message);
      setCompanies([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [qParam, city, sort]);

  useEffect(() => {
    load();
  }, [load]);

  function findCompany(e) {
    e.preventDefault();
    load();
  }

  function formatFounded(d) {
    if (!d) return "";
    const dt = new Date(d);
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = dt.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  const displayRating = (c) =>
    c.avgRating != null ? c.avgRating : null;

  useEffect(() => {
    if (!showAddModal) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShowAddModal(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showAddModal]);

  async function onAddCompany(e) {
    e.preventDefault();
    setAddError("");
    setSaving(true);
    try {
      await api.createCompany({
        name: companyName.trim(),
        location: companyLocation.trim(),
        foundedOn,
        city: companyCity.trim(),
      });
      setCompanyName("");
      setCompanyLocation("");
      setFoundedOn("");
      setCompanyCity("");
      setShowAddModal(false);
      await load();
    } catch (err) {
      setAddError(err.message || "Failed to create company");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-home">
      <section className="toolbar">
        <div className="toolbar-grid">
          <label className="field-label-block">
            <span className="field-label">Select City</span>
            <div className="input-with-icon">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City, region"
              />
              <span className="input-icon-end">
                <IconPin />
              </span>
            </div>
          </label>

          <button type="button" className="btn btn-primary" onClick={findCompany}>
            Find Company
          </button>

          <button
            type="button"
            className="btn btn-gradient"
            onClick={() => {
              setAddError("");
              setShowAddModal(true);
            }}
          >
            <span className="btn-plus">+</span>
            Add Company
          </button>

          <label className="field-label-block sort-field">
            <span className="field-label">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select-sort"
            >
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="date">Date</option>
            </select>
          </label>
        </div>
      </section>

      <div className="divider-line" />

      <section className="results-section">
        <p className="results-count">
          Result Found: {loading ? "…" : total}
        </p>

        {error ? (
          <p className="error-banner" role="alert">
            {error}
          </p>
        ) : null}

        <ul className="company-list">
          {loading ? (
            <li className="loading-row">Loading companies…</li>
          ) : (
            companies.map((c) => (
              <li key={c._id} className="company-card">
                <CompanyLogo company={c} />
                <div className="company-card-body">
                  <h2 className="company-name">{c.name}</h2>
                  <p className="company-address">
                    <IconPin color="var(--text-light)" />
                    <span>{c.location}</span>
                  </p>
                  {c.description ? (
                    <p className="company-desc-snippet">{c.description}</p>
                  ) : null}
                  <div className="company-rating-row">
                    {displayRating(c) != null ? (
                      <>
                        <span className="rating-num">{displayRating(c)}</span>
                        <Stars rating={displayRating(c)} size={16} />
                        <span className="review-num">
                          {c.reviewCount ?? 0} Reviews
                        </span>
                      </>
                    ) : (
                      <span className="review-num muted">No reviews yet</span>
                    )}
                  </div>
                </div>
                <div className="company-card-aside">
                  <span className="meta-date">
                    Founded on {formatFounded(c.foundedOn)}
                  </span>
                  <Link
                    to={`/company/${c._id}`}
                    className="btn btn-detail"
                  >
                    Detail Review
                  </Link>
                </div>
              </li>
            ))
          )}
        </ul>

        {!loading && companies.length === 0 && !error ? (
          <p className="empty-hint">No companies match your filters.</p>
        ) : null}
      </section>

      {showAddModal ? (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Add Company"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div className="add-company-modal">
            <span className="modal-decor-large" aria-hidden />
            <span className="modal-decor-small" aria-hidden />
            <button
              type="button"
              className="modal-close-btn"
              aria-label="Close add company modal"
              onClick={() => setShowAddModal(false)}
            >
              ×
            </button>

            <h2 className="add-company-modal-title">Add Company</h2>

            <form className="add-company-modal-form" onSubmit={onAddCompany}>
              {addError ? (
                <p className="error-banner" role="alert">
                  {addError}
                </p>
              ) : null}

              <label className="field-label-block">
                <span className="field-label modal-label">Company name</span>
                <input
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter..."
                />
              </label>

              <label className="field-label-block">
                <span className="field-label modal-label">Location</span>
                <div className="input-with-icon">
                  <input
                    required
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    placeholder="Select Location"
                  />
                  <span className="input-icon-end">
                    <IconPin color="#8f8f8f" />
                  </span>
                </div>
              </label>

              <label className="field-label-block">
                <span className="field-label modal-label">Founded on</span>
                <div className="input-with-icon">
                  <input
                    required
                    type="date"
                    value={foundedOn}
                    onChange={(e) => setFoundedOn(e.target.value)}
                  />
                  <span className="input-icon-end">
                    <IconCalendar />
                  </span>
                </div>
              </label>

              <label className="field-label-block">
                <span className="field-label modal-label">City</span>
                <input
                  required
                  value={companyCity}
                  onChange={(e) => setCompanyCity(e.target.value)}
                  placeholder="Enter city"
                />
              </label>

              <button type="submit" className="btn btn-gradient modal-save-btn" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
