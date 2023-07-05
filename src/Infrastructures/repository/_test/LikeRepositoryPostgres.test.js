const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");
const pool = require("../../database/postgres/pool");

describe("LikeRepositoryPostgres", () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("likeableComment function", () => {
    it("should like comment properly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // stub!
      const fakeIdGenerator = () => "123";

      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // // Action
      await likeRepositoryPostgres.likeableComment({
        commentId: "comment-123",
        userId: "user-123",
      });

      // // Assert
      const likeCount = await LikesTableTestHelper.findLikesById("likes-123");
      expect(likeCount).toHaveLength(1);
    });

    it("should dislike comment properly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLikes({});

      // stub!
      const fakeIdGenerator = () => "123";

      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await likeRepositoryPostgres.likeableComment({
        commentId: "comment-123",
        userId: "user-123",
      });

      // Assert
      const likeCount = await LikesTableTestHelper.findLikesById("likes-123");
      expect(likeCount).toHaveLength(0);
    });
  });

  describe("getTotalLikes function", () => {
    it("should return total likes", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({
        id: "user-1234",
        username: "john",
        fullname: "John Doe",
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({ id: "comment-1234" });
      await LikesTableTestHelper.addLikes({});
      await LikesTableTestHelper.addLikes({
        id: "likes-1234",
        userId: "user-1234",
      });
      await LikesTableTestHelper.addLikes({
        id: "likes-1235",
        userId: "user-1234",
        commentId: "comment-1234",
      });

      const likeRepository = new LikeRepositoryPostgres(pool, () => "123");

      // Action
      const likeCount = await likeRepository.getTotalLikes([
        "comment-123",
        "comment-1234",
      ]);

      // Assert
      expect(likeCount).toHaveLength(2);
      expect(likeCount[0].like_count).toEqual(1);
      expect(likeCount[1].like_count).toEqual(2);
    });
  });
});
