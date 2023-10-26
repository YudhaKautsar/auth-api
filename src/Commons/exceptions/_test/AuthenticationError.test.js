const AuthenticationError = require('../AuthenticationError')
const ClientError = require('../ClientError')

describe('AutheticationError', () => {
  it('should create AutheticationError correctly', () => {
    const authenticationError = new AuthenticationError('authentication error!')

    expect(authenticationError).toBeInstanceOf(AuthenticationError)
    expect(authenticationError).toBeInstanceOf(ClientError)
    expect(authenticationError).toBeInstanceOf(Error)

    expect(authenticationError.statusCode).toEqual(401)
    expect(authenticationError.message).toEqual('authentication error!')
    expect(authenticationError.name).toEqual('AuthenticationError')
  })
})
