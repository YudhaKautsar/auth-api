const NewThread = require('../../../Domains/threads/entities/NewThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const DetailThread = require('../../../Domains/threads/entities/DetailThread')
const DetailComment = require('../../../Domains/comments/entities/DetailComment')
const DetailReply = require('../../../Domains/replies/entities/DetailReply')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const ThreadUseCase = require('../ThreadUseCase')

describe('ThreadUseCase', () => {
  describe('addThread', () => {
    it('should orchestrating the add thread action correctly', async () => {
      // Arrange
      const useCasePayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread'
      }

      const userIdFromAccessToken = 'user-123'

      const expectedAddedThread = new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: userIdFromAccessToken
      })

      // Creating dependecy of use case
      const mockThreadRepository = new ThreadRepository()
      const mockCommentRepository = new CommentRepository()
      const mockReplyRepository = new ReplyRepository()

      // Mocking needed function
      mockThreadRepository.addThread = jest.fn(() => Promise.resolve(
        new AddedThread({
          id: 'thread-123',
          title: useCasePayload.title,
          owner: userIdFromAccessToken
        })
      ))

      // Creating use case instance
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        CommentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository
      })

      // Action
      const addedThread = await threadUseCase.addThread(
        useCasePayload,
        userIdFromAccessToken
      )

      // Assert
      expect(addedThread).toStrictEqual(expectedAddedThread)
      expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread(useCasePayload), userIdFromAccessToken)
    })
  })
  describe('getThread', () => {
    it('should orchestrating the get thread action correctly', async () => {
      // Arrange
      const useCaseParam = {
        threadId: 'thread-123'
      }

      const retrievedThread = [
        new DetailThread({
          id: 'thread-123',
          title: 'sebuah thread',
          body: 'sebuah body thread',
          date: '2023-11-01T00:45:45.775Z',
          username: 'dicoding',
          comments: []
        })
      ]

      const retrievedComments = [
        new DetailComment({
          id: 'comment-123',
          username: 'Kautsar',
          date: '2023-11-01T00:45:45.775Z',
          replies: [],
          content: 'sebuah komentar kautsar',
          isDelete: true
        }),
        new DetailComment({
          id: 'comment-999',
          username: 'Yudha',
          date: '2023-11-01T00:45:45.775Z',
          replies: [],
          content: 'sebuah komentar yudha',
          isDelete: false
        })
      ]

      const retrievedReplies = [
        new DetailReply({
          id: 'reply-123',
          commentId: 'comment-123',
          content: 'sebuah balasan pertama',
          date: '2023-11-01T00:45:45.775Z',
          username: 'userPertama',
          isDelete: false
        }),
        new DetailReply({
          id: 'reply-666',
          commentId: 'comment-999',
          content: 'sebuah balasan kedua',
          date: '2023-11-01T00:45:45.775Z',
          username: 'userKedua',
          isDelete: true
        })
      ]

      const detailReplies = [
        {
          ...retrievedReplies[0],
          content: retrievedReplies[0].isDelete
            ? '**balasan telah dihapus**'
            : retrievedReplies[0].content
        },
        {
          ...retrievedReplies[1],
          content: retrievedReplies[1].isDelete
            ? '**balasan telah dihapus**'
            : retrievedReplies[1].content
        }
      ]

      const {
        commentId: commentIdReplyA,
        isDelete: isDeleteReplyA,
        ...filteredDetailReplyA
      } = detailReplies[0]
      const {
        commentId: commentIdReplyB,
        isDelete: isDeleteReplyB,
        ...filteredDetailReplyB
      } = detailReplies[1]

      const detailComments = [
        {
          ...retrievedComments[0],
          replies: [filteredDetailReplyA],
          content: retrievedComments[0].isDelete
            ? '**komentar telah dihapus**'
            : retrievedComments[0].content
        },
        {
          ...retrievedComments[1],
          replies: [filteredDetailReplyB],
          content: retrievedComments[1].isDelete
            ? '**komentar telah dihapus**'
            : retrievedComments[1].content
        }
      ]

      const {
        isDelete: isDeleteCommentA, ...filteredDetailCommentA
      } = detailComments[0]

      const {
        isDelete: isDeleteCommentB, ...filteredDetailCommentB
      } = detailComments[1]

      const expectedDetailThread = {
        ...retrievedThread[0],
        comments: [
          { ...filteredDetailCommentA },
          { ...filteredDetailCommentB }
        ]
      }

      const mockThreadRepository = new ThreadRepository()
      const mockCommentRepository = new CommentRepository()
      const mockReplyRepository = new ReplyRepository()

      mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(retrievedThread))
      mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(detailComments))
      mockReplyRepository.getRepliesByThreadId = jest.fn(() => Promise.resolve(detailReplies))

      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository
      })

      // Action
      const useCaseResult = await threadUseCase.getThread(useCaseParam)

      // Assert
      expect(useCaseResult).toStrictEqual(expectedDetailThread)
      expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam.threadId)
      expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId)
      expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCaseParam.threadId)
    })
  })
})
