const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");
const DetailReply = require("../../../Domains/replies/entities/DetailReply");
const DetailThreadUseCase = require("../threads/DetailThreadUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("DetailThreadUseCase", () => {
  // it("should orchestrating the detail thread action correcty", async () => {
  //   // Arrange
  //   const useCasePayload = { threadId: "thread-123" };
  //
  //   const expectDetailThread = new DetailThread({
  //     id: "thread-123",
  //     title: "sebuah thread",
  //     body: "sebuah body thread",
  //     date: "2021-08-08T07:19:09.775Z",
  //     username: "harpi",
  //   });
  //
  //   const expectDetailAllComment = [
  //     new DetailComment({
  //       id: "comment-123",
  //       username: "harpi",
  //       date: "2021-08-08T07:22:33.555Z",
  //       is_delete: false,
  //       content: "isi komentar",
  //     }),
  //     new DetailComment({
  //       id: "comment-1234",
  //       username: "mulut_netizen",
  //       date: "2021-08-08T07:24:33.555Z",
  //       is_delete: true,
  //       content: "isi komentar",
  //     }),
  //   ];
  //
  //   const expectDetailAllReplies = [
  //     new DetailReply({
  //       id: "reply-1",
  //       username: "mulut_netizen",
  //       is_delete: false,
  //       date: "2021-08-08T07:29:33.555Z",
  //       content: "sebuah reply",
  //     }),
  //     new DetailReply({
  //       id: "reply-2",
  //       username: "harpi",
  //       date: "2021-08-08T07:37:33.555Z",
  //       is_delete: false,
  //       content: "sebuah reply",
  //     }),
  //   ];
  //
  //   const mockThreadRepository = new ThreadRepository();
  //   mockThreadRepository.checkIsThreadAvailable = jest
  //     .fn()
  //     .mockImplementation(() => Promise.resolve());
  //   mockThreadRepository.getDetailThreadById = jest
  //     .fn()
  //     .mockImplementation(() =>
  //       Promise.resolve(
  //         new DetailThread({
  //           id: "thread-123",
  //           title: "sebuah thread",
  //           body: "sebuah body thread",
  //           date: "2021-08-08T07:19:09.775Z",
  //           username: "harpi",
  //         })
  //       )
  //     );
  //
  //   const mockCommentRepository = new CommentRepository();
  //   mockCommentRepository.getAllDetailCommentByThreadId = jest
  //     .fn()
  //     .mockImplementation(() =>
  //       Promise.resolve([
  //         new DetailComment({
  //           id: "comment-123",
  //           username: "harpi",
  //           date: "2021-08-08T07:22:33.555Z",
  //           is_delete: false,
  //           content: "isi komentar",
  //         }),
  //         new DetailComment({
  //           id: "comment-1234",
  //           username: "mulut_netizen",
  //           date: "2021-08-08T07:24:33.555Z",
  //           is_delete: true,
  //           content: "isi komentar",
  //         }),
  //       ])
  //     );
  //
  //   const mockReplyRepository = new ReplyRepository();
  //   mockReplyRepository.getAllDetailReplyByThreadAndCommentId = jest
  //     .fn()
  //     .mockImplementation(() =>
  //       Promise.resolve([
  //         new DetailReply({
  //           id: "reply-1",
  //           username: "mulut_netizen",
  //           is_delete: false,
  //           date: "2021-08-08T07:29:33.555Z",
  //           content: "sebuah reply",
  //         }),
  //         new DetailReply({
  //           id: "reply-2",
  //           username: "harpi",
  //           date: "2021-08-08T07:37:33.555Z",
  //           is_delete: false,
  //           content: "sebuah reply",
  //         }),
  //       ])
  //     );
  //
  //   // Action
  //   const detailThreadUseCase = new DetailThreadUseCase({
  //     threadRepository: mockThreadRepository,
  //     commentRepository: mockCommentRepository,
  //     replyRepository: mockReplyRepository,
  //   });
  //
  //   // Assert
  //   const detailThreadUseCaseResult = await detailThreadUseCase.execute(
  //     useCasePayload
  //   );
  //
  //   expect(detailThreadUseCaseResult).toBeInstanceOf(DetailThread);
  //   await expect(mockThreadRepository.checkIsThreadAvailable).toBeCalledWith(
  //     useCasePayload.threadId
  //   );
  //   await expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(
  //     useCasePayload.threadId
  //   );
  //   await expect(
  //     mockCommentRepository.getAllDetailCommentByThreadId
  //   ).toBeCalledWith(useCasePayload.threadId);
  //   await expect(
  //     mockReplyRepository.getAllDetailReplyByThreadAndCommentId
  //   ).toBeCalledWith(useCasePayload.threadId, expectDetailAllComment[0].id);
  //   await expect(
  //     mockReplyRepository.getAllDetailReplyByThreadAndCommentId
  //   ).toBeCalledWith(useCasePayload.threadId, expectDetailAllComment[1].id);
  //
  //   expect(detailThreadUseCaseResult).toStrictEqual(
  //     new DetailThread({
  //       ...expectDetailThread,
  //       comments: [
  //         { ...expectDetailAllComment[0], replies: expectDetailAllReplies },
  //         { ...expectDetailAllComment[1], replies: expectDetailAllReplies },
  //       ],
  //     })
  //   );
  // });

  it("should orchestrating the detail thread action correcty", async () => {
    // Arrange
    const useCasePayload = { threadId: "thread-123" };

    const expectDetailThread = new DetailThread({
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "harpi",
    });

    const expectDetailAllComment = [
      new DetailComment({
        id: "comment-123",
        username: "harpi",
        date: "2021-08-08T07:22:33.555Z",
        is_delete: false,
        content: "isi komentar",
      }),
      new DetailComment({
        id: "comment-1234",
        username: "mulut_netizen",
        date: "2021-08-08T07:24:33.555Z",
        is_delete: true,
        content: "isi komentar",
      }),
    ];

    const expectDetailAllReplies = [
      new DetailReply({
        id: "reply-1",
        username: "mulut_netizen",
        is_delete: false,
        date: "2021-08-08T07:29:33.555Z",
        content: "sebuah reply",
      }),
      new DetailReply({
        id: "reply-2",
        username: "harpi",
        date: "2021-08-08T07:37:33.555Z",
        is_delete: false,
        content: "sebuah reply",
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.checkIsThreadAvailable = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getDetailThreadById = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          new DetailThread({
            id: "thread-123",
            title: "sebuah thread",
            body: "sebuah body thread",
            date: "2021-08-08T07:19:09.775Z",
            username: "harpi",
          })
        )
      );

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getAllDetailCommentByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          new DetailComment({
            id: "comment-123",
            username: "harpi",
            date: "2021-08-08T07:22:33.555Z",
            is_delete: false,
            content: "isi komentar",
          }),
          new DetailComment({
            id: "comment-1234",
            username: "mulut_netizen",
            date: "2021-08-08T07:24:33.555Z",
            is_delete: true,
            content: "isi komentar",
          }),
        ])
      );

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getAllDetailReplyByThreadAndCommentId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: "reply-1",
            username: "mulut_netizen",
            is_delete: false,
            date: "2021-08-08T07:29:33.555Z",
            content: "sebuah reply",
            comment: "comment-123",
          },
          {
            id: "reply-2",
            username: "harpi",
            date: "2021-08-08T07:37:33.555Z",
            is_delete: false,
            content: "sebuah reply",
            comment: "comment-1234",
          },
        ])
      );

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThreadUseCaseResult = await detailThreadUseCase.execute(
      useCasePayload
    );

    // Assert
    expect(detailThreadUseCaseResult).toBeInstanceOf(DetailThread);
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
    ).toBeCalledWith(useCasePayload.threadId, [
      expectDetailAllComment[0].id,
      expectDetailAllComment[1].id,
    ]);

    expect(detailThreadUseCaseResult).toStrictEqual(
      new DetailThread({
        ...expectDetailThread,
        comments: [
          {
            ...expectDetailAllComment[0],
            replies: [expectDetailAllReplies[0]],
          },
          {
            ...expectDetailAllComment[1],
            replies: [expectDetailAllReplies[1]],
          },
        ],
      })
    );
  });
});
