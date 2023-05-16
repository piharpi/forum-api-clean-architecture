/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable("replies", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "TEXT",
      notNull: true,
    },
    thread: {
      type: "TEXT",
      notNull: true,
    },
    comment: {
      type: "TEXT",
      notNull: true,
    },
    date: {
      type: "TEXT",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    is_delete: {
      type: "BOOLEAN",
      notNull: true,
      default: false,
    },
  });

  pgm.addConstraint(
    "replies",
    "fk_replies.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE CASCADE"
  );

  pgm.addConstraint(
    "replies",
    "fk_replies.thread_threads.id",
    "FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE SET NULL ON UPDATE CASCADE"
  );

  pgm.addConstraint(
    "replies",
    "fk_replies.comment_comments.id",
    "FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE SET NULL ON UPDATE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("replies", "fk_replies.thread_threads.id");
  pgm.dropConstraint("replies", "fk_replies.owner_users.id");
  pgm.dropConstraint("replies", "fk_replies.comment_comments.id");
  pgm.dropTable("replies");
};
