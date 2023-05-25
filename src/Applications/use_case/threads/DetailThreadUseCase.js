const DetailThread = require("../../../Domains/threads/entities/DetailThread");

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

    const comments = await Promise.all(
      reqComments.map(async (comment) => {
        const replies =
          await this._replyRepository.getAllDetailReplyByThreadAndCommentId(
            useCasePayload.threadId,
            comment.id
          );

        return { ...comment, replies };
      })
    );

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
