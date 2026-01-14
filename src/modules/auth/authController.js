import AuthService from "./authService.js";
import { ApiResponseHelper } from "../../helpers/apiResponseHelper.js";
import { API_RESPONSE_MAP } from "../../utils/apiResponseMapper.js";


const AuthController = {
  register: async (req, res) => {
    try {
      const result = await AuthService.register(req.body);
      const handler = API_RESPONSE_MAP[result.statusCode] || ApiResponseHelper.serverError;
      return handler(res, result);
    } catch (err) {
      console.log(err.message);
    }
  },

  login: async (req, res) => {
    const result = await AuthService.login(req.body);
    const handler = API_RESPONSE_MAP[result.statusCode] || ApiResponseHelper.serverError;
    return handler(res, result);
  },

  verifyOtp: async (req, res) => {
    const result = await AuthService.verifyOtp(req.body);
    const handler = API_RESPONSE_MAP[result.statusCode] || ApiResponseHelper.serverError;
    return handler(res, result);
  },

  resendOtp: async (req, res) => {
    const result = await AuthService.resendOtp(req.body);
    const handler = API_RESPONSE_MAP[result.statusCode] || ApiResponseHelper.serverError;
    return handler(res, result);
  },

  logout: async (req, res) => {
    const { user_id } = req.credentials;
    const result = await AuthService.logout(user_id);
    const handler = API_RESPONSE_MAP[result.statusCode] || ApiResponseHelper.serverError;
    return handler(res, result);
  },

  refreshToken: async (req, res) => {
    const result = await AuthService.refreshToken(req);
    const handler = API_RESPONSE_MAP[result.statusCode] || ApiResponseHelper.serverError;
    return handler(res, result);
  },

  forgotPassword: async (req, res) => {
    const result = await AuthService.forgotPassword(req);
    const handler = API_RESPONSE_MAP[result.statusCode] || ApiResponseHelper.serverError;
    return handler(res, result);
  },

  resetPassword: async (req, res) => {
    const result = await AuthService.resetPassword(req);
    const handler = API_RESPONSE_MAP[result.statusCode] || ApiResponseHelper.serverError;
    return handler(res, result);
  },


};

export default AuthController;
