const autoBind = require('auto-bind')
const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    autoBind(this)
  }

  async postThreadHandler (request, h) {
    const { id } = request.auth.credentials

    const threadUseCase = this._container.getInstance(ThreadUseCase.name)
    const addThread = await threadUseCase.addThread(request.payload, id)

    const response = h.response({
      status: 'success',
      data: {
        addThread
      }
    })

    response.code(201)
    return response
  }

  async getThreadHandler (request, h) {
    const { threadId: id } = request.params

    const useCaseParam = { threadId: id }

    const threadUseCase = this._container.getInstance(ThreadUseCase.name)
    const thread = await threadUseCase.getThread(useCaseParam)

    const response = h.response({
      status: 'success',
      data: {
        thread
      }
    })

    response.code(200)
    return response
  }
}

module.exports = ThreadsHandler
