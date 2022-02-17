exports.ERROR_TYPE = {
  validationError: "ValidationError",
  castError: "CastError",
  normalError: "Error",
  tokenExpiredError: "TokenExpiredError",
  authError: "auth/argument-error",
  firebaseTokenExpiredError: "auth/id-token-expired",
  expiredJWT: "jwt expired",
  malformedJWT: "jwt malformed",
};

exports.ERROR_MESSAGE = {
  dataBaseError: "DataBase Error",
  invalidObjectId: "Not Valid ObjectId",
  validationError: "Validation Error",
  invalidDataCasting: "Invalid Data Casting",
  notFound: "Not Found User",
  sendMailFailure: "Failed to send mail",
  invalidFirebaseToken: "Invalid Firebase Token",
  expiredFirebaseToken: "Expired Firebase Token",
  invalidToken: "Invaild Verify Token",
  expiredToken: "Expired Token",
  invalidServerError: "Invalid Server Error",
};

exports.RESULT_MESSAGE = {
  success: "success",
  fail: "fail",
};
