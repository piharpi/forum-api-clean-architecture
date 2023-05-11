const CommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const thread = request.params.threadId;

    const useCasePayload = { owner, thread, ...request.payload };

    const commentUseCase = this._container.getInstance(CommentUseCase.name);
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
}

module.exports = CommentsHandler