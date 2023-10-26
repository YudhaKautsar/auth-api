const ClientError = require('../ClientError')
const AuthorizationError = require('../AuthorizationError')

describe('AuthroizationError', () => {
  it('should create Authorization correctly', () => {
    const authroizationError = new AuthorizationError('authorization error!')

    expect(authroizationError).toBeInstanceOf(AuthorizationError)
    expect(authroizationError).toBeInstanceOf(ClientError)
    expect(authroizationError).toBeInstanceOf(Error)

    expect(authroizationError.statusCode).toEqual(403)
    expect(authroizationError.message).toEqual('authorization error!')
    expect(authroizationError.name).toEqual('AuthorizationError')
  })
})
