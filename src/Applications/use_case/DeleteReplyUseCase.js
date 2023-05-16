class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkIsThreadAvailable(
      useCasePayload.threadId
    );
    await this._commentRepository.checkIsCommentAvailable(
      useCasePayload.commentId
    );

    await this._replyRepository.checkIsReplyAvailable(useCasePayload.replyId);
    await this._replyRepository.verifyReplyOwner(
      useCasePayload.replyId,
      useCasePayload.ownerId
    );

    await this._replyRepository.deleteReply(useCasePayload.replyId);
  }
}

module.exports = DeleteReplyUseCase;
