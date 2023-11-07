const NewComment = require('../NewComment')

describe('NewComment entities', () => {
  it('should throw error when paylaod did not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123
    }

    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create NewComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment'
    }

    // Action
    const newComment = new NewComment(payload)

    // Assert
    expect(newComment.content).toEqual(payload.content)
  })
})
