import { database } from '@/services/firebase'

describe('database', () => {
  it('faction collection length should be 5', async () => {
    const items = await database.ref('factions').once('value')
    items.numChildren().should.equal(5)
  })
})

describe('database', () => {
  it('artifact collection length should be 20', async () => {
    const items = await database.ref('artifacts').once('value')
    items.numChildren().should.equal(20)
  })
})

describe('database', () => {
  it('spell collection length should be 100', async () => {
    const items = await database.ref('spells').once('value')
    items.numChildren().should.equal(100)
  })
})

describe('database', () => {
  it('unit collection length should be 50', async () => {
    const items = await database.ref('units').once('value')
    items.numChildren().should.equal(50)
  })
  it('unit maintenance costs should match unit power', async () => {
    const items = await database.ref('units').once('value')
    items.forEach(item => {
      let unit = item.val()
      let maintenance = unit.goldMaintenance + unit.peopleMaintenance + unit.manaMaintenance
      maintenance.should.equal(unit.power)
    })
  })
  it('unit potency should match unit power * 10', async () => {
    const items = await database.ref('units').once('value')
    items.forEach(item => {
      let unit = item.val()
      let potency = unit.damage + unit.health
      potency.should.equal(unit.power * 10)
    })
  })
})

describe('database', () => {
  it('god collection length should be 5', async () => {
    const items = await database.ref('gods').once('value')
    items.numChildren().should.equal(5)
  })
})

describe('database', () => {
  it('building collection length should be 10', async () => {
    const items = await database.ref('buildings').once('value')
    items.numChildren().should.equal(10)
  })
})

describe('database', () => {
  it('hero collection length should be 15', async () => {
    const items = await database.ref('heroes').once('value')
    items.numChildren().should.equal(15)
  })
})

/*
describe('database', () => {
  it('place collection length should be 5', async () => {
    const items = await database.ref('places').once('value')
    items.numChildren().should.equal(0)
  })
})
*/
