import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

export default function AddCompanyPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [foundedOn, setFoundedOn] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoColor, setLogoColor] = useState("#7b2cbf");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const created = await api.createCompany({
        name,
        city,
        location,
        foundedOn,
        description,
        logoUrl: logoUrl.trim() || undefined,
        logoColor,
      });
      navigate(`/company/${created._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-form narrow">
      <h1 className="page-title">Add Company</h1>
      <p className="page-sub">
        Enter accurate details — they appear on the listing and detail pages.
      </p>

      <form className="card-form" onSubmit={onSubmit}>
        {error ? (
          <p className="error-banner" role="alert">
            {error}
          </p>
        ) : null}

        <label className="field-label-block">
          <span className="field-label">Company name *</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Company legal name"
          />
        </label>

        <label className="field-label-block">
          <span className="field-label">City *</span>
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Indore, Madhya Pradesh, India"
          />
        </label>

        <label className="field-label-block">
          <span className="field-label">Full address / location *</span>
          <textarea
            required
            rows={3}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Street, area, city"
          />
        </label>

        <label className="field-label-block">
          <span className="field-label">Founded on *</span>
          <input
            required
            type="date"
            value={foundedOn}
            onChange={(e) => setFoundedOn(e.target.value)}
          />
        </label>

        <label className="field-label-block">
          <span className="field-label">Description</span>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description (optional)"
          />
        </label>

        <label className="field-label-block">
          <span className="field-label">Logo URL (optional)</span>
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://..."
          />
        </label>

        <label className="field-label-block">
          <span className="field-label">Logo tile color</span>
          <input
            type="color"
            value={logoColor}
            onChange={(e) => setLogoColor(e.target.value)}
          />
        </label>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Create company"}
          </button>
        </div>
      </form>
    </div>
  );
}
