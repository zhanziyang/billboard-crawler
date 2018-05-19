const Crawler = require('crawler')
const moment = require('moment')
const SpotifyHelper = require('./spotify_helper')

class Billboard {
  constructor () {
    this.crawler = new Crawler({
      maxConnections: 1
    })
    this.baseUrl = 'https://www.billboard.com/charts'
  }

  getChart (chartName = 'hot-100', date = moment().format('YYYY-MM-DD')) {
    return new Promise((resolve, reject) => {
      this.crawler.queue({
        uri: `${this.baseUrl}/${chartName}/${date}`,
        callback: function (err, res, done) {
          if (err) {
            console.log(err)
          } else {
            const $ = res.$
            const chartName = $('.chart-name')
              .find('img')
              .eq(0)
              .attr('alt')
            const currentDate = $('.chart-nav')
              .find('time[datetime]')
              .attr('datetime')
            const $rows = $('article.chart-row')
            const prevLink = $("a[title='Previous Week']").attr('href')
            const nextLink = $("a[title='Next Week']").attr('href')
            const entries = $rows.map(function (i) {
              const $row = $(this)
              const tendency = $row
                .find('.chart-row__history')
                .attr('class')
                .match(/chart-row__history--(rising|falling|steady|none)/)[1]
              const rank = +$row.find('.chart-row__current-week').text()
              const lastPosMatch = $row
                .find('.chart-row__last-week')
                .text()
                .match(/\d+/)
              const lastPos = lastPosMatch ? +lastPosMatch[0] : null
              const title = $row
                .find('.chart-row__song')
                .text()
                .trim()
              const displayArtist = $row
                .find('.chart-row__artist')
                .text()
                .trim()
              const artistNames = displayArtist.split(/, | & | Featuring | Or | x /).map(item => item.trim())
              const topSpot = +$row.find('.chart-row__top-spot .chart-row__value').text()
              const weeksOnChart = +$row.find('.chart-row__weeks-on-chart .chart-row__value').text()
              const isNew = !!$row.find('.chart-row__new-indicator').length

              return {
                rank,
                lastPos,
                tendency,
                title,
                displayArtist,
                artistNames,
                topSpot,
                weeksOnChart,
                isNew
              }
            })
            const chart = {
              chartName,
              entries: entries.get(),
              currentDate,
              prevDate: prevLink ? prevLink.match(/\/(\d\d\d\d-\d\d-\d\d)/)[1] : null,
              nextDate: nextLink ? nextLink.match(/\/(\d\d\d\d-\d\d-\d\d)/)[1] : null,
              prevLink,
              nextLink,
              fetchTime: Date.now()
            }
            resolve(chart)
          }
        }
      })
    })
  }
}

module.exports = {
  Billboard,
  SpotifyHelper
}
