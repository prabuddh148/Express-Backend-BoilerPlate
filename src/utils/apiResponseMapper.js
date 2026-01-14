import { ApiResponseHelper } from "../helpers/apiResponseHelper.js";
import { API_RESPONSE_STATUS_CODES } from "./apiRsponseStatusCodes.js";

export const API_RESPONSE_MAP = {
    [API_RESPONSE_STATUS_CODES.OK]: ApiResponseHelper.ok,
    [API_RESPONSE_STATUS_CODES.CREATED]: ApiResponseHelper.created,
    [API_RESPONSE_STATUS_CODES.BAD_REQUEST]: ApiResponseHelper.badRequest,
    [API_RESPONSE_STATUS_CODES.UNAUTHORIZED]: ApiResponseHelper.unauthorized,
    [API_RESPONSE_STATUS_CODES.FORBIDDEN]: ApiResponseHelper.forbidden,
    [API_RESPONSE_STATUS_CODES.NOT_FOUND]: ApiResponseHelper.notFound,
    [API_RESPONSE_STATUS_CODES.CONFLICT]: ApiResponseHelper.conflict,
    [API_RESPONSE_STATUS_CODES.VALIDATION_ERROR]: ApiResponseHelper.validationError,
    [API_RESPONSE_STATUS_CODES.SERVER_ERROR]: ApiResponseHelper.serverError,
};

export const successResponse = ({
    message,
    data = null,
    statusCode = 200,
    meta = null,
    apiPurpose = "",
    error = null,
}) => ({
    statusCode,
    success: true,
    message,
    data,
    meta,
    apiPurpose,
    error,
});

export const errorResponse = ({
    message,
    statusCode = 500,
    apiPurpose = "",
    error = null,
    data = null,
}) => ({
    statusCode,
    success: false,
    message,
    data,
    apiPurpose,
    error,
});


// export const successResponse = (message, data = null, statusCode = 200, meta = null,apiPurpose="",error=null) => ({
//   statusCode,
//   success: true,
//   message,
//   data,
//   apiPurpose,
//   meta,
//   error
// });


// export const errorResponse = (message,  statusCode = 500, apiPurpose="",error=null) => ({
//   statusCode,
//   success: false,
//   message,
//   data,
//   apiPurpose,
//   error : null,
// });
