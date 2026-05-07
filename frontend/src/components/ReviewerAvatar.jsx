function initials(name) {
  const parts = String(name || "")
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const hues = [268, 210, 165, 330, 200, 25];

function hueFromName(name) {
  let h = 0;
  for (let i = 0; i < String(name).length; i++)
    h += String(name).charCodeAt(i);
  return hues[h % hues.length];
}

export default function ReviewerAvatar({ name, size = 48 }) {
  const h = hueFromName(name);
  const bg = `linear-gradient(135deg, hsl(${h}, 55%, 52%), hsl(${(h + 40) % 360}, 50%, 42%))`;

  return (
    <div
      className="reviewer-avatar"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: size * 0.32,
        flexShrink: 0,
      }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
