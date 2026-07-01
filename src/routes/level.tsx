import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import levelsImg from "../levels.png";
import { LC } from "../lib/trail-data";

export const Route = createFileRoute("/level")({
  head: () => ({
    meta: [
      { title: "Your Trail Ahead — The Resilience Trail" },
      { name: "description", content: "Seven waypoints. Thirty-five stones. One honest look at how you're actually walking." },
    ],
  }),
  component: LevelPage,
});

function LevelPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      overflow: "hidden",
      background: "#ffffff",
      fontFamily: "'League Spartan', sans-serif",
    }}>
      {/* Full image — contain so nothing is cropped */}
      <img
        src={levelsImg}
        alt="The Resilience Trail"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
          display: "block",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(1.04)",
          transition: "opacity 1s ease, transform 1.4s cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* Bottom-right CTA — pinned over the image */}
      <div style={{
        position: "absolute",
        bottom: "2.5rem",
        right: "2.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.5rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s",
      }}>
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem("trail-ready", "1");
            navigate({ to: "/levelone" });
          }}
          style={{
            background: LC.darkGreen,
            color: LC.offWhite,
            border: "none",
            borderRadius: "9999px",
            padding: "0.9rem 2.5rem",
            fontSize: "0.88rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            cursor: "pointer",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
            transition: "background 0.2s, transform 0.15s",
            fontFamily: "'League Spartan', sans-serif",
            backdropFilter: "blur(4px)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#0a3d33";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = LC.darkGreen;
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          Begin the Trail →
        </button>
        <div style={{
          fontSize: "0.58rem",
          color: "rgba(255,255,255,0.65)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          textShadow: "0 1px 4px rgba(0,0,0,0.4)",
        }}>
          35 stones · ~10 minutes
        </div>
      </div>
    </div>
  );
}
