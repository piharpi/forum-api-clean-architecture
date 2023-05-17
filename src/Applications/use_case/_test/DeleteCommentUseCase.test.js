const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DeleteCommentUseCase = require("../comments/DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should orchestrating the delete comment action correcty", async () => {
    // Arrange
    const useCasePayload = {
      ownerId: "user-123",
      commentId: "comment-123",
      threadId: "thread-123",
    };

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkIsCommentAvailable = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.checkIsThreadAvailable = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Action
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Assert
    await expect(
      deleteCommentUseCase.execute(useCasePayload)
    ).resolves.not.toThrowError(Error);
    await expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.ownerId
    );
    await expect(mockCommentRepository.checkIsCommentAvailable).toBeCalledWith(
      useCasePayload.commentId
    );
    await expect(mockThreadRepository.checkIsThreadAvailable).toBeCalledWith(
      useCasePayload.threadId
    );
    await expect(mockCommentRepository.deleteComment).toBeCalledWith(
      useCasePayload.commentId
    );
  });
});
