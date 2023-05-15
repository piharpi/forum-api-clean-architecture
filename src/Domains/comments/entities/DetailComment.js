class DetailComment {
  constructor(payload) {
    const { username, content, date, id, replies, is_delete } = payload;

    this._verifyPayload(payload);

    this.id = id;
    this.username = username;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
    this.replies = replies || [];
    this.date = date;
  }

  _verifyPayload({ username, content, date, id, is_delete, replies = [] }) {
    if(!id || !content || !username || !date) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if(typeof id !== 'string'
      || typeof content !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || typeof is_delete !== 'boolean'
      || !Array.isArray(replies)){
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = DetailComment