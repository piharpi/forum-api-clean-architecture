const ReplyRepository = require('../ReplyRepository')

describe('ReplyRepository Interface', () => {
  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action & Assert
    expect(replyRepository.addReply({})).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action & Assert
    expect(replyRepository.checkIsReplyAvailable('')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action & Assert
    expect(replyRepository.findReplyById('')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action & Assert
    expect(replyRepository.deleteReply('')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action & Assert
    expect(replyRepository.verifyReplyOwner('')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action & Assert
    expect(replyRepository.getAllDetailReplyByThreadAndCommentId('', '')).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
})