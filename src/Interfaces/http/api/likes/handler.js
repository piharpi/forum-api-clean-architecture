const LikeableUseCase = require("../../../../Applications/use_case/likes/LikeableUseCase");

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const useCasePayload = { threadId, commentId, userId };

    const likeableUseCase = this._container.getInstance(LikeableUseCase.name);
    await likeableUseCase.execute(useCasePayload);

    const response = h.response({
      status: "success",
    });
    response.code(200);

    return response;
  }
}

module.exports = LikesHandler;
