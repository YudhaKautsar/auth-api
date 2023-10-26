const bcrypt = require('bcrypt')
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError')
const BcryptEncryptionHelper = require('../BcryptPasswordHash')

describe('BcryptPasswordHelper', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash')
      const bcryptPasswordHash = new BcryptEncryptionHelper(bcrypt)

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password')

      // Assert
      expect(typeof encryptedPassword).toEqual('string')
      expect(encryptedPassword).not.toEqual('plain_password')
      expect(spyHash).toBeCalledWith('plain_password', 10) // 10 adalah nilai saltRound default untuk BcryptEncryptionHelper
    })
  })

  describe('comparePassword function', () => {
    it('should throw AuthenticationError if password not match', async () => {
      // Arrange
      const bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt)

      // Act & Assert
      await expect(bcryptEncryptionHelper.comparePassword('plain_password', 'encrypted_password'))
        .rejects
        .toThrow(AuthenticationError)
    })

    it('should not return AuthenticationError if password match', async () => {
      // Arrange
      const bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt)
      const plaintPassword = 'secret'
      const encryptedPassword = await bcryptEncryptionHelper.hash(plaintPassword)

      // Act & Assert
      await expect(bcryptEncryptionHelper.comparePassword(plaintPassword, encryptedPassword))
        .resolves.not.toThrow(AuthenticationError)
    })
  })
})
