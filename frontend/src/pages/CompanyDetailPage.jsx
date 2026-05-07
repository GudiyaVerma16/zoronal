import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api.js";
import CompanyLogo from "../components/CompanyLogo.jsx";
import Stars from "../components/Stars.jsx";
import ReviewerAvatar from "../components/ReviewerAvatar.jsx";

function IconPin({ color = "var(--text-light)" }) {
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

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [sort, setSort] = useState("date");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddReview, setShowAddReview] = useState(false);
  const [fullName, setFullName] = useState("");
  const [subject, setSubject] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadCompany = useCallback(async () => {
    try {
      const c = await api.getCompany(id);
      setCompany(c);
    } catch (e) {
      setError(e.message);
      setCompany(null);
    }
  }, [id]);

  const loadReviews = useCallback(async () => {
    try {
      const r = await api.listReviews(id, { sort, order });
      setReviews(r.reviews || []);
      setAvgRating(r.avgRating ?? null);
      setReviewCount(r.reviewCount ?? 0);
    } catch (e) {
      setError(e.message);
    }
  }, [id, sort, order]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      await loadCompany();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadCompany]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  async function onAddReview(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      await api.createReview(id, {
        fullName,
        subject,
        reviewText,
        rating: Number(rating),
      });
      setFullName("");
      setSubject("");
      setReviewText("");
      setRating(5);
      setShowAddReview(false);
      await loadReviews();
      await loadCompany();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function onLike(reviewId) {
    try {
      await api.likeReview(id, reviewId);
      await loadReviews();
    } catch {
      /* ignore */
    }
  }

  async function onShare(reviewId) {
    const url = `${window.location.origin}/company/${id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* dismissed */
    }
    try {
      await api.shareReview(id, reviewId);
      await loadReviews();
    } catch {
      /* ignore */
    }
  }

  function formatDateTime(iso) {
    const dt = new Date(iso);
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = dt.getFullYear();
    const hh = String(dt.getHours()).padStart(2, "0");
    const mi = String(dt.getMinutes()).padStart(2, "0");
    return `${dd}-${mm}-${yyyy}, ${hh}:${mi}`;
  }

  function formatFounded(d) {
    if (!d) return "";
    const dt = new Date(d);
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = dt.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  if (loading && !company) {
    return (
      <div className="page-detail">
        <p className="loading-row">Loading…</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="page-detail narrow">
        <p className="error-banner">{error || "Company not found."}</p>
        <Link to="/">Back to listing</Link>
      </div>
    );
  }

  return (
    <div className="page-detail">
      <Link to="/" className="back-link">
        ← Back to companies
      </Link>

      <article className="detail-main-card card-panel">
        <div className="detail-profile-layout">
          <CompanyLogo company={company} size={72} />
          <div className="detail-profile-main">
            <h1 className="detail-title">{company.name}</h1>
            <p className="company-address large detail-address">
              <IconPin />
              <span>{company.location}</span>
            </p>
            <div className="detail-rating-summary">
              {avgRating != null ? (
                <>
                  <span className="rating-num large">{avgRating}</span>
                  <Stars rating={avgRating} size={22} />
                  <strong className="review-count-bold">
                    {reviewCount} Reviews
                  </strong>
                </>
              ) : (
                <>
                  <span className="rating-num large muted">—</span>
                  <Stars rating={0} size={22} />
                  <strong className="review-count-bold">
                    {reviewCount} Reviews
                  </strong>
                </>
              )}
            </div>
            {company.description ? (
              <p className="detail-desc">{company.description}</p>
            ) : null}
          </div>
          <div className="detail-profile-aside">
            <span className="meta-date aside-founded">
              Founded on {formatFounded(company.foundedOn)}
            </span>
            <button
              type="button"
              className="btn btn-gradient btn-add-review"
              onClick={() => setShowAddReview((v) => !v)}
              aria-expanded={showAddReview}
            >
              + Add Review
            </button>
          </div>
        </div>

        {showAddReview ? (
          <form className="review-form review-form-panel" onSubmit={onAddReview}>
            {formError ? (
              <p className="error-banner" role="alert">
                {formError}
              </p>
            ) : null}
            <div className="review-form-grid">
              <label className="field-label-block">
                <span className="field-label">Full name *</span>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </label>
              <label className="field-label-block">
                <span className="field-label">Subject *</span>
                <input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </label>
              <label className="field-label-block full">
                <span className="field-label">Review *</span>
                <textarea
                  required
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </label>
              <label className="field-label-block">
                <span className="field-label">Rating *</span>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stars
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="review-form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setShowAddReview(false);
                  setFormError("");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Posting…" : "Submit review"}
              </button>
            </div>
          </form>
        ) : null}

        <hr className="detail-divider" />

        <div className="reviews-toolbar-row">
          <p className="results-count detail-results-count">
            Result Found: {reviews.length}
          </p>
          <label className="field-label-inline review-sort-inline">
            Sort:
            <select
              value={`${sort}-${order}`}
              onChange={(e) => {
                const [s, o] = e.target.value.split("-");
                setSort(s);
                setOrder(o);
              }}
              className="select-sort select-sort-compact"
            >
              <option value="date-desc">Date (newest)</option>
              <option value="date-asc">Date (oldest)</option>
              <option value="rating-desc">Rating (high)</option>
              <option value="rating-asc">Rating (low)</option>
              <option value="relevance-desc">Relevance</option>
            </select>
          </label>
        </div>

        <ul className="review-list detail-review-list">
          {reviews.map((r) => (
            <li key={r._id} className="review-item review-item-figma">
              <ReviewerAvatar name={r.fullName} />
              <div className="review-item-body">
                <div className="review-name-stars-row">
                  <strong className="review-author">{r.fullName}</strong>
                  <Stars rating={r.rating} size={18} />
                </div>
                <time className="review-datetime" dateTime={r.createdAt}>
                  {formatDateTime(r.createdAt)}
                </time>
                <p className="review-subject">{r.subject}</p>
                <p className="review-body">{r.reviewText}</p>
                <div className="review-actions">
                  <button
                    type="button"
                    className="icon-action"
                    onClick={() => onLike(r._id)}
                    aria-label="Like this review"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M12 21s-6.7-4.35-9.33-8.06C.92 10.27 1.55 6.5 4.5 5.1c2.07-.97 4.5-.2 5.86 1.55l1.64 2.1 1.64-2.1c1.36-1.75 3.79-2.52 5.86-1.55 2.95 1.4 3.58 5.17 1.83 7.84C18.7 16.65 12 21 12 21z"
                      />
                    </svg>
                    <span>{r.likes ?? 0}</span>
                  </button>
                  <button
                    type="button"
                    className="icon-action"
                    onClick={() => onShare(r._id)}
                    aria-label="Share this review"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle cx="6" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="18" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="18" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.8" />
                      <path
                        d="M8 11l8-4M8 13l8 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{r.shares ?? 0}</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {reviews.length === 0 ? (
          <p className="empty-hint">
            No reviews yet. Add one with “+ Add Review”.
          </p>
        ) : null}
      </article>
    </div>
  );
}
