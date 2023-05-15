const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AddedReply = require('../../Domains/replies/entities/AddedReply')
const DetailReply = require('../../Domains/replies/entities/DetailReply')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const id = `reply-${this._idGenerator()}`;
    const { content, owner, thread, comment } = newReply;

    const query =  {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner;',
      values: [id, content, owner, thread, comment]
    }

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1;',
      values: [replyId]
    }

    await this._pool.query(query)
  }

  async findReplyById(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND is_delete = false;',
      values: [replyId]
    }

    const { rows, rowCount } = await this._pool.query(query);

    return { rows, rowCount };
  }

  async checkIsReplyAvailable(replyId) {
    const { rowCount : isAvailable } = await this.findReplyById(replyId);

    if (!isAvailable) {
      throw new NotFoundError('reply tidak ada');
    }
  }

  async verifyReplyOwner(replyId, ownerId)  {
    const { rows } = await this.findReplyById(replyId)

    const replyOwnerId = rows[0].owner;

    if(replyOwnerId !== ownerId) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini')
    }
  }

  async getAllDetailReplyByThreadAndCommentId(threadId, commentId){
    const query = {
      text: `SELECT r.id, u.username, r.content, r.date, r.is_delete 
             FROM replies r JOIN users u ON u.id = r.owner 
             JOIN threads t ON t.id = r.thread
             JOIN comments c ON c.id = r.comment 
             WHERE r.thread = $1 AND r.comment = $2 ORDER BY r.date ASC`,
      values: [threadId, commentId]
    }

    const { rows } = await this._pool.query(query);
    return rows.map((reply) => new DetailReply(reply));
  }
}

module.exports = ReplyRepositoryPostgres