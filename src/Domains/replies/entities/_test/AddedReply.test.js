const AddedReply = require("../AddedReply");

describe("AddedReply entity", () => {
  it("should throw 400 error when payload not contains needed properties", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "ini balasan",
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrow(
      "ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw 400 error when payload not meet with data type specification", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "ini balasan",
      owner: true,
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrow(
      "ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddedReply entity correctly", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "ini balasan",
      owner: "user-123",
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply).toBeInstanceOf(AddedReply);
    expect(addedReply.id).toEqual("reply-123");
    expect(addedReply.content).toEqual("ini balasan");
    expect(addedReply.owner).toEqual("user-123");
  });
});
