// middlewares/auth.middleware.js

import jwt from "jsonwebtoken";
import sanitizeHtml from "sanitize-html";
import { JWT_CONFIG } from "../config/jwtConfig.js";
import { ApiResponseHelper } from "../helpers/apiResponseHelper.js";


export const optionalAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    const token = authHeader.split(" ")[1];

    /*
        * To verify that the given access token is not tampered with.
        * We can also perform further validations such as:
        * - Finding the current user
        * - Applying additional security checks
        * - Handling safety-related validations
    */

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        { ignoreExpiration: true }, // ✅ key line
        (err, decoded) => {
            if (!err) {
                req.user = decoded;
            }
            next(); // ✅ NEVER block
        }
    );
};