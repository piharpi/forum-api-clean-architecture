exports.up = (pgm) => {
  pgm.createTable("likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    comment: {
      type: "TEXT",
      notNull: true,
    },
    liked_by: {
      type: "TEXT",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "likes",
    "fk_likes.comment_comments.id",
    "FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE ON UPDATE CASCADE"
  );

  pgm.addConstraint(
    "likes",
    "fk_likes.liked_by_users.id",
    "FOREIGN KEY(liked_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("likes", "fk_likes.comment_comments.id");
  pgm.dropConstraint("likes", "fk_likes.liked_by_users.id");
  pgm.dropTable("likes");
};
