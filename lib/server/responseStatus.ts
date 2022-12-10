export enum RESPONSE_STATUS_CODE {
  SUCCESS = 200,
  BAD_REQUEST = 400, //e.g. body was not included or body was of incorrect content type
  UNAUTHORIZED = 401, //e.g. user is not logged in
  FORBIDDEN = 403, //e.g. user with given role does not have permission to access a resource
  NOT_FOUND = 404, //e.g. page does not exist
  CONFLICT = 409, //e.g. user want to add a resource that already exists

  UNPROCESSABLE_ENTITY = 422, //e.g. validation error
}
