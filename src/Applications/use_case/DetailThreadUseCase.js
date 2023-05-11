class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkIsThreadAvailable(useCasePayload.threadId);
    const detailThread = await this._threadRepository.getDetailThreadById(useCasePayload.threadId);

    detailThread.comments = await this._commentRepository.getAllDetailCommentByThreadId(useCasePayload.threadId);

    return detailThread;
  }
}

module.exports = DetailThreadUseCase