const DetailThread = require('../DetailThread');

describe('DetailThread Entity', () => {
  it('should create DetailThread entity correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'harpi',
      comments: [
        {
          id: 'comment-123',
          username: 'harpi',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment'
        },
        {
          id: 'comment-1234',
          username: 'mulut_netizen',
          date: '2021-08-08T07:22:33.555Z',
          content: '**komentar telah dihapus**'
        }
      ]
    }

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    const secondComment = detailThread.comments[1];
    expect(detailThread.id).toEqual('thread-123');
    expect(detailThread.title).toEqual('sebuah thread');
    expect(detailThread.body).toEqual('sebuah body thread');
    expect(detailThread.date).toEqual('2021-08-08T07:19:09.775Z');
    expect(detailThread.username).toEqual('harpi');

    expect(detailThread.comments).toHaveLength(2);
    expect(secondComment.id).toEqual('comment-1234');
    expect(secondComment.username).toEqual('mulut_netizen');
    expect(secondComment.date).toEqual('2021-08-08T07:22:33.555Z');
    expect(secondComment.content).toEqual('**komentar telah dihapus**');
  });

  it('should throw 400 error when payload not contains needed properties', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      username: 'harpi',
      comments: [
        {
          id: 'comment-123',
          username: 'harpi',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment'
        },
        {
          id: 'comment-1234',
          username: 'mulut_netizen',
          date: '2021-08-08T07:22:33.555Z',
          content: '**komentar telah dihapus**'
        }
      ]
    }

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrow('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw 400 error when payload not meet with data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'harpi',
      comments: ''
    }

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrow('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

});