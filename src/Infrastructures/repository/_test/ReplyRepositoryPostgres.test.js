const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NewReply = require("../../../Domains/replies/entities/NewReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const pool = require("../../database/postgres/pool");

describe("ReplyRepositoryPostgres", () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addReply function", () => {
    it("should persist add reply and return added reply correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const newReply = new NewReply({
        content: "ini sebuah balasan",
        owner: "user-123",
        thread: "thread-123",
        comment: "comment-123",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById("reply-123");
      expect(replies).toHaveLength(1);
    });

    it("should return added reply correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const newReply = new NewReply({
        content: "ini sebuah balasan",
        owner: "user-123",
        thread: "thread-123",
        comment: "comment-123",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: "ini sebuah balasan",
          owner: "user-123",
        })
      );
    });
  });

  describe("findReplyById function", () => {
    it("should return rows and rowCount when reply is available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const result = await replyRepositoryPostgres.findReplyById("reply-123");

      // Assert
      expect(result.rows).toHaveLength(1);
      expect(result.rowCount).toEqual(1);
    });

    it("should return empty rows array and zero rowCount when reply is NOT available", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const result = await replyRepositoryPostgres.findReplyById("reply-123");

      // Assert
      await expect(result.rows).toHaveLength(0);
      await expect(result.rowCount).toEqual(0);
    });
  });

  describe("checkIsReplyAvailable function", () => {
    it("should throw not found error when reply is not available", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.checkIsReplyAvailable("reply-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should resolve when reply is available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.checkIsReplyAvailable("reply-123")
      ).resolves.not.toThrowError();
    });
  });

  describe("verifyReplyOwner function", () => {
    it("should resolve when reply owner id is equal with user id", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner("reply-123", "user-123")
      ).resolves.not.toThrowError();
    });

    it("should throw AuthorizationError when reply owner id is not equal with user id", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner("reply-123", "user-234")
      ).rejects.toThrowError(AuthorizationError);
    });
  });

  describe("deleteReply function", () => {
    it("should delete reply correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply("reply-123");

      const result = await RepliesTableTestHelper.findRepliesById("reply-123");
      expect(result).toHaveLength(1);
      expect(result[0].is_delete).toBeDefined();
      expect(result[0].is_delete).toEqual(true);
    });
  });

  describe("getAllDetailReplyByThreadAndCommentId function", () => {
    it("should return detail reply correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({
        id: "user-1234",
        username: "mulut_netizen",
        fullname: "Netizen Kepo",
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ user: "user-1234" });
      await RepliesTableTestHelper.addReply({ id: "reply-1", is_delete: true });
      await RepliesTableTestHelper.addReply({
        id: "reply-2",
        owner: "user-1234",
      });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      // Action
      const detailReply =
        await replyRepository.getAllDetailReplyByThreadAndCommentId(
          "thread-123",
          "comment-123"
        );

      // Assert
      expect(detailReply).toHaveLength(2);

      const firstReply = detailReply[0];
      expect(firstReply.id).toEqual("reply-1");
      expect(firstReply.username).toEqual("harpi");
      expect(firstReply.content).toEqual("**balasan telah dihapus**");
      expect(firstReply.date).toBeDefined();

      const secondReply = detailReply[1];
      expect(secondReply.id).toEqual("reply-2");
      expect(secondReply.username).toEqual("mulut_netizen");
      expect(secondReply.content).toEqual("ini balasan");
      expect(secondReply.date).toBeDefined();
    });
  });
});
