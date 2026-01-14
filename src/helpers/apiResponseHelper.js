import { API_RESPONSE_STATUS_CODES } from "../utils/apiRsponseStatusCodes.js";

/**
 * Unified response formatter for all APIs
 * No classes — simple functional module
 */

const send = ({
  res,
  success = false,
  message = "",
  data = null,
  error = null,
  statusCode = 200,
  apiPurpose = "",
  meta = null,
}) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    error,
    statusCode,
    apiPurpose,
    meta
  });
};

export const ApiResponseHelper = {
  
  ok: (res, result) => {
    return send({
      res,
      success: true,
      message: result.message,
      data: result.data,
      statusCode: API_RESPONSE_STATUS_CODES.OK,
      apiPurpose: result.apiPurpose,
      error: result.error || null,
      meta: result.meta
    });
  },

  created: (res, result) => {
    return send({
      res,
      success: true,
      message: result.message,
      data: result.data,
      statusCode: API_RESPONSE_STATUS_CODES.CREATED,
      apiPurpose: result.apiPurpose,
      error: result.error || null,
      meta: result.meta
    });
  },
  

  badRequest: (res, result) => {
    return send({
      res,
      success: false,
      message: result.message,
      data: result.data,
      statusCode: API_RESPONSE_STATUS_CODES.BAD_REQUEST,
      apiPurpose: result.apiPurpose,
      error: result.error || null,
      meta: result.meta
    });
  },

  updated: (res, result) => {
    return send({
      res,
      success: true,
      message: result.message,
      data: result.data,
      statusCode: API_RESPONSE_STATUS_CODES.OK,
      apiPurpose: result.apiPurpose,
      error: result.error || null,
      meta: result.meta
    });
  },

  deleted: (res, result) => {
    return send({
      res,
      success: true,
      message: result.message,
      data: result.data,
      statusCode: API_RESPONSE_STATUS_CODES.OK,
      apiPurpose: result.apiPurpose,
      error: result.error || null,
      meta: result.meta
    });
  },

  conflict: (res, result) => {
    return send({
      res,
      success: false,
      message: result.message,
      data: result.data,
      statusCode: API_RESPONSE_STATUS_CODES.CONFLICT,
      apiPurpose: result.apiPurpose,
      error: result.error || null,
      meta: result.meta
    });
  },

  validationError: (res, result) => {
    return send({
      res,
      success: false,
      message: result.message,
      data: result.data,
      statusCode: API_RESPONSE_STATUS_CODES.VALIDATION_ERROR,
      apiPurpose: result.apiPurpose,
      error: result.error || null,
      meta: result.meta
    });
  },

  notFound: (res, result) => {
    return send({
      res,
      success: false,
      message: result.message,
      data: result.data,
      statusCode: API_RESPONSE_STATUS_CODES.NOT_FOUND,
      apiPurpose: result.apiPurpose,
      error: result.error || null,
      meta: result.meta
    });
  },


  unauthorized: (res, result) => {
    return send({
      res,
      success: false,
      message: result.message,
      data: result.data,
      statusCode: API_RESPONSE_STATUS_CODES.UNAUTHORIZED,
      apiPurpose: result.apiPurpose,
      error: result.error || null,
      meta: result.meta
    });
  },


  forbidden: (res, result) => {
    return send({
      res,
      success: false,
      message: result.message,
      data: result.data,
      statusCode: API_RESPONSE_STATUS_CODES.FORBIDDEN,
      apiPurpose: result.apiPurpose,
      error: result.error || null,
      meta: result.meta
    });
  },

  serverError: (res, result) => {
    return send({
      res,
      success: false,
      message: result.message,
      data: null,
      statusCode: result.statusCode,
      apiPurpose: result.apiPurpose,
      meta: result.meta,
      error: result.error,
    });
  },


// ok: (res, message = "Success", data = null, apiPurpose = "") => { return send({ res, success: true, message, data, statusCode: API_RESPONSE_STATUS_CODES.OK, apiPurpose, meta: null }) },

  // created: (res, message = "Created successfully", data = null, apiPurpose = "") => {
  //   return send({ res, success: true, message, data, statusCode: API_RESPONSE_STATUS_CODES.CREATED, apiPurpose })
  // },

  // badRequest: (res, message = "Bad request", data = null, apiPurpose = "") => {
  //   return send({ res, success: false, message, data, statusCode: API_RESPONSE_STATUS_CODES.BAD_REQUEST, apiPurpose })
  // },

  
  // updated: (res, message = "Updated successfully", data = null, apiPurpose = "") =>
  //   send({ res, success: true, message, data, statusCode: API_RESPONSE_STATUS_CODES.OK, apiPurpose }),

  // deleted: (res, message = "Deleted successfully", apiPurpose = "") => {
  //   return send({ res, success: true, message, statusCode: API_RESPONSE_STATUS_CODES.OK, apiPurpose })
  // },

  // conflict: (res, message = "Duplicate entry found", apiPurpose = "") => {
  //   return send({ res, success: false, message, statusCode: API_RESPONSE_STATUS_CODES.CONFLICT, apiPurpose })
  // },


  // validationError: (res, message = "Validation failed", error = null, apiPurpose = "") => {
  //   return send({ res, success: false, message, error, statusCode: API_RESPONSE_STATUS_CODES.VALIDATION_ERROR, apiPurpose })
  // },

  // notFound: (res, message = "Not found", apiPurpose = "") => {
  //   return send({ res, success: false, message, statusCode: API_RESPONSE_STATUS_CODES.NOT_FOUND, apiPurpose })
  // },

  // unauthorized: (res, message = "Unauthorized", apiPurpose = "") => {
  //   return send({ res, success: false, message, statusCode: API_RESPONSE_STATUS_CODES.UNAUTHORIZED, apiPurpose })
  // },

  // forbidden: (res, message = "Internal server error", error = null, apiPurpose = "") => {
  //   return send({ res, success: false, message, error, statusCode: API_RESPONSE_STATUS_CODES.FORBIDDEN, apiPurpose });
  // },



  // serverError: (res, message = "Internal server error", error = null, apiPurpose = "") => {
  //   return send({ res, success: false, message, error, statusCode: API_RESPONSE_STATUS_CODES.SERVER_ERROR, apiPurpose });
  // },
};
