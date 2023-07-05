const { use } = require("bcrypt/promises");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const LikeableUseCase = require("../likes/LikeableUseCase");

describe("LikeableUseCase Test", () => {
  it("should orchestrating the like comment correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      userId: "user-123",
    };
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.checkIsThreadAvailable = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.checkIsCommentAvailable = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    const mockLikeRepository = new LikeRepository();
    mockLikeRepository.likeableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const likeableUseCase = new LikeableUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action & Assert
    await expect(
      likeableUseCase.execute(useCasePayload)
    ).resolves.not.toThrowError(Error);

    await expect(mockThreadRepository.checkIsThreadAvailable).toBeCalledWith(
      useCasePayload.threadId
    );

    await expect(mockCommentRepository.checkIsCommentAvailable).toBeCalledWith(
      useCasePayload.commentId
    );

    await expect(mockLikeRepository.likeableComment).toBeCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
  });
});
