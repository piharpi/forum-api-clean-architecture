const ToggleLike = require("../../../Domains/likes/entities/ToggleLike");

class LikeableUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkIsThreadAvailable(
      useCasePayload.threadId
    );
    await this._commentRepository.checkIsCommentAvailable(
      useCasePayload.commentId
    );

    const likePayload = new ToggleLike({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });

    await this._likeRepository.likeableComment(likePayload);
  }
}

module.exports = LikeableUseCase;
