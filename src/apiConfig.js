export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("striveBlogToken");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

