class ToggleLike {
  constructor(payload) {
    this._verifyPayload(payload);

    this.commentId = payload.commentId;
    this.userId = payload.userId;
  }

  // eslint-disable-next-line consistent-return
  _verifyPayload(payload) {
    const { commentId, userId } = payload;

    if (!commentId || !userId) {
      throw new Error("TOGGLE_LIKE.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof commentId !== "string" || typeof userId !== "string") {
      throw new Error("TOGGLE_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = ToggleLike;
