import React, { useState, useEffect } from "react";
import { getAvatarUrl, getInitial } from "../../utils/avatar";

const Avatar = ({
  src,
  name = "",
  alt,
  className = "",
  style,
  icon: Icon = null,
  fallbackBg = "var(--color-primary)",
  fallbackColor = "#fff",
  fallbackSize = 14,
  fallbackWeight = 600,
  imgStyle,
}) => {
  const [errored, setErrored] = useState(false);
  const resolvedSrc = getAvatarUrl(src);

  useEffect(() => {
    setErrored(false);
  }, [resolvedSrc]);

  const showImage = !!resolvedSrc && !errored;
  const initial = getInitial(name);
  const fallback = initial || (Icon ? <Icon /> : null);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: showImage ? "transparent" : fallbackBg,
        color: fallbackColor,
        fontSize: fallbackSize,
        fontWeight: fallbackWeight,
        ...style,
      }}
    >
      {showImage ? (
        <img
          src={resolvedSrc}
          alt={alt || name || "Avatar"}
          style={{ width: "100%", height: "100%", objectFit: "cover", ...imgStyle }}
          onError={() => setErrored(true)}
        />
      ) : (
        fallback
      )}
    </div>
  );
};

export default Avatar;
