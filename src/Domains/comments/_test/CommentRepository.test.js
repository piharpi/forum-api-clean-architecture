const CommentRepository = require('../CommentRepository')

describe('CommentRepository Interface', () => {
  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    expect(commentRepository.addComment({})).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
})