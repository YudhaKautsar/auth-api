const DetailThread = require('../DetailThread')

describe('DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 'sebuah body thread'
    }

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 25,
      title: 'sebuah thread',
      body: [],
      date: 2023,
      username: {},
      comments: 'comment'
    }

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create detailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2023-11-01T00:45:45.775Z',
      username: 'dicoding',
      comments: []
    }

    // Action
    const detailThread = new DetailThread(payload)

    // Assert
    expect(detailThread.id).toEqual(payload.id)
    expect(detailThread.title).toEqual(payload.title)
    expect(detailThread.body).toEqual(payload.body)
    expect(detailThread.date).toEqual(payload.date)
    expect(detailThread.username).toEqual(payload.username)
    expect(detailThread.comments).toEqual(payload.comments)
  })
})
