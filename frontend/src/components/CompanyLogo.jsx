function initials(name) {
  const parts = String(name || "")
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function CompanyLogo({ company, size = 56 }) {
  const bg = company.logoColor || "#7b2cbf";
  if (company.logoUrl) {
    return (
      <img
        src={company.logoUrl}
        alt=""
        width={size}
        height={size}
        style={{
          borderRadius: 10,
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: bg,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.28,
        flexShrink: 0,
      }}
    >
      {initials(company.name)}
    </div>
  );
}
