const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AddedComment = require('../../Domains/comments/entities/AddedComment')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const id = `comment-${this._idGenerator()}`;
    const { content, owner, thread } = newComment;

    const query =  {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner;',
      values: [id, content, owner, thread]
    }

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1;',
      values: [commentId]
    }

    await this._pool.query(query)
  }

  async findCommentById(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1;',
      values: [commentId]
    }

    const { rows, rowCount } = await this._pool.query(query);

    return { rows, rowCount };
  }

  async checkIsCommentAvailable(commentId) {
    const { rowCount : isAvailable } = await this.findCommentById(commentId);

    if (!isAvailable) {
        throw new NotFoundError('comment tidak ada');
    }
  }

  async verifyCommentOwner(commentId, ownerId)  {
    const { rows } = await this.findCommentById(commentId)

    const commentOwnerId = rows[0].owner;

    if(commentOwnerId !== ownerId) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini')
    }
  }
}

module.exports = CommentRepositoryPostgres