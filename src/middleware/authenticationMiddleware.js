// middlewares/auth.middleware.js

import jwt from "jsonwebtoken";
import sanitizeHtml from "sanitize-html";
import { JWT_CONFIG } from "../config/jwtConfig.js";
import { ApiResponseHelper } from "../helpers/apiResponseHelper.js";
import { UserLoginDetail } from "../modules/core/associations/associations.js";
export const authenticate = async (req, res, next) => {
    const apiPurpose = "Authentication Middleware"
    try {
        let authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization header missing"
            });
        }

        // Sanitize and extract token
        authHeader = sanitizeHtml(authHeader.trim());
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        if (!token) {

            return ApiResponseHelper.unauthorized(
                res,
                "Token not provided",
                apiPurpose
            );
        }

        const validUser = await User.findOne({
            include: [
                {
                    model: UserLoginDetail,
                    attributes: [],
                    as: "userLoginDetails",
                    required: true,
                },
            ],
            where: {
                id: decoded.user_id,
            },
        });


        if (!validUser) {
            return ApiResponseHelper.unauthorized(
                {
                    res,
                    message: "Invalid or expired session",
                    statusCode: API_RESPONSE_STATUS_CODES.UNAUTHORIZED,
                    apiPurpose
                }
            );
        }


        // Verify token        
        const decoded = jwt.verify(token, JWT_CONFIG.accessTokenSecretKey);

        // Attach credentials to the request
        req.credentials = {
            ...decoded
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
            error: error.message
        });
    }
};
