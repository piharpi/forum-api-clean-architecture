const PostThread = require('../PostThread');

describe('PostThread Entity',  () => {
  it('should throw 400 error when payload not contains needed properties', () => {
    // Arrange
    const payload = {
      title: 'Example Thread Title'
    }

    // Action & Assert
    expect(() => new PostThread(payload)).toThrow('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw 400 error when payload not meet with data type specification', () => {
    // Arrange
    const payload = {
      title: 'Example Thread Title',
      body: true
    }

    // Action & Assert
    expect(() => new PostThread(payload)).toThrow('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create PostThread entity correctly', () => {
    // Arrange
    const payload = {
      title: 'Example Thread Title',
      body: 'The Body of thread'
    }

    // Action
    const postThread = new PostThread(payload);

    // Assert
    expect(postThread).toBeInstanceOf(PostThread);
    expect(postThread.title).toEqual('Example Thread Title');
    expect(postThread.body).toEqual('The Body of thread');
  });
});