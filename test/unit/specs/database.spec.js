// import { database } from '@/services/firebase'
import { authenticate } from '@/services/firebase'
/*
describe('database', () => {
  it('factions collection length should be 5', async () => {
    const items = await database.ref('factions').once('value')
    items.numChildren().should.equal(5)
  })
})

describe('database', () => {
  it('artifacts collection length should be 20', async () => {
    const items = await database.ref('artifacts').once('value')
    items.numChildren().should.equal(20)
  })
})

describe('database', () => {
  it('spells collection length should be 100', async () => {
    const items = await database.ref('spells').once('value')
    items.numChildren().should.equal(100)
  })
})

describe('database', () => {
  it('units collection length should be 50', async () => {
    const items = await database.ref('units').once('value')
    items.numChildren().should.equal(50)
  })
})

describe('database', () => {
  it('gods collection length should be 5', async () => {
    const items = await database.ref('gods').once('value')
    items.numChildren().should.equal(5)
  })
})

describe('database', () => {
  it('buildings collection length should be 10', async () => {
    const items = await database.ref('buildings').once('value')
    items.numChildren().should.equal(10)
  })
})

describe('database', () => {
  it('heroes collection length should be 15', async () => {
    const items = await database.ref('heroes').once('value')
    items.numChildren().should.equal(15)
  })
})

describe('database', () => {
  it('places collection length should be 5', async () => {
    const items = await database.ref('places').once('value')
    items.numChildren().should.equal(0) // TODO EXPANSION
  })
})
*/
// let random = Math.floor(Math.random() * 99999)

describe('user', () => {
  it('cannot login with nonexistent email', async () => {
    try {
      await authenticate('prueba@prueba.com', 'prueba')
      expect.fail()
    } catch (error) {
      error.code.should.equal('auth/user-not-found')
    }
  })
})

/*
describe('user', () => {
  it('can register with nonexistent email', () => {
    return register(random + '@testing.com', 'password')
    .then(() => {
      return true
    })
    .catch(() => {
      return expect.fail()
    })
  })
})

describe('user', () => {
  it('cannot register with existent email', () => {
    return register(random + '@testing.com', 'password')
    .then(() => {
      return expect.fail()
    })
    .catch(() => {
      return true
    })
  })
})

describe('user', () => {
  it('cannot login with bad credentials', () => {
    return authenticate(random + '@testing.com', 'invalidpassword')
    .then(() => {
      return expect.fail()
    })
    .catch(error => {
      return error.code.should.equal('auth/wrong-password') || error.code.should.equal('auth/invalid-credentials')
    })
  })
})

describe('user', () => {
  it('can login with valid credentials', () => {
    return authenticate(random + '@testing.com', 'password')
    .then(() => {
      return true
    })
    .catch(() => {
      return expect.fail()
    })
  })
})

describe('user', () => {
  it('can change the password', () => {
    return authenticate(random + '@testing.com', 'password')
    .then(() => {
      return auth.currentUser.updatePassword('updatedpassword')
      .then(() => {
        return true
      })
      .catch(() => {
        return expect.fail()
      })
    })
    .catch(() => {
      return expect.fail()
    })
  })
})

describe('user', () => {
  it('cannot login with old password', () => {
    return authenticate(random + '@testing.com', 'password')
    .then(() => {
      return expect.fail()
    })
    .catch(() => {
      return true
    })
  })
})

describe('user', () => {
  it('can login with new changed password', () => {
    return authenticate(random + '@testing.com', 'updatedpassword')
    .then(() => {
      return true
    })
    .catch(() => {
      return expect.fail()
    })
  })
})

describe('user', () => {
  it('can log out if is logged in', () => {
    return authenticate(random + '@testing.com', 'updatedpassword')
    .then(() => {
      return disconnect()
      .then(() => {
        return true
      })
      .catch(() => {
        return expect.fail()
      })
    })
    .catch(() => {
      return expect.fail()
    })
  })
})

describe('user', () => {
  it('can be deleted if exists', () => {
    return authenticate(random + '@testing.com', 'updatedpassword')
    .then(() => {
      return auth.currentUser.delete()
      .then(() => {
        return true
      })
      .catch(() => {
        return expect.fail()
      })
    })
    .catch(() => {
      return expect.fail()
    })
  })
})

describe('user', () => {
  it('cannot be deleted if doesnt exists', () => {
    return authenticate(random + '@testing.com', 'updatedpassword')
    .then(() => {
      return auth.currentUser.delete()
      .then(() => {
        return expect.fail()
      })
      .catch(() => {
        return true
      })
    })
    .catch(() => {
      return true
    })
  })
})
*/
