import React from "react";
import "./Avatar.css";

const normalizeAvatarUrl = (url) => {
  console.log("Received URL:", url);
  if (!url) return null;


  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${API_BASE_URL}/${url.replace(/^\/+/, "")}`;
};

function Avatar({ avatarUrl, name = "" }) {
  console.log("1. Initial avatarUrl:", avatarUrl);
  const normalizedUrl = normalizeAvatarUrl(avatarUrl);
  console.log("2. After normalization:", normalizedUrl);
  console.log("Avatar Debug:", {

    receivedUrl: avatarUrl,
    normalizedUrl: normalizedUrl,
    urlType: typeof avatarUrl,
    name: name,
  });

  const getInitials = (userName) => {
    if (!userName?.trim()) return "👤";
    return userName
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="avatar">
      {normalizedUrl ? (
        <img
          src={normalizedUrl}
          alt={`${name}'s avatar`}
          className="avatar__image"
          onError={(e) => {
            console.error("Failed to load avatar:", e.target.src); 
            e.target.onerror = null; 
            e.target.src = "https://shorturl.at/R5xe8"; 
          }}
        />
      ) : (
        <div className="avatar__placeholder">{getInitials(name)}</div>
      )}
    </div>
  );
}

export default Avatar;
