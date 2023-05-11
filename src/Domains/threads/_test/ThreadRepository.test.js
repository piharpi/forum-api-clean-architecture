const ThreadRepository = require('../ThreadRepository')

describe('ThreadRepository Interface', () => {
  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    expect(threadRepository.addThread({})).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    expect(threadRepository.verifyAvailableTitle('')).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    expect(threadRepository.checkIsThreadAvailable('')).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke abstract behavior', () =>  {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    expect(threadRepository.getDetailThreadById('')).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
})