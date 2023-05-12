const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const thread = request.params.threadId;

    const useCasePayload = { owner, thread, ...request.payload };

    const commentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await commentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      },
    });
    response.code(201);
    return response
  }

  async deleteCommentHandler(request, h) {
    const ownerId = request.auth.credentials.id;
    const { threadId, commentId } = request.params;
    const useCasePayload = { ownerId, threadId, commentId }

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success'
    });

    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler