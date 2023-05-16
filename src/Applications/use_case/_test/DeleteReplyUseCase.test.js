const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DeleteReplyUseCase = require('../../../Applications/use_case/DeleteReplyUseCase')

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correcty', async () => {
    // Arrange
    const useCasePayload = {
      ownerId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    }

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve())
    mockReplyRepository.checkIsReplyAvailable = jest.fn().mockImplementation(() => Promise.resolve())
    mockReplyRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve())


    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.checkIsThreadAvailable = jest.fn().mockImplementation(() => Promise.resolve())

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.checkIsCommentAvailable = jest.fn().mockImplementation(() => Promise.resolve())

    // Action
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Assert
    await expect(deleteReplyUseCase.execute(useCasePayload)).resolves.not.toThrowError(Error)
    await expect(mockThreadRepository.checkIsThreadAvailable).toBeCalledWith(useCasePayload.threadId);
    await expect(mockCommentRepository.checkIsCommentAvailable).toBeCalledWith(useCasePayload.commentId);
    await expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(useCasePayload.replyId, useCasePayload.ownerId);
    await expect(mockReplyRepository.checkIsReplyAvailable).toBeCalledWith(useCasePayload.replyId);
    await expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
  });
});