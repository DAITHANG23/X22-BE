import jwt from "jsonwebtoken";

const createAccessToken = (document) => {
  const payload = {
    id: document._id,
    role: document.role,
  };
  const newToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  // Save the token to HttpOnly cookie
  // Make sure to set the 'secure' option to true in a production environment if using HTTPS
  document.cookie = `token=${newToken}; path=/; HttpOnly; SameSite=Strict;`;

  return newToken;
};
const verifyToken = (token) => {
  try {
    const checkToken = jwt.verify(token, process.env.JWT_SECRET);
    return checkToken;
  } catch (error) {
    // Handle token verification errors
    console.error("Token verification failed:", error.message);
    return null;
  }
};
const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error("Token decoding failed:", error.message);
    return null;
  }
};

export { createAccessToken, verifyToken, decodeToken };
