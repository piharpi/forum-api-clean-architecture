const InvariantError = require("./InvariantError");

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
  ),
  "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat user baru karena tipe data tidak sesuai"
  ),
  "REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError(
    "tidak dapat membuat user baru karena karakter username melebihi batas limit"
  ),
  "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError(
    "tidak dapat membuat user baru karena username mengandung karakter terlarang"
  ),
  "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan username dan password"
  ),
  "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "username dan password harus string"
  ),
  "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
    new InvariantError("harus mengirimkan token refresh"),
  "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
    new InvariantError("refresh token harus string"),
  "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
    new InvariantError("harus mengirimkan token refresh"),
  "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
    new InvariantError("refresh token harus string"),
  "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan title dan body"
  ),
  "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "title dan body harus string"
  ),
  "ADD_THREAD.TITTLE_LIMIT_CHAR": new InvariantError(
    "title melebihi batas yang ditentukan"
  ),
  "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan content"
  ),
  "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "content harus string"
  ),
  "DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan id, username, content, date, is_delete"
  ),
  "DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "semua harus string, kecuali is_delete adalah boolean"
  ),
  "DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan semua property yang diperlukan"
  ),
  "DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "semua harus string, kecuali comments adalah array"
  ),
  "DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan semua property yang diperlukan"
  ),
  "DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "semua harus string"
  ),
  "ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan semua property yang diperlukan"
  ),
  "ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "semua harus string"
  ),
  "NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan content"
  ),
  "NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "content harus string"
  ),
  "TOGGLE_LIKE.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan semua property yang diperlukan"
  ),
  "TOGGLE_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "payload harus string"
  ),
};

module.exports = DomainErrorTranslator;
