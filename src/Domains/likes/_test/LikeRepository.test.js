const LikeRepository = require("../LikeRepository");

describe("LikeRepository Interface", () => {
  it("should throw error when invoke abstract behaviour", () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action & Assert
    expect(likeRepository.likeableComment({})).rejects.toThrow(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });

  it("should throw error when invoke abstract behaviour", () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action & Assert
    expect(likeRepository.getTotalLikes({})).rejects.toThrow(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
