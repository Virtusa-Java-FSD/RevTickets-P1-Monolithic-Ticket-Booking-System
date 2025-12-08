interface MoviePosterProps {
  title: string;
  rating: number | undefined;
  language: string | undefined;
  height?: number;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ title, rating, language, height = 170 }) => {
  // Generate consistent colors based on title
  const colors = [
    { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", text: "#fff" },
    { bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", text: "#fff" },
    { bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", text: "#fff" },
    { bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", text: "#000" },
    { bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", text: "#000" },
    { bg: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)", text: "#fff" },
  ];

  const colorIndex = title.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];

  return (
    <div
      className="movie-poster-container"
      style={{
        height: `${height}px`,
        background: color.bg,
        color: color.text,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        borderRadius: "0.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
          pointerEvents: "none",
        }}
      />

      {/* Movie Title */}
      <div
        style={{
          textAlign: "center",
          fontSize: "1rem",
          fontWeight: 700,
          lineHeight: 1.3,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          zIndex: 1,
          wordBreak: "break-word",
        }}
      >
        {title}
      </div>

      {/* Rating and Language Badge */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          zIndex: 1,
        }}
      >
        {rating && (
          <span
            style={{
              background: "rgba(255,255,255,0.9)",
              color: "#333",
              padding: "0.35rem 0.6rem",
              borderRadius: "0.25rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            ⭐ {rating}
          </span>
        )}
        {language && (
          <span
            style={{
              background: "rgba(0,0,0,0.3)",
              color: "inherit",
              padding: "0.35rem 0.6rem",
              borderRadius: "0.25rem",
              fontSize: "0.7rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            {language}
          </span>
        )}
      </div>
    </div>
  );
};

export default MoviePoster;
