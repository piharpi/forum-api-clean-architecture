const InvariantError = require('../../Commons/exceptions/InvariantError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const DetailThread = require('../../Domains/threads/entities/DetailThread')

class ThreadRepositoryPostgres extends ThreadRepository{
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
  async verifyAvailableTitle(title) {
    const query = {
      text: 'SELECT title FROM threads WHERE title = $1;',
      values: [title],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('judul tidak tersedia');
    }
  }

  async addThread(addThread) {
    const { title, body, owner } = addThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner;',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async checkIsThreadAvailable(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1;',
      values:[threadId]
    }

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('thread tidak ada');
    }
  }

  async getDetailThreadById(threadId) {
    const query = {
      text: `SELECT t.id, title, body, date, u.username 
             FROM threads t JOIN users u 
             ON t.owner = u.id WHERE t.id = $1 LIMIT 1;`,
      values: [threadId],
    }

    const { rows } = await this._pool.query(query);

    return new DetailThread(rows[0]);
  }
}

module.exports = ThreadRepositoryPostgres