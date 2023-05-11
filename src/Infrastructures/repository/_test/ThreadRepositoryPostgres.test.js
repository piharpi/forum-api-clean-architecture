const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableTitle function', () => {
    it('should throw InvariantError when title not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({}); // memasukan user baru dengan username dicoding
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableTitle('Sebuah judul thread')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when title available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableTitle('Sebuah judul thread unik')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({})
      const addThread = new AddThread({
        title: 'Ini judul thread',
        body: 'Isi thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({})
      const addThread = new AddThread({
        title: 'Ini judul thread',
        body: 'Isi thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'Ini judul thread',
        owner: 'user-123',
      }));
    });
  });

  describe('checkIsThreadExist function', () => {
    it('should throw error not found when thread not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.checkIsThreadAvailable('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should resolve when thread is exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(threadRepositoryPostgres.checkIsThreadAvailable('thread-123')).resolves.not.toThrowError();
    });
  })

  describe('getDetailThreadById', () => {
    it('should return detail thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threadRepository  = new ThreadRepositoryPostgres(pool, {})

      // Action
      const detailThread = await threadRepository.getDetailThreadById('thread-123');

      // Assert
      expect(detailThread.id).toEqual('thread-123');
      expect(detailThread.date).toBeDefined();
      expect(detailThread.title).toEqual('Sebuah judul thread');
      expect(detailThread.body).toEqual('Isi thread');
      expect(detailThread.username).toEqual('harpi');
      expect(detailThread.comments).toBeDefined();
    });
  })
});