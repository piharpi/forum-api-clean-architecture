const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const DetailReply = require("../../../Domains/replies/entities/DetailReply");

class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkIsThreadAvailable(
      useCasePayload.threadId
    );

    const detailThread = await this._threadRepository.getDetailThreadById(
      useCasePayload.threadId
    );

    const reqComments =
      await this._commentRepository.getAllDetailCommentByThreadId(
        useCasePayload.threadId
      );

    const commentIds = reqComments.map((c) => c.id);

    const reqReplies =
      await this._replyRepository.getAllDetailReplyByThreadAndCommentId(
        useCasePayload.threadId,
        commentIds
      );

    const comments = reqComments.map((comment) => {
      const replies = reqReplies
        .filter((r) => r.comment === comment.id)
        .map((r) => new DetailReply(r));

      return { ...comment, replies };
    });

    // const comments = await Promise.all(
    //   reqComments.map(async (comment) => {
    //     const replies =
    //       await this._replyRepository.getAllDetailReplyByThreadAndCommentId(
    //         useCasePayload.threadId,
    //         comment.id
    //       );
    //
    //     return { ...comment, replies };
    //   })
    // );

    // detailThread.comments = comments;

    // another solution but not recommended
    // for (const comment of detailThread.comments) {
    //   comment.replies =
    //     await this._replyRepository.getAllDetailReplyByThreadAndCommentId(
    //       useCasePayload.threadId,
    //       comment.id
    //     );
    // }

    return new DetailThread({ ...detailThread, comments });
  }
}

module.exports = DetailThreadUseCase;
