class DetailThread {
  constructor(payload) {
    const { id, title, body, date, username, comments } = payload;

    this._verifyPayload(payload);

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload({ id, title, body, date, username, comments }){
    if(!id || !title || !body || !date || !username ) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if(typeof id !== 'string'
      || typeof title !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || !Array.isArray(comments) ){
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = DetailThread