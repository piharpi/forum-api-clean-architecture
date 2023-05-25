/* eslint-disable camelcase */
/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
  async addReply({
    id = "reply-123",
    content = "ini balasan",
    thread = "thread-123",
    owner = "user-123",
    date = new Date().toISOString(),
    comment = "comment-123",
    is_delete = false,
  }) {
    const query = {
      text: "INSERT INTO replies(id, content, owner, thread, comment, date, is_delete) VALUES($1, $2, $3, $4, $5, $6, $7);",
      values: [id, content, owner, thread, comment, date, is_delete],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM replies WHERE 1=1");
  },
};

module.exports = RepliesTableTestHelper;
