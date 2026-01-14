import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_CONFIG } from "../config/jwtConfig.js";



const TokenHelper = {

  createAccessToken: (payload) => {
    return jwt.sign(payload, JWT_CONFIG.accessTokenSecretKey, {
      expiresIn: JWT_CONFIG.accessTokenExpiresIn,
    });
  },

  createRefreshToken: async (payload) => {
    const token = jwt.sign(payload, JWT_CONFIG.refreshTokenSecretKey, {
      expiresIn: JWT_CONFIG.refreshTokenExpiresIn,
    });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(token, salt);

    return { token, hashed };
  },

  verifyRefreshTokenRaw: (token) => {
    try {
      return jwt.verify(token, JWT_CONFIG.refreshTokenSecretKey);
    } catch {
      return null;
    }
  },


};

export default TokenHelper;
