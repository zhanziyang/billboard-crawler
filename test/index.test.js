var expect = require('chai').expect
var { Billboard } = require('./..')

var billboard = new Billboard()

describe('getChart', () => {
  it('should fetch chart data', async () => {
    const chart = await billboard.getChart()
    expect(chart).to.have.all.keys(['chartName', 'entries', 'currentDate', 'prevDate', 'nextDate', 'prevLink', 'nextLink', 'fetchTime'])
  })
})
