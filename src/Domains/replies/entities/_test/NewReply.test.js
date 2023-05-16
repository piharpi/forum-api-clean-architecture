const NewReply = require("../NewReply");

describe("NewReply Entity", () => {
  it("should throw 400 error when payload not contains needed properties", () => {
    // Arrange
    const payload = {
      content: "ini balasan",
      comment: "comment-123",
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrow(
      "NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw 400 error when payload not meet with data type specification", () => {
    // Arrange
    const payload = {
      content: true,
      comment: "comment-123",
      thread: "thread-123",
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrow(
      "NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create NewReply entity correctly", () => {
    // Arrange
    const payload = {
      content: "ini balasan",
      comment: "comment-123",
      thread: "thread-123",
      owner: "user-123",
    };

    // Action
    const postComment = new NewReply(payload);

    // Assert
    expect(postComment).toBeInstanceOf(NewReply);
    expect(postComment.content).toEqual("ini balasan");
    expect(postComment.comment).toEqual("comment-123");
    expect(postComment.thread).toEqual("thread-123");
    expect(postComment.owner).toEqual("user-123");
  });
});
