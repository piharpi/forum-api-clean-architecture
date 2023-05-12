const CommentRepository = require('../CommentRepository')

describe('CommentRepository Interface', () => {
  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    expect(commentRepository.addComment({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    expect(commentRepository.checkIsCommentAvailable('')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    expect(commentRepository.findCommentById('')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    expect(commentRepository.deleteComment('')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    expect(commentRepository.verifyCommentOwner('')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
})