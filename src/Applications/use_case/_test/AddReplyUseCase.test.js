const NewReply = require("../../../Domains/replies/entities/NewReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddReplyUseCase = require("../AddReplyUseCase");

describe("AddReplyUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "ini sebuah balasan",
      thread: "thread-123",
      comment: "comment-123",
      owner: "user-123",
    };

    const mockAddedReply = new AddedReply({
      id: "comment-123",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));
    mockThreadRepository.checkIsThreadAvailable = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkIsCommentAvailable = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await getReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: "comment-123",
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );

    expect(mockReplyRepository.addReply).toBeCalledWith(
      new NewReply({
        content: useCasePayload.content,
        thread: useCasePayload.thread,
        comment: useCasePayload.comment,
        owner: useCasePayload.owner,
      })
    );
    expect(mockThreadRepository.checkIsThreadAvailable).toBeCalledWith(
      "thread-123"
    );
    expect(mockCommentRepository.checkIsCommentAvailable).toBeCalledWith(
      "comment-123"
    );
  });
});
