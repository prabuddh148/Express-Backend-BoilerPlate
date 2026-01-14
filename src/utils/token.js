import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../config/jwtConfig.js";

export const generateAccessToken = (payload) => {
  // return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET_KEY, {
  //   expiresIn: "15m",
  // });
  return jwt.sign(payload, JWT_CONFIG.accessTokenSecretKey, {
    expiresIn: JWT_CONFIG.accessTokenExpiresIn,
  });
};

export const generateRefreshToken = async (payload) => {
  // return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
  //   expiresIn: "7d",
  // });
  const refreshToken = jwt.sign(payload, JWT_CONFIG.refreshTokenSecretKey, {
    expiresIn: JWT_CONFIG.refreshTokenExpiresIn,
  });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(refreshToken, salt);

  return { refreshToken, hashed };
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token,  JWT_CONFIG.accessTokenSecretKey);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_CONFIG.refreshTokenSecretKey);
};
