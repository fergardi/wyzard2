import { database } from '@/services/firebase'

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
    items.numChildren().should.equal(0)
  })
})
