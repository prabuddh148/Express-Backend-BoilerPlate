import bcrypt from "bcrypt";
import crypto from "crypto";

/**
 * Generate a numeric OTP
 * @param {number} length - default 6 digits
 */
const generateOtp = (length = 4) => {
  return crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length)).toString();
};

/**
 * Hash OTP securely
 * @param {string} otp 
 */
const hashOtp = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

/**
 * Verify OTP (compare raw OTP with hashed OTP)
 * @param {string} rawOtp 
 * @param {string} hashedOtp 
 */
const verifyOtp = async (rawOtp, hashedOtp) => {
  return bcrypt.compare(rawOtp, hashedOtp);
};

/**
 * Generate + Hash OTP together (common for registration, login, password reset)
 */
const generateAndHashOtp = async (digits = 6) => {
  const otp = await generateOtp(digits);
  const hashed = await hashOtp(otp);

  return {
    otp,        // send this to user (SMS or Email)
    hashedOtp: hashed, // store this in DB
  };
};

export const OtpHelper = {
  generateOtp,
  hashOtp,
  verifyOtp,
  generateAndHashOtp,
};
