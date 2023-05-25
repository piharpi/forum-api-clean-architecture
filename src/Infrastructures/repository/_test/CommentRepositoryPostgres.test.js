const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const pool = require("../../database/postgres/pool");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist add comment and return added comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const newComment = new NewComment({
        content: "ini sebuah komentar",
        owner: "user-123",
        thread: "thread-123",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(comments).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const newComment = new NewComment({
        content: "ini sebuah komentar",
        owner: "user-123",
        thread: "thread-123",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        newComment
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "ini sebuah komentar",
          owner: "user-123",
        })
      );
    });
  });

  describe("findCommentById function", () => {
    it("should return rows and rowCount when comment is available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = await commentRepositoryPostgres.findCommentById(
        "comment-123"
      );

      // Assert
      expect(result.rows).toHaveLength(1);
      expect(result.rowCount).toEqual(1);
    });

    it("should return empty rows array and zero rowCount when comment is NOT available", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = await commentRepositoryPostgres.findCommentById(
        "comment-123"
      );

      // Assert
      await expect(result.rows).toHaveLength(0);
      await expect(result.rowCount).toEqual(0);
    });
  });

  describe("checkIsCommentAvailable function", () => {
    it("should throw not found error when comment is not available", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkIsCommentAvailable("comment-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should resolve when comment is available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkIsCommentAvailable("comment-123")
      ).resolves.not.toThrowError();
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should resolve when comment owner id is equal with user id", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("comment-123", "user-123")
      ).resolves.not.toThrowError();
    });

    it("should throw AuthorizationError when comment owner id is not equal with user id", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("comment-123", "user-234")
      ).rejects.toThrowError(AuthorizationError);
    });
  });

  describe("deleteComment function", () => {
    it("should delete comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment("comment-123");

      const result = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(result).toHaveLength(1);
      expect(result[0].is_delete).toBeDefined();
      expect(result[0].is_delete).toEqual(true);
    });
  });

  describe("getDetailCommentByThreadId function", () => {
    it("should return detail comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({
        id: "user-1234",
        username: "mulut_netizen",
        fullname: "Netizen Kepo",
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        date: "2023-05-25T13:40:47.337Z",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-1234",
        owner: "user-1234",
        date: "2023-05-25T13:41:17.929Z",
        is_delete: true,
      });

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action
      const detailComment =
        await commentRepository.getAllDetailCommentByThreadId("thread-123");

      // Assert
      expect(detailComment).toHaveLength(2);

      expect(detailComment).toStrictEqual([
        new DetailComment({
          username: "harpi",
          content: "ini komentar",
          date: "2023-05-25T13:40:47.337Z",
          id: "comment-123",
          is_delete: false,
        }),
        new DetailComment({
          username: "mulut_netizen",
          content: "**komentar telah dihapus**`",
          date: "2023-05-25T13:41:17.929Z",
          id: "comment-1234",
          is_delete: true,
        }),
      ]);

      expect(detailComment[0].replies).toBeDefined();
      expect(detailComment[1].replies).toBeDefined();
    });
  });
});
