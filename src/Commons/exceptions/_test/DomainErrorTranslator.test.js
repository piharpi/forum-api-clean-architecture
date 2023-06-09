const DomainErrorTranslator = require("../DomainErrorTranslator");
const InvariantError = require("../InvariantError");

describe("DomainErrorTranslator", () => {
  it("should translate error correctly", () => {
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena tipe data tidak sesuai"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.USERNAME_LIMIT_CHAR")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena karakter username melebihi batas limit"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena username mengandung karakter terlarang"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(new InvariantError("harus mengirimkan title dan body"));
    expect(
      DomainErrorTranslator.translate(
        new Error("ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(new InvariantError("title dan body harus string"));
    expect(
      DomainErrorTranslator.translate(new Error("ADD_THREAD.TITTLE_LIMIT_CHAR"))
    ).toStrictEqual(new InvariantError("title melebihi batas yang ditentukan"));
    expect(
      DomainErrorTranslator.translate(
        new Error("NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(new InvariantError("harus mengirimkan content"));
    expect(
      DomainErrorTranslator.translate(
        new Error("NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(new InvariantError("content harus string"));
    expect(
      DomainErrorTranslator.translate(
        new Error("DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "harus mengirimkan id, username, content, date, is_delete"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError("semua harus string, kecuali is_delete adalah boolean")
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError("harus mengirimkan semua property yang diperlukan")
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError("semua harus string, kecuali comments adalah array")
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError("harus mengirimkan semua property yang diperlukan")
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(new InvariantError("semua harus string"));
    expect(
      DomainErrorTranslator.translate(
        new Error("ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError("harus mengirimkan semua property yang diperlukan")
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(new InvariantError("semua harus string"));
    expect(
      DomainErrorTranslator.translate(
        new Error("NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(new InvariantError("harus mengirimkan content"));
    expect(
      DomainErrorTranslator.translate(
        new Error("NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(new InvariantError("content harus string"));
    expect(
      DomainErrorTranslator.translate(
        new Error("TOGGLE_LIKE.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError("harus mengirimkan semua property yang diperlukan")
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("TOGGLE_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(new InvariantError("payload harus string"));
  });

  it("should return original error when error message is not needed to translate", () => {
    // Arrange
    const error = new Error("some_error_message");

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
