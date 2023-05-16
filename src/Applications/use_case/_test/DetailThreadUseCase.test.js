const DetailThreadUseCase = require("../DetailThreadUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("DetailThreadUseCase", () => {
  it("should orchestrating the detail thread action correcty", async () => {
    // Arrange
    const useCasePayload = { threadId: "thread-123" };

    const detailThread = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "harpi",
      comments: [],
    };

    const detailAllComment = [
      {
        id: "comment-123",
        username: "harpi",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
      },
      {
        id: "comment-1234",
        username: "mulut_netizen",
        date: "2021-08-08T07:22:33.555Z",
        content: "**komentar telah dihapus**",
      },
    ];

    const detailAllReplies = [
      {
        id: "reply-1",
        username: "mulut_netizen",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
      },
      {
        id: "reply-2",
        username: "harpi",
        date: "2021-08-08T07:22:33.555Z",
        content: "**komentar telah dihapus**",
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.checkIsThreadAvailable = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getDetailThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(detailThread));

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getAllDetailCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(detailAllComment));

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getAllDetailReplyByThreadAndCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(detailAllReplies));

    // Action
    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Assert
    await expect(
      detailThreadUseCase.execute(useCasePayload)
    ).resolves.not.toThrowError(Error);
    await expect(mockThreadRepository.checkIsThreadAvailable).toBeCalledWith(
      useCasePayload.threadId
    );
    await expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(
      useCasePayload.threadId
    );
    await expect(
      mockCommentRepository.getAllDetailCommentByThreadId
    ).toBeCalledWith(useCasePayload.threadId);
    await expect(
      mockReplyRepository.getAllDetailReplyByThreadAndCommentId
    ).toBeCalledWith(useCasePayload.threadId, detailAllComment[0].id);
    await expect(
      mockReplyRepository.getAllDetailReplyByThreadAndCommentId
    ).toBeCalledWith(useCasePayload.threadId, detailAllComment[1].id);
  });
});
