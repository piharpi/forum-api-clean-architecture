const DetailReply = require("../DetailReply");

describe("Detail Reply Entity", () => {
  it("should create DetailReply Entity correctly", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      username: "harpi",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah balasan",
      is_delete: false,
    };

    // Action
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply.id).toEqual("reply-123");
    expect(detailReply.username).toEqual("harpi");
    expect(detailReply.date).toEqual("2021-08-08T07:22:33.555Z");
    expect(detailReply.content).toEqual("sebuah balasan");
  });

  it("should create deleted DetailReply Entity correctly", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      username: "harpi",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah balasan",
      is_delete: true,
    };

    // Action
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply.id).toEqual("reply-123");
    expect(detailReply.username).toEqual("harpi");
    expect(detailReply.date).toEqual("2021-08-08T07:22:33.555Z");
    expect(detailReply.content).toEqual("**balasan telah dihapus**");
  });

  it("should throw 400 error when payload not contains needed properties", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      username: "harpi",
      content: "sebuah balasan",
      is_delete: true,
    };

    // Action & Assert
    expect(() => new DetailReply(payload)).toThrow(
      "DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw 400 error when payload not meet with data type specification", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      username: "harpi",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah balasan",
      is_delete: "true",
    };

    // Action & Assert
    expect(() => new DetailReply(payload)).toThrow(
      "DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
});
