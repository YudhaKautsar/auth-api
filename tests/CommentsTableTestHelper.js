/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentsTableTestHelper = {
  async addComment ({
    id = 'comment-123',
    threadId = 'thread-123',
    owner = 'user-123',
    content = 'sebuah komentar'
  }) {
    const query = {
      text: 'INSERT INTO comments(id, thread_id, publisher, content) VALUES($1, $2, $3, $4)',
      values: [id, threadId, owner, content]
    }

    await pool.query(query)
  },

  async findCommentById (id) {
    const query = {
      text: `SELECT C.id, C.date, C.content, C.is_delete, U.username
        FROM comments C
        INNER JOIN users U ON C.publisher = U.id
        WHERE C.id = $1`,
      values: [id]
    }

    const result = await pool.query(query)

    return result.rows
  },

  async deleteCommentById (id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id]
    }

    await pool.query(query)
  },

  async cleanTable () {
    await pool.query('DELETE FROM comments WHERE 1=1')
  }
}

module.exports = CommentsTableTestHelper
