var expect = require('chai').expect
var BillboardCrawler = require('./..')

var billboard = new BillboardCrawler()

describe('getChart', () => {
  it('should fetch chart data', async function () {
    this.timeout(0)
    const chart = await billboard.getChart()
    expect(chart).to.have.all.keys(['chartName', 'entries', 'currentDate', 'prevDate', 'nextDate', 'prevLink', 'nextLink', 'fetchTime'])
  })
})

describe('getYearEndChart', () => {
  it('should fetch year end chart data', async function () {
    this.timeout(0)
    const chart = await billboard.getYearEndChart()
    expect(chart).to.have.all.keys(['year', 'chartName', 'entries', 'fetchTime'])
  })
})

describe('getArtistChartHistory', () => {
  it('should fetch artist chart history', async function () {
    this.timeout(0)
    const result = await billboard.getArtistChartHistory('Joe Jonas')
    expect(result).to.have.all.keys(['no1Hits', 'top10Hits', 'totalSongs', 'entries'])
    expect(result.entries).to.have.lengthOf(result.totalSongs)
  })
})
