const NewComment = require('../NewComment');

describe('NewComment Entity',  () => {
  it('should throw 400 error when payload not contains needed properties', () => {
    // Arrange
    const payload = {
      content: 'Example Comment Content',
      owner: 'user-123'
    }

    // Action & Assert
    expect(() => new NewComment(payload)).toThrow('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw 400 error when payload not meet with data type specification', () => {
    // Arrange
    const payload = {
      content: true,
      thread: 'thread-123',
      owner: 'user-123'
    }

    // Action & Assert
    expect(() => new NewComment(payload)).toThrow('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment entity correctly', () => {
    // Arrange
    const payload = {
      content: 'Example Comment Content',
      thread: 'thread-123',
      owner: 'user-123'
    }

    // Action
    const postComment = new NewComment(payload);

    // Assert
    expect(postComment).toBeInstanceOf(NewComment);
    expect(postComment.content).toEqual('Example Comment Content');
    expect(postComment.thread).toEqual('thread-123');
    expect(postComment.owner).toEqual('user-123');
  });
});