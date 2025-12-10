export function StudyFlow({
  className = "",
  size = "default",
}: {
  className?: string;
  size?: "small" | "default" | "large";
}) {
  const dimensions = {
    small: { width: 180, height: 40 },
    default: { width: 240, height: 50 },
    large: { width: 300, height: 60 },
  };

  const { width, height } = dimensions[size];
  const iconSize = Math.round(height * 0.9);
  const textSize =
    size === "small" ? "text-xl" : size === "large" ? "text-3xl" : "text-2xl";

  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{ width, height }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <rect
            x="4"
            y="8"
            width="24"
            height="16"
            rx="3"
            fill="#0891b2"
            stroke="#0891b2"
          />

          <circle cx="23" cy="10" r="1.5" fill="white" />
          <circle cx="23" cy="30" r="1.5" fill="white" />

          <path
            d="M12 15 Q17 13 22 15 Q27 17 32 15"
            stroke="#f59e0b"
            strokeWidth="1.5"
            fill="none"
          />
        </g>
      </svg>

      <span
        className={`${textSize} font-semibold text-gray-800`}
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        StudyFlow
      </span>
    </div>
  );
}
