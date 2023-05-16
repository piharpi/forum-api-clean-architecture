class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkIsThreadAvailable(useCasePayload.threadId);
    const detailThread = await this._threadRepository.getDetailThreadById(useCasePayload.threadId);

    detailThread.comments = await this._commentRepository.getAllDetailCommentByThreadId(useCasePayload.threadId);

    for (const comment of detailThread.comments) {
      comment.replies =
        await this._replyRepository
          .getAllDetailReplyByThreadAndCommentId(useCasePayload.threadId, comment.id);
    }

    return detailThread;
  }
}

module.exports = DetailThreadUseCase