const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/commnets/{commentId}/replies',
    handler: handler.postReplyHandler,
    options: {
      auth: 'forumapp_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/commnets/{commentId}/replies/{replyId}',
    handler: handler.deleteReplyHandler,
    options: {
      auth: 'forumapp_jwt'
    }
  }
]

module.exports = routes
