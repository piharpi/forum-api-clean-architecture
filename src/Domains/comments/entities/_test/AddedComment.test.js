const AddedComment = require("../AddedComment");

describe("AddedComment entity", () => {
  it("should throw 400 error when payload not contains needed properties", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "Example Comment content",
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw 400 error when payload not meet with data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "Example Comment content",
      owner: true,
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create PostComment entity correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "Example Comment content",
      owner: "user-123",
    };

    // Action
    const postComment = new AddedComment(payload);

    // Assert
    expect(postComment).toBeInstanceOf(AddedComment);
    expect(postComment.id).toEqual("comment-123");
    expect(postComment.content).toEqual("Example Comment content");
    expect(postComment.owner).toEqual("user-123");
  });
});
