"use client";
import { useState } from "react";

export default function Hamburger({ size = 24, className = "" }) {
  const [open, setOpen] = useState(false);
  const strokeWidth = 2.4;
  const colorClass = "text-[#A435F0]";

  return (
    <button
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      className={`inline-flex items-center justify-center hover:bg-main-primary cursor-pointer ${colorClass} ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="block"
        aria-hidden="true"
      >
        {/* top line */}
        <path
          d="M3 6.5h18"
          style={{
            transformOrigin: "12px 12px",
            // transition: "transform 220ms ease, opacity 220ms ease",
            // transform: open ? "translateY(5px) rotate(45deg)" : "none",
          }}
        />
        {/* middle line */}
        <path
          d="M3 12h18"
          style={{
            transition: "opacity 180ms ease",
            // opacity: open ? 0 : 1,
            // transform: open ? "scaleX(0.8)" : "none",
          }}
        />
        {/* bottom line */}
        <path
          d="M3 17.5h18"
          style={{
            transformOrigin: "12px 12px",
            // transition: "transform 220ms ease",
            // transform: open ? "translateY(-5px) rotate(-45deg)" : "none",
          }}
        />
      </svg>
    </button>
  );
}
