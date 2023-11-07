const DetailReply = require('../DetailReply')

describe('DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
      content: 'sebuah balasan'
    }

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data specification', () => {
    // Arrange
    const payload = {
      id: 999,
      commentId: [],
      content: true,
      date: 2023,
      username: 'dicoding',
      isDelete: false
    }

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError(
      'DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create detailReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
      date: '2023-11-01T00:45:45.775Z',
      username: 'dicoding',
      isDelete: false
    }

    // Action
    const detailReply = new DetailReply(payload)

    // Assert
    expect(detailReply.id).toEqual(payload.id)
    expect(detailReply.commentId).toEqual(payload.commentId)
    expect(detailReply.content).toEqual(payload.content)
    expect(detailReply.date).toEqual(payload.date)
    expect(detailReply.username).toEqual(payload.username)
    expect(detailReply.isDelete).toEqual(payload.isDelete)
  })
})
