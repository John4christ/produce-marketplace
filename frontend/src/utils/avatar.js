const getApiOrigin = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
  return baseUrl.replace(/\/+$/, "").replace(/\/api\/?$/, "");
};

export const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (/^(https?:|data:|blob:)/i.test(avatar)) return avatar;
  const origin = getApiOrigin();
  if (avatar.startsWith("/")) return `${origin}${avatar}`;
  return `${origin}/storage/${avatar}`;
};

export const getInitial = (name) => {
  if (!name) return null;
  const first = name.trim().charAt(0);
  return first ? first.toUpperCase() : null;
};
