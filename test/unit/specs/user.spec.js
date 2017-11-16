import { authenticate, register, auth, disconnect, unregister } from '@/services/firebase'

let random = Math.floor(Math.random() * 99999)

describe('user', () => {
  it('cannot login with nonexistent email', async () => {
    try {
      await authenticate(random + '@testing.com', 'password')
    } catch (error) {
      return error.code.should.equal('auth/user-not-found')
    }
    return expect.fail()
  })
})

describe('user', () => {
  it('can register with nonexistent email', async () => {
    try {
      await register(random + '@testing.com', 'password')
    } catch (error) {
      return expect.fail()
    }
  })
})

describe('user', () => {
  it('cannot register with existent email', async () => {
    try {
      await register(random + '@testing.com', 'password')
    } catch (error) {
      return error.code.should.equal('auth/email-already-in-use')
    }
    return expect.fail()
  })
})

describe('user', () => {
  it('cannot login with bad credentials', async () => {
    try {
      await authenticate(random + '@testing.com', 'invalidpassword')
    } catch (error) {
      return error.code.should.equal('auth/wrong-password') || error.code.should.equal('auth/invalid-credentials')
    }
    return expect.fail()
  })
})

describe('user', () => {
  it('can login with valid credentials', async () => {
    try {
      await authenticate(random + '@testing.com', 'password')
    } catch (error) {
      return expect.fail()
    }
  })
})

describe('user', () => {
  it('can change the password', async () => {
    try {
      await authenticate(random + '@testing.com', 'password')
      await auth.currentUser.updatePassword('updatedpassword')
    } catch (error) {
      return expect.fail()
    }
  })
})

describe('user', () => {
  it('cannot login with old password', async () => {
    try {
      await authenticate(random + '@testing.com', 'password')
    } catch (error) {
      return error.code.should.equal('auth/wrong-password')
    }
    return expect.fail()
  })
})

describe('user', () => {
  it('can login with new changed password', async () => {
    try {
      await authenticate(random + '@testing.com', 'updatedpassword')
    } catch (error) {
      return expect.fail()
    }
  })
})

describe('user', () => {
  it('can log out if is logged in', async () => {
    try {
      await authenticate(random + '@testing.com', 'updatedpassword')
      await disconnect()
    } catch (error) {
      return expect.fail()
    }
  })
})

describe('user', () => {
  it('can be deleted if exists', async () => {
    try {
      await authenticate(random + '@testing.com', 'updatedpassword')
      await auth.currentUser.delete()
    } catch (error) {
      return expect.fail()
    }
  })
})

describe('user', () => {
  it('cannot be deleted if does not exists', async () => {
    try {
      await authenticate(random + '@testing.com', 'updatedpassword')
      await unregister()
    } catch (error) {
      return error.code.should.equal('auth/user-not-found')
    }
    return expect.fail()
  })
})
