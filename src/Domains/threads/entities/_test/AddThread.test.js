const AddThread = require("../AddThread");

describe("PostThread Entity", () => {
  it("should throw 400 error when payload not contains needed properties", () => {
    // Arrange
    const payload = {
      title: "Example Thread Title",
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrow(
      "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw 400 error when payload not meet with data type specification", () => {
    // Arrange
    const payload = {
      title: "Example Thread Title",
      body: true,
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrow(
      "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw 400 error when title length is greater than 50", () => {
    // Arrange
    const payload = {
      title: "Super duper long title than it could be exist in real case",
      body: "Simple body content",
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrow(
      "ADD_THREAD.TITTLE_LIMIT_CHAR"
    );
  });

  it("should create PostThread entity correctly", () => {
    // Arrange
    const payload = {
      title: "Example Thread Title",
      body: "The Body of thread",
      owner: "user-123",
    };

    // Action
    const postThread = new AddThread(payload);

    // Assert
    expect(postThread).toBeInstanceOf(AddThread);
    expect(postThread.title).toEqual("Example Thread Title");
    expect(postThread.body).toEqual("The Body of thread");
    expect(postThread.owner).toEqual("user-123");
  });
});
