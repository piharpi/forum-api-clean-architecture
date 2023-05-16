class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { ownerId, threadId, commentId } = useCasePayload;

    // validation if the thread exist
    await this._threadRepository.checkIsThreadAvailable(threadId);
    // validation if the comment exist
    await this._commentRepository.checkIsCommentAvailable(commentId);
    // validation if user owned comment
    await this._commentRepository.verifyCommentOwner(commentId, ownerId);

    // execute soft-delete comment
    await this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
