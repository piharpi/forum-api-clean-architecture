const AddReplyUseCase = require("../../../../Applications/use_case/replies/AddReplyUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/DeleteReplyUseCase");

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const thread = request.params.threadId;
    const comment = request.params.commentId;

    const useCasePayload = { owner, thread, comment, ...request.payload };

    const replyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await replyUseCase.execute(useCasePayload);

    const response = h.response({
      status: "success",
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const ownerId = request.auth.credentials.id;
    const { threadId, commentId, replyId } = request.params;
    const useCasePayload = { ownerId, threadId, commentId, replyId };

    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );
    await deleteReplyUseCase.execute(useCasePayload);

    const response = h.response({
      status: "success",
    });

    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
