const NewReply = require("../../Domains/replies/entities/NewReply");

class AddReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkIsThreadAvailable(useCasePayload.thread);
    await this._commentRepository.checkIsCommentAvailable(
      useCasePayload.comment
    );
    const newReply = new NewReply(useCasePayload);

    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
