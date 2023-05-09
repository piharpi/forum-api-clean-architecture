class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.thread = payload.thread;
    this.owner = payload.owner
  }

  _verifyPayload(payload) {
    const { thread, content, owner } = payload

    if(!thread || !content || !owner) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if(typeof thread !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = NewComment