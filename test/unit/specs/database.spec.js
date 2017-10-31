import { database } from '@/services/firebase'

describe('factions', () => {
  it('should be 5', () => {
    return database.ref('factions').once('value', snapshot => {
      return snapshot.numChildren().should.equal(5)
    })
  })
})

describe('artifacts', () => {
  it('should be 100', () => {
    return database.ref('artifacts').once('value', snapshot => {
      return snapshot.numChildren().should.equal(20)
    })
  })
})
