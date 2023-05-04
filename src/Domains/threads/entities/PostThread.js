const {type} = require("@hapi/hapi/lib/headers");

class PostThread {
  constructor(payload) {
    this.verifyPayload(payload);

    this.title = payload.title;
    this.body = payload.body;
  }

  verifyPayload(payload) {
    const { title, body } = payload

    if(!title || !body) {
      throw new Error('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if(typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = PostThread