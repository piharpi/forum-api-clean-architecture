const InvariantError = require('../../Commons/exceptions/InvariantError')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const AddedThread = require("../../Domains/threads/entities/AddedThread");

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
}

module.exports = ThreadRepositoryPostgres