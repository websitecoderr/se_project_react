import React from "react";
import "./Avatar.css";
import avatarDefault from "../../assets/avatar.svg";
import { BASE_URL as API_BASE_URL } from "../../utils/constants"; 

const isValidImageUrl = (url) => {
  return url?.startsWith("http://") || url?.startsWith("https://");
};

const normalizeAvatarUrl = (url) => {
  console.log("Received URL:", url);

  if (!url || typeof url !== "string" || url.trim() === "") {
    console.warn("Invalid avatar URL, using default.");
    return avatarDefault;
  }

  if (url.startsWith("https://res.cloudinary.com") && url.includes("/image/upload/")) {
    console.log("Valid Cloudinary URL detected:", url);
    return url;
  }

  if (isValidImageUrl(url)) {
    return url;
  }

  console.warn("Local avatar detected, using API base URL.");
  return `${API_BASE_URL}/${url.replace(/^\/+/, "")}`;
};

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

function Avatar({ avatarUrl, name = "" }) {
  console.log("1. Initial avatarUrl:", avatarUrl);
  const normalizedUrl = normalizeAvatarUrl(avatarUrl);
  console.log("2. After normalization:", normalizedUrl);
  console.log("Avatar Debug:", {
    receivedUrl: avatarUrl,
    normalizedUrl,
    urlType: typeof avatarUrl,
    name,
  });

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
            e.target.src = avatarDefault;
          }}
        />
      ) : (
        <div className="avatar__placeholder">{getInitials(name)}</div>
      )}
    </div>
  );
}

export default Avatar;
