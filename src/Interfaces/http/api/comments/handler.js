const autoBind = require('auto-bind')
const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase')

class CommentsHandler {
  constructor (container) {
    this._container = container

    autoBind(this)
  }

  async postCommentHandler (request, h) {
    const { id } = request.auth.credentials

    const commentUseCase = this._container.getInstance(
      CommentUseCase.name
    )

    const addedComment = await commentUseCase.execute(
      request.params,
      request.payload,
      id
    )

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })

    response.code(201)
    return response
  }

  async deleteCommentHandler (request, h) {
    const { id } = request.auth.credentials

    const commentUseCase = this._container.getInstance(
      CommentUseCase.name
    )

    await commentUseCase.execute(request.params, id)

    const response = h.response({
      status: 'success'
    })

    response.code(200)
    return response
  }
}

module.exports = CommentsHandler
