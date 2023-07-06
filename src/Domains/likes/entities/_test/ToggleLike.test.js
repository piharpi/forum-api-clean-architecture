const ToggleLike = require("../ToggleLike");

describe("ToggleLike Entity", () => {
  it("should throw 400 error when payload not contains needed properties", () => {
    // Arrange
    const payload = {
      commentId: "comment-123",
    };

    // Action & Assert
    expect(() => new ToggleLike(payload)).toThrow(
      "TOGGLE_LIKE.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw 400 error when payload not meet with data type specification", () => {
    // Arrange
    const payload = {
      commentId: "comment-123",
      userId: true,
    };

    // Action & Assert
    expect(() => new ToggleLike(payload)).toThrow(
      "TOGGLE_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create toggle like entity correctly", () => {
    // Arrange
    const payload = {
      commentId: "comment-123",
      userId: "user-123",
    };

    // Action
    const toggleLike = new ToggleLike(payload);

    // Assert
    expect(toggleLike).toBeInstanceOf(ToggleLike);
    expect(toggleLike.commentId).toEqual("comment-123");
    expect(toggleLike.userId).toEqual("user-123");
  });
});
