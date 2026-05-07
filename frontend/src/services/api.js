const base =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ?? "";

async function request(path, options = {}) {
  const url = `${base}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = data?.message || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data;
}

export const api = {
  health: () => request("/api/health"),

  listCompanies: (params = {}) => {
    const q = new URLSearchParams();
    if (params.q) q.set("q", params.q);
    if (params.city) q.set("city", params.city);
    if (params.sort) q.set("sort", params.sort);
    if (params.order) q.set("order", params.order);
    const qs = q.toString();
    return request(`/api/companies${qs ? `?${qs}` : ""}`);
  },

  getCompany: (id) => request(`/api/companies/${id}`),

  createCompany: (body) =>
    request("/api/companies", { method: "POST", body: JSON.stringify(body) }),

  listReviews: (companyId, params = {}) => {
    const q = new URLSearchParams();
    if (params.sort) q.set("sort", params.sort);
    if (params.order) q.set("order", params.order);
    const qs = q.toString();
    return request(
      `/api/companies/${companyId}/reviews${qs ? `?${qs}` : ""}`
    );
  },

  createReview: (companyId, body) =>
    request(`/api/companies/${companyId}/reviews`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  likeReview: (companyId, reviewId) =>
    request(`/api/companies/${companyId}/reviews/${reviewId}/like`, {
      method: "PATCH",
    }),

  shareReview: (companyId, reviewId) =>
    request(`/api/companies/${companyId}/reviews/${reviewId}/share`, {
      method: "PATCH",
    }),
};
