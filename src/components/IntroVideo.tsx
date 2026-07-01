import { useEffect, useRef } from "react";

interface IntroVideoProps {
  onEnded: () => void;
}

export function IntroVideo({ onEnded }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      onEnded();
    });
  }, [onEnded]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        src="/Intro.mp4"
        onEnded={onEnded}
        playsInline
        muted={false}
        aria-label="Game intro video"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      {/* Skip — subtle, bottom-right */}
      <button
        type="button"
        onClick={onEnded}
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          zIndex: 1,
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "rgba(255,255,255,0.6)",
          borderRadius: "9999px",
          padding: "0.4rem 1rem",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.95)";
          (e.target as HTMLButtonElement).style.background = "rgba(0,0,0,0.75)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)";
          (e.target as HTMLButtonElement).style.background = "rgba(0,0,0,0.5)";
        }}
      >
        Skip →
      </button>
    </div>
  );
}
