const DetailComment = require('../DetailComment')

describe('DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
      content: 'sebuah comment'
    }

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
  // Arrange
    const payload = {
      id: 999,
      username: [],
      date: 2023,
      replies: 'sebuah balasan',
      content: {},
      isDelete: 'delete'
    }

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create detailComment object correctly', () => {
  // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2023-11-01T00:45:45.775Z',
      replies: [],
      content: 'sebuah comment',
      isDelete: false
    }

    // Action
    const detailComment = new DetailComment(payload)

    // Assert
    expect(detailComment.id).toEqual(payload.id)
    expect(detailComment.username).toEqual(payload.username)
    expect(detailComment.date).toEqual(payload.date)
    expect(detailComment.replies).toEqual(payload.replies)
    expect(detailComment.content).toEqual(payload.content)
    expect(detailComment.isDelete).toEqual(payload.isDelete)
  })
})
