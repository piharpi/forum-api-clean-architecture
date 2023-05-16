const DetailComment = require("../DetailComment");

describe("DetailComment Entity", () => {
  it("should create DetailComment Entity correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "harpi",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah comment",
      is_delete: false,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toEqual("comment-123");
    expect(detailComment.username).toEqual("harpi");
    expect(detailComment.date).toEqual("2021-08-08T07:22:33.555Z");
    expect(detailComment.content).toEqual("sebuah comment");
  });

  it("should create deleted DetailComment Entity correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "harpi",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah comment",
      is_delete: true,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toEqual("comment-123");
    expect(detailComment.username).toEqual("harpi");
    expect(detailComment.date).toEqual("2021-08-08T07:22:33.555Z");
    expect(detailComment.content).toEqual("**komentar telah dihapus**");
  });

  it("should throw 400 error when payload not contains needed properties", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "harpi",
      content: "sebuah comment",
      is_delete: true,
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrow(
      "DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw 400 error when payload not meet with data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "harpi",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah comment",
      is_delete: "true",
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrow(
      "DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
});
