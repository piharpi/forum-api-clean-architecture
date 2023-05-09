/* eslint-disable camelcase */
exports.up = pgm => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'TEXT',
      notNull: true,
    },
    thread: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    }
  });

  pgm.addConstraint(
    "comments",
    "fk_comments.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE CASCADE"
  );

  pgm.addConstraint(
    "comments",
    "fk_comments.thread_threads.id",
    "FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE NO ACTION ON UPDATE CASCADE"
  );
};

exports.down = pgm => {
  pgm.dropConstraint("comments", "fk_comments.thread_threads.id");
  pgm.dropConstraint("comments", "fk_comments.owner_users.id");
  pgm.dropTable('comments')
};
