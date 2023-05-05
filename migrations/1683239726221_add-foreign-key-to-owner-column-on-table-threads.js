/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.addConstraint(
    'threads',
    'fk_threads.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE CASCADE',
  );
};

exports.down = pgm => {
  pgm.dropConstraint('threads', 'fk_threads.owner_users.id');
};
