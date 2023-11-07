const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')
const pool = require('../../database/postgres/pool')
const NewReply = require('../../../Domains/replies/entities/NewReply')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const InvariantError = require('../../../Commons/exceptions/InvariantError')

describe('ReplyRepositoryPostgres', () => {
  it('shuld be instance of ReplyRepository domain', () => {
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {})

    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepository)
  })

  describe('behavior test', () => {
    afterEach(async () => {
      await RepliesTableTestHelper.cleanTable()
      await CommentsTableTestHelper.cleanTable()
      await ThreadsTableTestHelper.cleanTable()
      await UsersTableTestHelper.cleanTable()
    })

    afterAll(async () => {
      await pool.end()
    })

    describe('addReply function', () => {
      it('should create new reply and return added reply correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' })
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          title: 'sebuah title thread',
          body: 'sebuah body thread',
          date: new Date(),
          ownerId: 'user-123'
        })
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          content: 'sebuah comment',
          owner: 'user-123',
          threadId: 'thread-123'
        })

        const newReply = new NewReply({
          content: 'sebuan balasan',
          owner: 'user-123',
          commentId: 'comment-123',
          threadId: 'thread-123'
        })

        const fakeIdGenerator = () => '123'
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(
          pool,
          fakeIdGenerator
        )

        // Action
        const addedReply = await replyRepositoryPostgres.addReply(newReply)

        // Assert
        const reply = await RepliesTableTestHelper.findReplyById('reply-123')

        expect(addedReply).toStrictEqual(
          new AddedReply({
            id: `reply-${fakeIdGenerator()}`,
            content: 'sebuah balasan',
            owner: 'user-123'
          })
        )
        expect(reply).toBeDefined()
      })
    })

    describe('getRepliesByThreadId function', () => {
      it('should return replies correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({})
        await ThreadsTableTestHelper.addThread({})
        await CommentsTableTestHelper.addComment({})
        await RepliesTableTestHelper.addReply({})
        await RepliesTableTestHelper.addReply({ id: 'reply-666' })
        await RepliesTableTestHelper.addReply({ id: 'reply-777' })

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

        // Action
        const replies = await replyRepositoryPostgres.getRepliesByThreadId(
          'thread-123'
        )

        // Assert
        expect(replies).toHaveLength(3)
      })
    })

    describe('verifyReplyPublisher function', () => {
      it('should throw NotFoundError when the reply not found', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

        // Action and Assert
        await expect(
          replyRepositoryPostgres.verifyReplyPublisher('reply-xxx', 'user-123')
        ).rejects.toThrowError(NotFoundError)
      })

      it('should throw AuthorizationError when the user is not publisher of the reply', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({})
        await ThreadsTableTestHelper.addThread({})
        await CommentsTableTestHelper.addComment({})
        await RepliesTableTestHelper.addReply({})

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

        // Action and Assert
        await expect(
          replyRepositoryPostgres.verifyReplyPublisher('reply-123', 'user-xxx')
        ).rejects.toThrowError(AuthorizationError)
      })

      it('should resolve when the user is publisher of the reply', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({})
        await ThreadsTableTestHelper.addThread({})
        await CommentsTableTestHelper.addComment({})
        await RepliesTableTestHelper.addReply({})

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

        // Action and Assert
        await expect(
          replyRepositoryPostgres.verifyReplyPublisher('reply-123', 'user-123')
        ).resolves.not.toThrowError(InvariantError)
      })
    })

    describe('deleteReplyById function', () => {
      it('should throw NotFoundError when the reply not found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({})
        await ThreadsTableTestHelper.addThread({})
        await CommentsTableTestHelper.addComment({})
        await RepliesTableTestHelper.addReply({})

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

        // Action and Assert
        await expect(
          replyRepositoryPostgres.deleteReplyById('reply-xxx')
        ).rejects.toThrowError(NotFoundError)
      })
    })

    describe('verifyExistingReply function', () => {
      it('should throw NotFoundError when the reply not found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({})
        await ThreadsTableTestHelper.addThread({})
        await CommentsTableTestHelper.addComment({})
        await RepliesTableTestHelper.addReply({})

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

        // Action and Assert
        await expect(
          replyRepositoryPostgres.verifyExistingReply('reply-xxx')
        ).rejects.toThrowError(NotFoundError)
      })

      it('should resolve when the reply is found', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({})
        await ThreadsTableTestHelper.addThread({})
        await CommentsTableTestHelper.addComment({})
        await RepliesTableTestHelper.addReply({})

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

        // Action and Assert
        await expect(
          replyRepositoryPostgres.verifyExistingReply('reply-123')
        ).resolves.not.toThrowError(InvariantError)
      })
    })
  })
})
