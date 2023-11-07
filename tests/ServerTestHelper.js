/* istanbul ignore file */

const Jwt = require('@hapi/jwt')
const UsersTableTestHelper = require('./UsersTableTestHelper')
const AuthenticationTableTestHelper = require('./AuthenticationsTableTestHelper')

const ServerTestHelper = {
  async getAccessToken ({
    id = 'user-123',
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia'
  }) {
    const payloadUser = {
      id, username, password, fullname
    }

    await UsersTableTestHelper.addUser(payloadUser)

    const accessToken = Jwt.token.generate(
      payloadUser,
      process.env.ACCESS_TOKEN_KEY
    )
    const refreshToken = Jwt.token.generate(
      payloadUser,
      process.env.REFFRESH_TOKEN_KEY
    )

    await AuthenticationTableTestHelper.addToken(refreshToken)

    return accessToken
  },

  async cleanTable () {
    AuthenticationTableTestHelper.cleanTable()
    UsersTableTestHelper.cleanTable()
  }
}

module.exports = ServerTestHelper
