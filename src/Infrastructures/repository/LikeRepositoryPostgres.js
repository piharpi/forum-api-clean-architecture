const LikeRepository = require("../../Domains/likes/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async likeableComment(newLike) {
    const id = `likes-${this._idGenerator()}`;
    const { commentId, userId } = newLike;

    const { rowCount } = await this._pool.query({
      text: `SELECT id FROM likes WHERE comment = $1 AND liked_by = $2`,
      values: [commentId, userId],
    });

    const deleteQuery = {
      text: `DELETE FROM likes WHERE comment = $1 AND liked_by = $2`,
      values: [commentId, userId],
    };

    const insertQuery = {
      text: `INSERT INTO likes VALUES($1, $2, $3)`,
      values: [id, commentId, userId],
    };

    const query = rowCount ? deleteQuery : insertQuery;

    await this._pool.query(query);
  }

  async getTotalLikes(commentIds) {
    const { rows } = await this._pool.query({
      text: `SELECT comment, CAST(COUNT(comment) AS INTEGER) as like_count FROM likes WHERE comment = ANY($1::text[]) GROUP BY comment ORDER BY like_count`,
      values: [commentIds],
    });

    return rows;
  }
}

module.exports = LikeRepositoryPostgres;
