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

    const comments =
      await this._commentRepository.getAllDetailCommentByThreadId(
        useCasePayload.threadId
      );

    const requestReply = async (threadId, commentId) =>
      this._replyRepository.getAllDetailReplyByThreadAndCommentId(
        threadId,
        commentId
      );

    const replies = comments.map((comment) =>
      requestReply(useCasePayload.threadId, comment.id)
    );

    const solvedPromisesReplies = await Promise.all(replies);

    solvedPromisesReplies.forEach((r, i) => {
      comments[i].replies = r;
    });

    // another solution but not recommended
    // for (const comment of detailThread.comments) {
    //   comment.replies =
    //     await this._replyRepository.getAllDetailReplyByThreadAndCommentId(
    //       useCasePayload.threadId,
    //       comment.id
    //     );
    // }

    detailThread.comments = comments;
    return detailThread;
  }
}

module.exports = DetailThreadUseCase;
