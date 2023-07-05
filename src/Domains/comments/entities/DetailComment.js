const { type } = require("@hapi/hapi/lib/headers");

class DetailComment {
  constructor(payload) {
    const {
      username,
      content,
      date,
      id,
      replies,
      is_delete: isDelete,
      like_count: likeCount,
    } = payload;

    this._verifyPayload(payload);

    this.id = id;
    this.username = username;
    this.content = isDelete ? "**komentar telah dihapus**" : content;
    this.replies = replies || [];
    this.date = date;
    this.likeCount = likeCount || 0;
  }

  _verifyPayload({
    username,
    content,
    date,
    id,
    is_delete: isDelete,
    replies = [],
    like_count: likeCount = 0,
  }) {
    if (!id || !content || !username || !date) {
      throw new Error("DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof username !== "string" ||
      typeof date !== "string" ||
      typeof isDelete !== "boolean" ||
      !Array.isArray(replies) ||
      typeof likeCount !== "number"
    ) {
      throw new Error("DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DetailComment;
