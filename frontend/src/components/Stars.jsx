import { useId } from "react";

export default function Stars({ rating = 0, size = 18 }) {
  const gid = useId().replace(/:/g, "");
  const items = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) items.push("full");
    else if (rating >= i - 0.5) items.push("half");
    else items.push("empty");
  }

  const s = { width: size, height: size };

  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: 2 }}
      aria-label={`${rating} out of 5 stars`}
    >
      {items.map((kind, i) =>
        kind === "full" ? (
          <svg key={i} viewBox="0 0 24 24" style={s} aria-hidden>
            <path
              fill="var(--star)"
              d="M12 2l3 7 7 .5-5 4 2 7-7-4-7 4 2-7-5-4 7-.5z"
            />
          </svg>
        ) : kind === "half" ? (
          <svg key={i} viewBox="0 0 24 24" style={s} aria-hidden>
            <defs>
              <linearGradient id={`half-${gid}-${i}`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="50%" stopColor="var(--star)" />
                <stop offset="50%" stopColor="#e0e0e0" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-${gid}-${i})`}
              d="M12 2l3 7 7 .5-5 4 2 7-7-4-7 4 2-7-5-4 7-.5z"
            />
          </svg>
        ) : (
          <svg key={i} viewBox="0 0 24 24" style={s} aria-hidden>
            <path
              fill="#e0e0e0"
              d="M12 2l3 7 7 .5-5 4 2 7-7-4-7 4 2-7-5-4 7-.5z"
            />
          </svg>
        )
      )}
    </span>
  );
}
