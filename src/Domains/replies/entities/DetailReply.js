class DetailReply {
  constructor(payload) {
    const { username, content, date, id, is_delete: isDelete } = payload;

    this._verifyPayload(payload);

    this.id = id;
    this.username = username;
    this.content = isDelete ? "**balasan telah dihapus**" : content;
    this.date = date;
  }

  _verifyPayload({ username, content, date, id, is_delete: isDelete }) {
    if (!id || !content || !username || !date) {
      throw new Error("DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof username !== "string" ||
      typeof date !== "string" ||
      typeof isDelete !== "boolean"
    ) {
      throw new Error("DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DetailReply;
