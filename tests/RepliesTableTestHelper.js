/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool')

const RepliesTableTestHelper = {
  async addReply ({
    id = 'reply-123',
    threadId = 'thread-123',
    commentId = 'comment-123',
    owner = 'user-123',
    content = 'sebuah balasan'
  }) {
    const query = {
      text: 'INSERT INTO replies(id, thread_id, comment_id, publisher, content) VALUES($1, $2, $3, $4, $5)',
      values: [id, threadId, commentId, owner, content]
    }

    await pool.query(query)
  },

  async findReplyById (id) {
    const query = {
      text: `SELECT R.id, R.comment_id, R.content, R.date, R.is_delete, U.username
            FROM replies R
            INNER JOIN users U ON R.publisher = U.id
            WHERE R.id = $1`,
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async deleteReplyById (id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id]
    }
    await pool.query(query)
  },

  async cleanTable () {
    await pool.query('DELETE FROM replies WHERE 1=1')
  }
}

module.exports = RepliesTableTestHelper
