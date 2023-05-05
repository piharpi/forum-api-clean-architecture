const AddedThread = require("../AddedThread");

describe('AddedThread entity', () => {
  it('should throw 400 error when payload not contains needed properties', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Example Thread Title'
    }

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw 400 error when payload not meet with data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Example Thread Title',
      owner: true,
    }

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create PostThread entity correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Example Thread Title',
      owner: 'user-123'
    }

    // Action
    const postThread = new AddedThread(payload);

    // Assert
    expect(postThread).toBeInstanceOf(AddedThread);
    expect(postThread.id).toEqual('thread-123');
    expect(postThread.title).toEqual('Example Thread Title');
    expect(postThread.owner).toEqual('user-123');

  });
});
