import bcrypt from "bcrypt";
import { OTP_TYPES, USER_ROLES } from "../../constants/constants.js";
import crypto from "crypto";
import Users from "../users/userModel.js";
import OtpType from "../core/otpTypeModel.js";
import UserOtpDetail from "../core/userOtpDetails.js";
import EmailHelper from "../../helpers/emailHelper.js";
import sanitizeHtml from "sanitize-html";
import dotenv from "dotenv";
import { OtpHelper } from "../../helpers/otpHelper.js";

import sequelize from "../../config/dbConfig.js";
import UserLoginDetail from "../core/userLoginDetail.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token.js";
import { API_RESPONSE_STATUS_CODES } from "../../utils/apiRsponseStatusCodes.js";
import { successResponse } from "../../utils/apiResponseMapper.js";
dotenv.config();

export default {

  register: async ({ name, email, phone, password, is_active = false, is_verified = false }) => {
    const apiPurpose = "Register user API !"
    const transaction = await sequelize.transaction();
    try {

      // Sanitize all inputs
      name = sanitizeHtml(name);
      email = sanitizeHtml(email);
      phone = sanitizeHtml(phone);
      password = sanitizeHtml(password);

      // Step 1 →  Check duplicates
      const existingUser = await Users.findOne({
        where: { email, deleted_at: null },
        transaction,
      });

      ////Step 3 →  ONLY IF THE USER IS ALREDY VERIFIED
      if (existingUser && existingUser.is_verified) {
        await transaction.rollback();
        return errorResponse({ message: "Email already registered", statusCode: API_RESPONSE_STATUS_CODES.CONFLICT, apiPurpose: apiPurpose })
      }

      // Step 4 → Generate & Hash OTP
      const otp = OtpHelper.generateOtp(4) // generateOtp ();
      const hashedOtp = await OtpHelper.hashOtp(otp);

      // Step 5 → Get OTP type ID
      const otpType = await OtpType.findOne({
        where: { otp_type: OTP_TYPES.REGISTER },
        transaction,
      });


      ////Step 6 → IF USER IS REGISTERED BUT NOT VERIFIED THEN SEND OTP ON EMAIL
      if (existingUser && !existingUser.is_verified) {

        await UserOtpDetail.update(
          {
            otp_hash: hashedOtp,
            expires_at: new Date(Date.now() + process.env.OTP_EXPIRY_MINUTES * 60 * 1000),

          },
          {
            where: { user_id: existingUser.id, otp_type_id: otpType.id },
            transaction,
          }
        );

        ////Step 6.1 → Commit Db Changes
        await transaction.commit();

        //// Step 6.2 → Send OTP Email
        await EmailHelper.sendOtpMail(email, otp);

        return successResponse({ message: "User already registered, Otp sent on registered email, please verify !", statusCode: API_RESPONSE_STATUS_CODES.OK, apiPurpose: apiPurpose })
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Step 7 → Create user (unverified)
      const user = await Users.create(
        {
          name,
          email,
          phone,
          password_hash: hashedPassword,
          is_verified,
          is_active,
          role_id: USER_ROLES.BIDDER
        },
        { transaction }
      );

      // Step 8 → Save OTP
      await UserOtpDetail.create(
        {
          user_id: user.id,
          otp_type_id: otpType?.id,
          otp_hash: hashedOtp,
          // otp: otp,
          expires_at: new Date(Date.now() + process.env.OTP_EXPIRY_MINUTES * 60 * 1000), // 10 min
        },
        { transaction }
      );

      // Step 9 → Commit BEFORE sending email 
      // (email is external service → should NOT block DB commit)
      await transaction.commit();

      // Step 10 → Send OTP Email
      await EmailHelper.sendOtpMail(email, otp);
      return successResponse({ message: "Successfully Registered", statusCode: API_RESPONSE_STATUS_CODES.CREATED, apiPurpose: apiPurpose })
    } catch (error) {
      await transaction.rollback();
      return errorResponse({ message: "Internal server error", statusCode: API_RESPONSE_STATUS_CODES.SERVER_ERROR, apiPurpose: apiPurpose, error: error.message })

    }



  },

  login: async ({ email, password }) => {

    const apiPurpose = "Login API !"
    try {

      const options = {
        where: { email, is_active: true, is_verified: true },
        attributes: { exclude: ["created_at", "updated_at", "deleted_at"] }
      }
      const user = await Users.findOne(options);

      if (!user) return { success: false, message: "Invalid email or password" };

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return errorResponse({ message: "Invalid email or password", statusCode: API_RESPONSE_STATUS_CODES.BAD_REQUEST, apiPurpose: apiPurpose })
      }

      ////CREATING ACCESS TOKEN
      const tokenPayload = { user_id: user.id, role_id: user.role_id, email: user.email, user_uuid: user.user_uuid }
      const token = generateAccessToken(tokenPayload)

      const { refreshToken, hashed } = await generateRefreshToken(tokenPayload)

      const userData = {
        user_uuid: user.user_uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role_id: user.role_id,
        is_active: user.is_active,
        is_verified: user.is_verified,
      }

      const userLoginDetailsData = {
        user_id: user.id,
        refresh_token: hashed
      }

      await UserLoginDetail.create(userLoginDetailsData)

      const userLoginData = {
        access_token: token, refresh_token: refreshToken, user_data: userData
      }
      return successResponse({ message: "Login successful", data: userLoginData, statusCode: API_RESPONSE_STATUS_CODES.OK, apiPurpose: apiPurpose })

    } catch (error) {
      return errorResponse({ message: "Internal server error", statusCode: API_RESPONSE_STATUS_CODES.SERVER_ERROR, apiPurpose: apiPurpose, error: error.message })
    }

  },

  verifyOtp: async ({ email, otp, otpType = "REGISTER" }) => {
    const apiPurpose = "Verify Otp API !"
    const transaction = await sequelize.transaction();
    try {
      email = sanitizeHtml(email);
      otp = sanitizeHtml(otp);
      otpType = sanitizeHtml(otpType)
      const user = await Users.findOne({ where: { email, deleted_at: null }, transaction });
      if (!user) {
        await transaction.rollback();
        return errorResponse({ message: "User details not found !", statusCode: API_RESPONSE_STATUS_CODES.NOT_FOUND, apiPurpose: apiPurpose })
      }

      const otpDetailsOptions = {
        where: { user_id: user.id },
        include: [
          {
            model: OtpType,
            attributes: [],
            required: true,
            where: {
              otp_type: otpType
            }
          }
        ],
        transaction,
      }

      // const hashedOtp = await OtpHelper.hashOtp(otp)

      const otpRecord = await UserOtpDetail.findOne(otpDetailsOptions);

      // console.log("otpRecord-----",otpRecord);

      if (!otpRecord) {
        await transaction.rollback();
        return { success: false, message: "Invalid OTP!" }
      }

      const isValid = await OtpHelper.verifyOtp(otp, otpRecord.otp_hash);

      if (!isValid) {
        await transaction.rollback();
        return errorResponse({ message: "Invalid OTP!", statusCode: API_RESPONSE_STATUS_CODES.BAD_REQUEST, apiPurpose: apiPurpose })
      }


      // ✅ Compare directly using stored expires_at in UTC
      const nowUTC = new Date();
      const expiresAtUTC = new Date(otpRecord.expires_at);

      if (nowUTC > expiresAtUTC) {
        await transaction.rollback();
        return errorResponse({ message: "OTP expired!", statusCode: API_RESPONSE_STATUS_CODES.BAD_REQUEST, apiPurpose: apiPurpose })
      }



      // ✅ Mark user as verified
      await Users.update(
        {
          is_verified: true,
          is_active: true,
        },
        { where: { id: user.id }, transaction }
      );

      // const access_token = jwt.sign(
      //   {
      //     _id: user.user_hash,
      //     roleId: user.role_id,
      //     userId: user.user_id,
      //   },
      //   process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      //   { expiresIn: "5m" }
      // );

      await transaction.commit();
      return successResponse({ message: "Otp successfully verified", statusCode: API_RESPONSE_STATUS_CODES.OK, apiPurpose: apiPurpose })
    } catch (error) {
      await transaction.rollback();
      return errorResponse({ message: "Internal server error", statusCode: API_RESPONSE_STATUS_CODES.SERVER_ERROR, apiPurpose: apiPurpose, error: error.message })
    }

  },

  resendOtp: async ({ email, otpType = "REGISTER" }) => {
    const apiPurpose = "Resend Otp API !"
    const transaction = await sequelize.transaction();
    try {

      email = sanitizeHtml(email);
      otpType = sanitizeHtml(otpType)

      //// Step 1 → Getting user details
      const user = await Users.findOne({ where: { email, deleted_at: null }, transaction });

      if (!user) {
        await transaction.rollback();
        return errorResponse({ message: "User details not found !", statusCode: API_RESPONSE_STATUS_CODES.NOT_FOUND, apiPurpose: apiPurpose })
      }

      // Step 2 → Generate & Hash OTP
      const otp = OtpHelper.generateOtp(4) // generateOtp ();
      const hashedOtp = await OtpHelper.hashOtp(otp);

      const otpDetailsOptions = {
        where: { user_id: user.id },
        include: [
          {
            model: OtpType,
            attributes: [],
            required: true,
            where: {
              otp_type: otpType
            }
          }
        ],
        transaction,
      }


      // Step 3 → Getting & Updating Hash OTP
      const existingUserOtpDetails = await UserOtpDetail.findOne(otpDetailsOptions)

      await UserOtpDetail.update(
        {
          otp_hash: hashedOtp,
          expires_at: new Date(Date.now() + process.env.OTP_EXPIRY_MINUTES * 60 * 1000),

        },
        {
          where: { id: existingUserOtpDetails.id, user_id: user.id, otp_type_id: existingUserOtpDetails.otp_type_id },
          transaction,
        }
      );

      await transaction.commit();

      // Step 4 → Sending OTP on email
      await EmailHelper.sendOtpMail(email, otp);
      return successResponse({ message: "Otp successfully sent", statusCode: API_RESPONSE_STATUS_CODES.OK, apiPurpose: apiPurpose })
    } catch (error) {
      await transaction.rollback();
      return errorResponse({ message: "Internal server error", statusCode: API_RESPONSE_STATUS_CODES.SERVER_ERROR, apiPurpose: apiPurpose, error: error.message })
    }


  },

  logout: async (user_id) => {
    const apiPurpose = "Logout API !"
    try {
      const tokenData = await UserLoginDetail.findOne({
        where: {
          user_id: user_id,
        },
      });

      if (!tokenData) {
        return errorResponse({ message: "Access token not found !", statusCode: API_RESPONSE_STATUS_CODES.BAD_REQUEST, apiPurpose: apiPurpose })
      }

      await tokenData.destroy();
      return successResponse({ message: "Successfully loggedout !", statusCode: API_RESPONSE_STATUS_CODES.OK, apiPurpose: apiPurpose })
    } catch (error) {
      return errorResponse({ message: "Internal server error", statusCode: API_RESPONSE_STATUS_CODES.SERVER_ERROR, apiPurpose: apiPurpose, error: error.message })
    }


  },

  refreshToken: async (req) => {
    const apiPurpose = "Refresh Toke API !"
    const transaction = await sequelize.transaction();

    try {
      let { refresh_token } = req.body;
      refresh_token = sanitizeHtml(refresh_token);

      if (!refresh_token) {
        await transaction.rollback();
        return errorResponse({ message: "Refresh token is required  !", statusCode: API_RESPONSE_STATUS_CODES.BAD_REQUEST, apiPurpose: apiPurpose })
      }

      // Step 1: Parse & verify the refresh token
      const decoded = verifyRefreshToken(refresh_token)

      const tokenPayload = { user_id: decoded.user_id, role_id: decoded.role_id, email: decoded.email, user_uuid: decoded.user_uuid }

      if (!decoded) {
        await transaction.rollback();
        return errorResponse({ message: "Invalid refresh token !", statusCode: API_RESPONSE_STATUS_CODES.BAD_REQUEST, apiPurpose: apiPurpose })
      }

      // Step 2: Find saved hashed refresh token in DB
      const savedToken = await UserLoginDetail.findOne({
        where: {
          user_id: decoded?.user_id,
        },
        transaction,
      });

      if (!savedToken) {
        await transaction.rollback();
        return errorResponse({ message: "Session expired! Please login again.", statusCode: API_RESPONSE_STATUS_CODES.UNAUTHORIZED, apiPurpose: apiPurpose })
      }

      const isMatch = await bcrypt.compare(refresh_token, savedToken.refresh_token)

      if (!isMatch) {
        await transaction.rollback();
        return errorResponse({ message: "Refresh token mismatched !", statusCode: API_RESPONSE_STATUS_CODES.UNAUTHORIZED, apiPurpose: apiPurpose })
      }


      const newAccessToken = generateAccessToken(tokenPayload)
      const { refreshToken, hashed } = await generateRefreshToken(tokenPayload)

      await UserLoginDetail.update({ refresh_token: hashed },
        {
          where: { id: savedToken?.id },
          transaction,
        }
      );

      const newTokenDetails = {
        access_token: newAccessToken,
        refresh_token: refreshToken
      }
      await transaction.commit();
      return successResponse({ message: "Refresh token successfully generated !", data: newTokenDetails, statusCode: API_RESPONSE_STATUS_CODES.OK, apiPurpose: apiPurpose })

    } catch (error) {
      await transaction.rollback();
      return errorResponse({ message: "Internal server error !", statusCode: API_RESPONSE_STATUS_CODES.SERVER_ERROR, apiPurpose: apiPurpose, error: error.message })
    }
  },

  forgotPassword: async (req) => {
    const apiPurpose = "Forgot Password API !"

    try {
      const { email } = req.body;

      if (!email) {
        return errorResponse({ message: "Email is required  !", statusCode: API_RESPONSE_STATUS_CODES.BAD_REQUEST, apiPurpose: apiPurpose })
      }

      const user = await User.findOne({ where: { email } });


      if (!user) {
        return errorResponse({ message: "User not found !", statusCode: API_RESPONSE_STATUS_CODES.NOT_FOUND, apiPurpose: apiPurpose })
      }

      /* ---------------------------------------------------
       * Generate secure reset token
       * -------------------------------------------------- */
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      user.reset_password_token = hashedToken;
      user.reset_password_expires = new Date(
        Date.now() + process.env.RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000
      );

      await user.save();

      /* ---------------------------------------------------
       * Send email
       * -------------------------------------------------- */
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

      await EmailHelper.sendResetPasswordMail(user.name, email, resetUrl);

      return successResponse({ message: "Password reset link sent !", statusCode: API_RESPONSE_STATUS_CODES.OK, apiPurpose: apiPurpose })
    } catch (err) {
      return errorResponse({ message: "Internal server error !", statusCode: API_RESPONSE_STATUS_CODES.SERVER_ERROR, apiPurpose: apiPurpose, error: error.message })
    }
  },


  resetPassword: async (req) => {
    const apiPurpose = "Reset Password API !"
    try {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
      return errorResponse({ message: "Token and new password are required !", statusCode: API_RESPONSE_STATUS_CODES.BAD_REQUEST, apiPurpose: apiPurpose })
    }

    if (!isStrongPassword(new_password)) {
      return errorResponse({ message: "Password must be at least 8 characters and include uppercase, lowercase, number and special character !", statusCode: API_RESPONSE_STATUS_CODES.BAD_REQUEST, apiPurpose: apiPurpose })
    }

    /* ---------------------------------------------------
     * Hash incoming token
     * -------------------------------------------------- */
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    /* ---------------------------------------------------
     * Find valid user
     * -------------------------------------------------- */
    const user = await User.findOne({
      where: {
        reset_password_token: hashedToken,
        reset_password_expires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return errorResponse({ message: "Invalid or expired token !", statusCode: API_RESPONSE_STATUS_CODES.BAD_REQUEST, apiPurpose: apiPurpose })
    }

    /* ---------------------------------------------------
     * Update password
     * -------------------------------------------------- */
    const saltRounds = 10;
    user.password_hash = await bcrypt.hash(new_password, saltRounds);
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();
    return successResponse({ message: "Password reset successful !", statusCode: API_RESPONSE_STATUS_CODES.OK, apiPurpose: apiPurpose })
    } catch (err) {
      return errorResponse({ message: "Internal server error !", statusCode: API_RESPONSE_STATUS_CODES.SERVER_ERROR, apiPurpose: apiPurpose, error: error.message })
    }

  },

};
