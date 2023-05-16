class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.thread = payload.thread;
    this.comment = payload.comment;
    this.owner = payload.owner;
  }

  _verifyPayload(payload) {
    const { thread, content, comment, owner } = payload;

    if (!thread || !content || !owner || !comment) {
      throw new Error("NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof thread !== "string" ||
      typeof content !== "string" ||
      typeof owner !== "string" ||
      typeof comment !== "string"
    ) {
      throw new Error("NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = NewReply;
